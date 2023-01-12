# kubeadm部署kubernetes 1.14单主集群

<!--more-->
本文参考：https://www.kubernetes.org.cn/5462.html

<span style="font-size: 14pt;"><strong>1-6步在三台主机上都做配置</strong></span>

&nbsp;

<span style="font-size: 12pt;"><strong>1.三台主机配置主机名</strong></span>
<table width="400">
<tbody>
<tr>
<td width="99">主机名</td>
<td width="87">ip</td>
</tr>
<tr>
<td>test-k8s-master</td>
<td>10.0.0.10</td>
</tr>
<tr>
<td>test-k8s-node1</td>
<td>10.0.0.11</td>
</tr>
<tr>
<td>test-k8s-node2</td>
<td>10.0.0.12</td>
</tr>
</tbody>
</table>
&nbsp;

<span style="font-size: 12pt;"><strong>2.设置hosts解析</strong></span>
<pre class="line-numbers" data-start="1"><code class="language-bash">cat &lt;&lt;EOF &gt;&gt;/etc/hosts
10.0.0.10 test-k8s-master
10.0.0.11 test-k8s-node1
10.0.0.12 test-k8s-node2
EOF</code></pre>
&nbsp;

<span style="font-size: 12pt;"><strong>3.关闭防火墙、selinux和swap。</strong></span>
<pre class="line-numbers" data-start="1"><code class="language-bash">systemctl stop firewalld
systemctl disable firewalld
setenforce 0
sed -i "s/^SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
swapoff -a
sed -i 's/.*swap.*/#&amp;/' /etc/fstab</code></pre>
&nbsp;

<span style="font-size: 12pt;"><strong>4.配置内核参数，将桥接的IPv4流量传递到iptables的链</strong></span>
<pre class="line-numbers" data-start="1"><code class="language-bash">cat &gt; /etc/sysctl.d/k8s.conf &lt;&lt;EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

sysctl --system
</code></pre>
&nbsp;

<span style="font-size: 12pt;"><strong>5.配置k8s源和docker源</strong></span>
<pre class="line-numbers" data-start="1"><code class="language-bash">#k8s源
cat &lt;&lt;EOF &gt; /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF


#docker源
wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo
</code></pre>
&nbsp;

<span style="font-size: 12pt;"><strong>6.安装软件</strong></span>

6.1.安装docker
<pre class="line-numbers" data-start="1"><code class="language-bash">yum install -y docker-ce-18.06.1.ce-3.el7

systemctl enable docker &amp;&amp; systemctl start docker

docker –v
Docker version 18.06.1-ce, build e68fc7a</code></pre>
&nbsp;

6.2修改文件驱动为systemd，和kubelet一致,修改docker存储路径
<pre class="line-numbers" data-start="1"><code class="language-bash">vim /etc/docker/daemon.json
{
   "exec-opts": ["native.cgroupdriver=systemd"] ,
    "graph": "/data/docker"
}

systemctl restart docker</code></pre>
&nbsp;

6.3.安装kubeadm、kubelet、kubectl
<pre class="line-numbers" data-start="1"><code class="language-bash">yum install -y kubelet-1.14.2-0 kubectl-1.14.2-0 kubeadm-1.14.2-0

systemctl enable kubelet</code></pre>
kubeadm：快速安装k8s的工具

kubelet：master通过kubelet与node通信，并进行本节点Pod和容器生命周期的管理

kubectl：k8s集群管理工具

&nbsp;

<span style="font-size: 12pt;"><strong>7.部署master节点</strong></span>

在master进行Kubernetes集群初始化。
<pre class="line-numbers" data-start="1"><code class="language-bash">kubeadm init --kubernetes-version=1.14.2 \
--apiserver-advertise-address=10.0.0.10 \
--image-repository registry.aliyuncs.com/google_containers \
--service-cidr=10.1.0.0/16 \
--pod-network-cidr=10.244.0.0/16</code></pre>
定义POD的网段为: 10.244.0.0/16， api server地址就是master本机IP地址。

这一步很关键，由于kubeadm 默认从官网k8s.grc.io下载所需镜像，国内无法访问，因此需要通过–image-repository指定阿里云镜像仓库地址

