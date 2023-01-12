# kubernetes 1.20.7 二进制安装-使用cfssl生成配置证书(三)

<!--more-->
### 一、下载安装cfssl工具
```bash
wget -O /usr/local/bin/cfssl https://github.com/cloudflare/cfssl/releases/download/v1.6.0/cfssl_1.6.0_linux_amd64
wget -O /usr/local/bin/cfssljson https://github.com/cloudflare/cfssl/releases/download/v1.6.0/cfssljson_1.6.0_linux_amd64
wget -O /usr/local/bin/cfssl-certinfo https://github.com/cloudflare/cfssl/releases/download/v1.6.0/cfssl-certinfo_1.6.0_linux_amd64

chmod +x /usr/local/bin/cfssl*
```
### 二、配置工作目录
```bash
mkdir /etc/kubernetes/pki/{ca,etcd} -p
cd /etc/kubernetes/pki/ca
```

### 三、配置CA机构
#### 1.生成自签CA
```bash
# 创建自签证书请求配置文件
cat > ca-csr.json <<EOF
{
    "ca": {
        "expiry": "438000h"
    },
    "CN": "kubernetes",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF

# 生成ca的证书签名请求文件、ca私钥、ca证书
cfssl gencert -initca ca-csr.json | cfssljson -bare ca
```
> `ca.expiry:`: ca证书的过期时间，默认5年，我改成了50年
> `CN`: Common Name，kube-apiserver 从证书中提取该字段作为请求的用户名 (User Name)；浏览器使用该字段验证网站是否合法；
> `O`: Organization，kube-apiserver 从证书中提取该字段作为请求用户所属的组 (Group)
> `C`: 国家
> `ST`: 省份
> `L`: 城市

#### 2.准备CA用于签发的配置文件

后面使用的证书都会使用我们之前生成的CA来颁发，下面是颁发证书时的默认配置
```bash
cat > ca-config.json << EOF
{
    "signing": {
        "default": {
            "expiry": "87600h"
        },
        "profiles": {
            "kubernetes": {
                "expiry": "87600h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth",
                    "client auth"
                ]
            }
        }
    }
}
EOF
```
> `default.expiry`: 全局配置，颁发的证书默认有效期10年
> `profiles`中可以定义多个配置，这里定义了一个kubernetes，在使用的时候可以指定profile。例如: -config=ca-config.json -profile=kubernetes


### 四、签发etcd证书
#### 1.创建证书请求配置文件
```bash
cd /etc/kubernetes/pki/etcd/

cat > etcd-csr.json <<EOF
{
    "CN": "etcd",
    "hosts": [
        "127.0.0.1",
        "172.17.20.201",
        "172.17.20.202",
        "172.17.20.203"
    ],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF
```
> 这里的hosts也可以改成域名、会灵活一些，更换IP也不影响证书使用

#### 2.签发证书
```bash
cfssl gencert -ca /etc/kubernetes/pki/ca/ca.pem -ca-key /etc/kubernetes/pki/ca/ca-key.pem -config /etc/kubernetes/pki/ca/ca-config.json --profile kubernetes ./etcd-csr.json  | cfssljson -bare etcd
```

### 五.签发apiserver证书
apiserver服务端证书，用于证明自己是apiserver身份的。（通过hosts确认）
#### 1.创建证书请求配置文件
```bash
cd /etc/kubernetes/pki/
cat > apiserver-csr.json <<EOF
{
    "CN": "kubernetes",
    "hosts": [
        "127.0.0.1",
        "172.17.20.201",
        "172.17.20.202",
        "172.17.20.203",
        "172.17.20.200",
        "10.1.0.1",
        "kubernetes",
        "kubernetes.default",
        "kubernetes.default.svc",
        "kubernetes.default.svc.cluster",
        "kubernetes.default.svc.cluster.local"
    ],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF
```
> hosts需要填写master节点地址和vip,集群内部通信会用内部地址,所以也需要写上service ip以及内部域名。

#### 2.签发证书
```bash
cfssl gencert -ca /etc/kubernetes/pki/ca/ca.pem -ca-key /etc/kubernetes/pki/ca/ca-key.pem -config /etc/kubernetes/pki/ca/ca-config.json --profile kubernetes ./apiserver-csr.json  | cfssljson -bare apiserver
```


### 五.签发controller-manager证书
controller-manager作为apiserver的客户端，这里配置的是客户端证书,包含了客户端的信息。（CN代表用户）

#### 1.创建证书请求配置文件
```bash
cd /etc/kubernetes/pki/
cat > kube-controller-manager.json <<EOF
{
    "CN": "system:kube-controller-manager",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "hosts": [
        "127.0.0.1",
        "172.17.20.201",
        "172.17.20.202",
        "172.17.20.203"
    ],
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF
```
> k8s有一个内置的`ClusterRoleBinding`名为`system:kube-controller-manager`。
> 这个clusterrolebinding将`system:kube-controller-manager`这个clusterrole与用户`system:kube-controller-manager`绑定
> k8s通过证书中的CN获取用户名,所以指定CN为`system:kube-controller-manager`作为用户名,并且证书是由CA签名过的，所以CN指定的用户名是可信的。
> 如果部署完后你想查看，可以通过如下命令:`k get ClusterRolebinding system:kube-controller-manager -o yaml`
> 官方说明：https://kubernetes.io/zh/docs/setup/best-practices/certificates/#%E4%B8%BA%E7%94%A8%E6%88%B7%E5%B8%90%E6%88%B7%E9%85%8D%E7%BD%AE%E8%AF%81%E4%B9%A6

