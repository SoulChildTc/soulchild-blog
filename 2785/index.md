# ubuntu使用kubeadm安装k8s1.23.1

<!--more-->
参考: 
https://kubernetes.io/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/
https://kubernetes.io/zh/docs/reference/setup-tools/kubeadm/kubeadm-init

### 一、调整内核参数及模块
```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 设置必需的 sysctl 参数，这些参数在重新启动后仍然存在。
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF


# 应用 sysctl 参数而无需重新启动
sudo sysctl --system
```

### 二、修改主机名、配置hosts
```bash
cat >> /etc/hosts <<EOF
10.0.33.162    k8s-master
10.0.33.163    k8s-node1
10.0.33.164    k8s-node2
10.0.33.165    k8s-node3
10.0.33.166    k8s-node4
10.0.33.167    k8s-node5
10.0.33.168    k8s-node6
10.0.33.169    k8s-node7
EOF
```

### 三、安装containerd
```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install containerd

sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

sudo systemctl start containerd
```

### 四、配置containerd
```bash
# 修改cgroups为systemd
sudo sed -i 's#SystemdCgroup = false#SystemdCgroup = true#' /etc/containerd/config.toml

# 修改基础设施镜像
sudo sed -i 's#sandbox_image = "k8s.gcr.io/pause:3.5"#sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"#' /etc/containerd/config.toml


sudo systemctl restart containerd
```

### 四、安装kubeadm、kubectl、kubelet
```bash
curl -fsSL https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/kubernetes-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list


sudo apt-get update
sudo apt-get install -y kubelet=1.23.1 kubeadm=1.23.1 kubectl=1.23.1
# 阻止upgrade的时候更新包
sudo apt-mark hold kubelet kubeadm kubectl
```

### 五、安装
```bash
sudo kubeadm init --kubernetes-version stable-1 \
--apiserver-advertise-address 10.0.33.162 \
--control-plane-endpoint k8s-master \
--image-repository registry.aliyuncs.com/google_containers \
--pod-network-cidr 172.17.0.0/16 \
--service-cidr 172.16.0.0/16 \
--cri-socket /run/containerd/containerd.sock \
--ignore-preflight-errors NumCPU \
--upload-certs --v 5| tee kubeadm-init.log
```

### 六、配置kubeconfig
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 七、添加节点
```bash
# master节点
kubeadm join k8s-master:6443 --token 0s2sl7.dz31xgqybfiytgpk \
        --discovery-token-ca-cert-hash sha256:4ae005a85ef260b48a71cd5c93f4a7900e376b03ff80debe3cd08ab14021535b \
        --control-plane --certificate-key 9980691961686c8cbf8a3ddb4ecdde88e80f40d65f7b270ab3dc8e8afbc36102


# node节点
kubeadm join k8s-master:6443 --token 0s2sl7.dz31xgqybfiytgpk \
        --discovery-token-ca-cert-hash sha256:4ae005a85ef260b48a71cd5c93f4a7900e376b03ff80debe3cd08ab14021535b 
```

### 八、安装calico
```bash
curl https://docs.projectcalico.org/archive/v3.20/manifests/calico.yaml -O
kubectl apply -f calico.yaml
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2785/  

