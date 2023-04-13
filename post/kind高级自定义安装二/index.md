# Kind高级自定义安装(二)


<!--more-->

## 前言
上一章了解了使用 kind 快速创建一个简单 kubernetes 集群, 但在实际使用中往往是不够用的, 比如我们可能需要访问集群中部署的http服务, 或者我们要启用一些k8s默认关闭的特性, 安装多节点的 k8s 集群等等。为了完成这些高级功能，建议使用 YAML 文件来进行配置。这样可以更好地控制和定制集群。

## 使用yaml
在创建集群的时候使用 `kind create cluster --config=config.yaml` 就可以安装了。
在 yaml 配置中主要可以分为 `集群级别`的配置和`节点级别`的配置, 下面主要介绍常用的 yaml 配置怎么写。

> 完整的配置请查看结构体 https://github.com/kubernetes-sigs/kind/blob/v0.18.0/pkg/apis/config/v1alpha4/types.go#L20 

### 集群配置
#### 1. 集群名称
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: app-1-cluster
```

#### 2. 启用特性
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  "CSIMigration": true
```
> https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features

#### 3. 网络配置
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking: 
  ipFamily: ipv4 # 可选ipv4、ipv6、dual

  # 如果只需要本机访问就不用设置了
  apiServerPort: -1 # 在宿主机上的监听端口, 默认随机端口
  apiServerAddress: 127.0.0.1 # 在宿主机上的监听地址

  podSubnet: "10.244.0.0/16" # pod的网段, IPv4 默认 10.244.0.0/16, IPv6 默认 fd00:10:244::/56
  serviceSubnet: "10.96.0.0/16" # service的网段, IPv4 默认 10.96.0.0/16, IPv6 默认 fd00:10:96::/112
  disableDefaultCNI: false # 默认false, 如果为 true 将不会安装kindnetd, kindnetd是kind附带的一个简单的网络实现
  kubeProxyMode: "iptables" # 默认 iptables , 可选 ipvs 
  dnsSearch: # 搜索域
  - xxx.local
```

> KubeadmConfigPatches 用来修改 kubeadm 的配置和
> 
> KubeadmConfigPatchesJSON6902 设置合并策略
>
> ContainerdConfigPatches 和 ContainerdConfigPatchesJSON6902 用来修改 containerd 的配置

### 节点配置
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane # 可选 control-plane 和 worker
  image: kindest/node:v1.16.4@sha256:b91a2c2317a000f3a783489dfb755064177dbc3a0b2f4147d50f04825d016f55
  labels: ... # 节点标签,用于nodeSelector
  extraMounts: 
  - containerPath: # k8s节点中的路径
    hostPath: # 宿主机路径
    readOnly: false # 是否只读, 默认false
    selinuxRelabel: false # 默认false
    propagation: None # 设置 propagation 模式, 可选None, HostToContainer, Bidirectional, 一般默认即可
  extraPortMappings: 
  - containerPort: 80 # k8s节点中的端口
    hostPort: 80 # 宿主机的端口
    listenAddress: 0.0.0.0 # 宿主机的监听地址,默认0.0.0.0
    protocol: TCP # 可选 TCP, UDP, SCTP
```
> KubeadmConfigPatches 用来修改当前节点的 kubeadm 的配置
> 
> KubeadmConfigPatchesJSON6902 设置合并策略

## 部署一个带ingress的集群

### 1. 创建集群
```bash
[root@mytest kind]# cat > mykind2.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: mykind2
nodes:
- role: control-plane
  labels:
    ingress-ready: true
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
EOF

[root@mytest kind]# kind create cluster --config test-c.yaml 
Creating cluster "mykind2" ...
 ✓ Ensuring node image (kindest/node:v1.26.3) 🖼
 ✓ Preparing nodes 📦 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
 ✓ Joining worker nodes 🚜 
Set kubectl context to "kind-mykind2"
You can now use your cluster with:

kubectl cluster-info --context kind-mykind2

Thanks for using kind! 😊
```

### 2. 安装ingress-nginx-controller
```bash
[root@mytest kind]# kubectl --context kind-mykind2 apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

### 3. 查看pod状态
```bash
[root@mytest ~]# kubectl --context kind-mykind2 get pod -n ingress-nginx -o wide 
NAME                                        READY   STATUS      RESTARTS   AGE   IP           NODE                    NOMINATED NODE   READINESS GATES
ingress-nginx-admission-create-fgdsj        0/1     Completed   0          60s   10.244.1.7   mykind2-worker          <none>           <none>
ingress-nginx-admission-patch-7l5bv         0/1     Completed   2          60s   10.244.1.6   mykind2-worker          <none>           <none>
ingress-nginx-controller-6bdf7bdbdd-lq6f8   1/1     Running     0          60s   10.244.0.6   mykind2-control-plane   <none>           <none>
```

### 4. 创建测试应用
yaml 如下
```yaml
kind: Pod
apiVersion: v1
metadata:
  name: foo-app
  labels:
    app: foo
spec:
  containers:
  - command:
    - /agnhost
    - netexec
    - --http-port
    - "8080"
    image: registry.k8s.io/e2e-test-images/agnhost:2.39
    name: foo-app
---
kind: Service
apiVersion: v1
metadata:
  name: foo-service
spec:
  selector:
    app: foo
  ports:
  # Default port used by the image
  - port: 8080
---
kind: Pod
apiVersion: v1
metadata:
  name: bar-app
  labels:
    app: bar
spec:
  containers:
  - command:
    - /agnhost
    - netexec
    - --http-port
    - "8080"
    image: registry.k8s.io/e2e-test-images/agnhost:2.39
    name: bar-app
---
kind: Service
apiVersion: v1
metadata:
  name: bar-service
spec:
  selector:
    app: bar
  ports:
  # Default port used by the image
  - port: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  rules:
  - http:
      paths:
      - pathType: Prefix
        path: /foo(/|$)(.*)
        backend:
          service:
            name: foo-service
            port:
              number: 8080
      - pathType: Prefix
        path: /bar(/|$)(.*)
        backend:
          service:
            name: bar-service
            port:
              number: 8080
```

### 5. 访问测试
```bash
[root@mytest kind]# curl http://192.168.124.52/foo/hostname ;echo
foo-app
[root@mytest kind]# curl http://192.168.124.52/bar/hostname ;echo
bar-app
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/kind%E9%AB%98%E7%BA%A7%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AE%89%E8%A3%85%E4%BA%8C/  