> controller-manager的高可用通过选举实现，只有一个实例在真正工作，所以这里的证书扩展中没有vip，我们的vip是给apiserver使用的。


#### 2.签发证书
```bash
cfssl gencert -ca /etc/kubernetes/pki/ca/ca.pem -ca-key /etc/kubernetes/pki/ca/ca-key.pem -config /etc/kubernetes/pki/ca/ca-config.json --profile kubernetes ./kube-controller-manager.json  | cfssljson -bare kube-controller-manager
```

### 六.签发scheduler证书
scheduler作为apiserver的客户端，这里配置的是客户端证书,包含了客户端的信息。（CN代表用户）

#### 1.创建证书请求配置文件
```bash
cd /etc/kubernetes/pki/
cat > kube-scheduler.json <<EOF
{
    "CN": "system:kube-scheduler",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "hosts": [
        "127.0.0.1",
        "172.17.20.201",
        "172.17.20.202",
        "172.17.20.203"
    ],
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF
```


#### 2.签发证书
```bash
cfssl gencert -ca /etc/kubernetes/pki/ca/ca.pem -ca-key /etc/kubernetes/pki/ca/ca-key.pem -config /etc/kubernetes/pki/ca/ca-config.json --profile kubernetes ./kube-scheduler.json  | cfssljson -bare kube-scheduler
```

### 七.签发kubectl(admin)证书
这里配置的是集群管理员(客户端)证书，kubectl作为客户端，需要指定一个配置文件(kubeconfig)，生成配置文件需要用到此证书。

#### 1.创建证书请求配置文件
```bash
cd /etc/kubernetes/pki/
cat > admin.json <<EOF
{
    "CN": "admin",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "hosts": [],
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "system:masters",
            "OU": "System"
        }
    ]
}
EOF
```
> 可以看下第五部分的简介，只不过这里绑定的不是User(用户)，而是Group(组),使用O指定组。如果部署完后你想查看，可以通过如下命令:`k get ClusterRolebinding cluster-admin -o yaml`

> 所以这里的CN可以随便写

#### 2.签发证书
```bash
cfssl gencert -ca /etc/kubernetes/pki/ca/ca.pem -ca-key /etc/kubernetes/pki/ca/ca-key.pem -config /etc/kubernetes/pki/ca/ca-config.json --profile kubernetes ./admin.json  | cfssljson -bare admin
```

### 八.签发kube-proxy证书
#### 1.创建证书请求配置文件
```bash
cd /etc/kubernetes/pki/
cat > kube-proxy.json <<EOF
{
    "CN": "system:kube-proxy",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "hosts": [],
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF
```
> 一个名为`system:node-proxier`的ClusterRoleBinding，将ClusterRole `system:node-proxier`与User(用户)`system:kube-proxy`绑定
> kube-proxy是node节点组件，IP并不是固定的，所以这里没有写hosts

#### 2.签发证书
```bash
cfssl gencert -ca /etc/kubernetes/pki/ca/ca.pem -ca-key /etc/kubernetes/pki/ca/ca-key.pem -config /etc/kubernetes/pki/ca/ca-config.json --profile kubernetes ./kube-proxy.json  | cfssljson -bare kube-proxy
```


### 九、关于kubelet证书
https://kubernetes.io/zh/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/

当集群开启了 TLS 认证后，每个节点的 kubelet 组件都要使用由 apiserver 使用的 CA 签发的有效证书才能与 apiserver 通讯；此时如果节点多起来，为每个节点单独签署证书将是一件非常繁琐的事情；

TLS bootstrapping 功能就是让 node节点上的kubelet组件先使用一个预定的低权限用户连接到 apiserver，然后向 apiserver 申请证书，kubelet 的证书由 apiserver 动态签署；

### 十、配置flannel证书
#### 1.创建证书请求配置文件
```bash
cd /etc/kubernetes/pki/

cat > flannel-csr.json <<EOF
{
    "CN": "flannel",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "Shanghai",
            "L": "Shanghai",
            "O": "k8s",
            "OU": "System"
        }
    ]
}
EOF
```
#### 2.签发证书
```bash
cfssl gencert -ca /etc/kubernetes/pki/ca/ca.pem -ca-key /etc/kubernetes/pki/ca/ca-key.pem -config /etc/kubernetes/pki/ca/ca-config.json --profile kubernetes ./flannel-csr.json  | cfssljson -bare flannel
```
> 此证书用于访问etcd使用




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2462/  