&nbsp;

集群初始化成功后返回如下信息（需要记录下来）：
<pre class="line-numbers" data-start="1"><code class="language-bash">Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.0.0.10:6443 --token da24z4.dg7gxgrer1ywvoyv \
    --discovery-token-ca-cert-hash sha256:748cdf603bce6057848493c2fcf8898b9ca37c16ac83129e5d7c47ad8d868528</code></pre>
&nbsp;

按照提示执行：
<pre class="line-numbers" data-start="1"><code class="language-bash">  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config</code></pre>
&nbsp;

配置flannel网络：
<pre class="line-numbers" data-start="1"><code class="language-bash">kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/a70459be0084506e4ec919aa1c114638878db11b/Documentation/kube-flannel.yml
</code></pre>
&nbsp;

<span style="font-size: 12pt;"><strong>8.部署node节点</strong></span>

执行上面记录的命令，使所有node节点加入Kubernetes集群
<pre class="line-numbers" data-start="1"><code class="language-bash">kubeadm join 10.0.0.10:6443 --token da24z4.dg7gxgrer1ywvoyv \
    --discovery-token-ca-cert-hash sha256:748cdf603bce6057848493c2fcf8898b9ca37c16ac83129e5d7c47ad8d868528</code></pre>
&nbsp;

部署完node节点后验证：
<pre class="line-numbers" data-start="1"><code class="language-bash">[root@test-k8s-master ~]# kubectl get nodes
NAME STATUS ROLES AGE VERSION
test-k8s-master Ready master 61m v1.14.2
test-k8s-node1 Ready &lt;none&gt; 16m v1.14.2
test-k8s-node2 NotReady &lt;none&gt; 16m v1.14.2</code></pre>
node2处于异常状态

排查：
<pre class="line-numbers" data-start="1"><code class="language-bash">kubectl get all -o wide -n kube-system


发现node2节点的flannel镜像下载失败
pod/kube-flannel-ds-amd64-zhdcj 0/1 Init:ImagePullBackOff

查看pod详细信息：
kubectl describe pod kube-flannel-ds-amd64-zhdcj -n kube-system

尝试手动pull镜像,不行就在docker hub上找一个了
在node2节点执行
docker pull quay.io/coreos/flannel:v0.11.0-amd64

pull下来等一小会node2就正常了

</code></pre>
&nbsp;

9.部署dashboard

1.下载yaml文件
<pre class="line-numbers" data-start="1"><code class="language-bash">wget https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml</code></pre>
使用如下命令或直接手动编辑kubernetes-dashboard.yaml文件，由于无法科学上网，所以将镜像地址修改为docker hub的，在添加一个nodeport端口，提供外部访问
<pre class="line-numbers" data-start="1"><code class="language-bash">sed -i 's/k8s.gcr.io/soulchildtjh/g' kubernetes-dashboard.yaml
sed -i '/targetPort:/a\ \ \ \ \ \ nodePort: 30001\n\ \ type: NodePort' kubernetes-dashboard.yaml</code></pre>
&nbsp;

2.部署dashboard
<pre class="line-numbers" data-start="1"><code class="language-bash">kubectl create -f kubernetes-dashboard.yaml</code></pre>
&nbsp;

3.创建完成后，检查相关服务运行状态
<pre class="line-numbers" data-start="1"><code class="language-bash">kubectl get deployment kubernetes-dashboard -n kube-system

kubectl get pods -n kube-system -o wide

kubectl get services -n kube-system

netstat -ntlp|grep 30001</code></pre>
&nbsp;

4.访问dashboard

https://10.10.10.10:30001

&nbsp;

5.配置查看登录令牌
<pre class="line-numbers" data-start="1"><code class="language-bash">kubectl create serviceaccount  dashboard-admin -n kube-system
kubectl create clusterrolebinding  dashboard-admin --clusterrole=cluster-admin --serviceaccount=kube-system:dashboard-admin
kubectl describe secrets -n kube-system `kubectl get secret -n kube-system | awk '/dashboard-admin/{print $1}'` | grep token: | awk '{print $2}'</code></pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1100/  

