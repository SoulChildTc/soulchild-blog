# kubernetes 1.20.7 二进制安装-kubectl客户端配置以及kubeconfig说明(六)

<!--more-->
官方文档:
https://kubernetes.io/zh/docs/concepts/configuration/organize-cluster-access-kubeconfig/
https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands

### 1.安装kubectl
```bash
# 具体装在哪台机器根据自己的需求
cp /server/packages/kubernetes/server/bin/kubectl /usr/local/bin/

# 配置completion补全增强
echo 'source <(kubectl completion bash)' >> ~/.bashrc
source ~/.bashrc
```

### 2.配置kubeconfig
默认情况下，kubectl在`$HOME/.kube`目录下查找名为config的文件。 也可以通过设置`KUBECONFIG`环境变量或者设置`--kubeconfig`参数来指定kubeconfig文件。

kubeconfig由`集群信息`,`用户凭据`,`上下文`组成，这些内容在一个配置文件中可以配置多个，所以kubeconfig支持多集群配置,并且可以通过上下文来切换集群。

下面我们使用kubectl命令生成一个kubeconfig配置文件

#### 1.将群集信息添加到配置文件中
```bash
cd /etc/kubernetes/

# 配置apiserver地址、CA机构证书
kubectl config set-cluster kubernetes \
  --embed-certs=true \
  --certificate-authority=/etc/kubernetes/pki/ca/ca.pem \
  --server=https://172.17.20.200:6443 \
  --kubeconfig=admin.conf
```
参数说明: 
`--set-cluster kubernetes`: 后续的设置将对一个名为kubernetes的集群生效(不存在会在配置文件中添加)
`--embed-certs`: 设置为true，将证书信息内嵌到配置文件中(默认是配置的证书路径)
`--certificate-authority`: 指定一个信任的根CA，用于校验服务端证书
`--server`: 指定apiserver的地址
`--kubeconfig`: 指定配置文件路径

#### 2.将用户认证信息添加到配置文件中
```bash
kubectl config set-credentials admin \
  --embed-certs=true \
  --client-certificate=/etc/kubernetes/pki/admin.pem \
  --client-key=/etc/kubernetes/pki/admin-key.pem \
  --kubeconfig=admin.conf 
```
> 这时kubectl有了集群信息,用户认证信息，但还是不能使用，我们需要在添加一个上下文信息，用于表示哪个用户和哪个集群绑定
参数说明:
`set-credentials admin`: 对当前用户设置一个名称(随便起)
`--embed-certs`: 设置为true，将证书信息内嵌到配置文件中(默认是配置的证书路径)
`--client-certificate`: 访问apiserver使用的证书
`--client-key`: 访问apiserver使用的证书的私钥
`--kubeconfig`: 指定配置文件路径


#### 3.将上下文(context)信息添加到配置文件中
```bash
kubectl config set-context kubernetes \
  --cluster=kubernetes \
  --user=admin \
  --kubeconfig=admin.conf
```
> 将admin用户与kubernetes这个集群绑定,这时通过kubectl cluster info --kubeconfig=admin.conf --context=kubernetes就可以使用了，但是指定上下文很不方便，我们下一步设置一个默认的上下文
`set-context kubernetes`: 上下文的名称
`--cluster`: 指定哪个集群
`--user`: 指定哪个用户
`--kubeconfig`: 指定配置文件路径

#### 4.指定默认要使用哪个上下文配置
```bash
kubectl config use-context kubernetes --kubeconfig=admin.conf
```

#### 5.复制配置文件到默认查找目录
```bash
cp admin.conf ~/.kube/config
```

### 3.测试是否正常使用
```bash
kubectl cluster-info
kubectl get svc
```




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2478/  

