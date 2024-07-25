# Kubectl插件之dumpy


<!--more-->


## 安装

### 1. Using Krew:

```shell
kubectl krew install dumpy
```

### 2. Manual installation:
```shell
curl -L -O https://github.com/larryTheSlap/dumpy/releases/download/v0.1.0/dumpy_Linux_x86_64.tar.gz
tar xf dumpy_Linux_x86_64.tar.gz 
chmod +x kubectl-dumpy && sudo mv kubectl-dumpy /usr/bin/kubectl-dumpy
```

## 使用

### 1. 创建一个捕获器

```shell
# 在 default 名称空间创建一个名为 captrue-ingress-nginx 捕获器, 用于捕获 default 名称空间的 deployment nginx
(⎈|mykind) ➜ ~ k dumpy capture deployment nginx -n default -t default --name captrue-nginx -f '-i any' --image registry.cn-hangzhou.aliyuncs.com/soulchild/dumpy:0.2.0
```

### 2. 查看捕获器

可以看到 Deployment 有两个 pod , 所以启动了两个 pod 来分别捕获他们的流量
```shell
(⎈|mykind) ➜ ~ k dumpy get captrue-nginx
Getting capture details..

name: captrue-nginx
namespace: default
tcpdumpfilters: -i any
image: registry.cn-hangzhou.aliyuncs.com/soulchild/dumpy:0.2.0
targetSpec:
    name: nginx
    namespace: default
    type: deployment
    container: nginx
    items:
        nginx-7dbbdcd99d-dz9r5  <-----  sniffer-captrue-nginx-1761 [Running]
        nginx-7dbbdcd99d-g82gc  <-----  sniffer-captrue-nginx-9964 [Running]
pvc:
pullsecret:
```

### 3. 导出 pcap

```shell
# 导出之前可以看看 pod 日志有没有捕获到流量
(⎈|mykind) ➜ ~ k logs sniffer-captrue-nginx-1761

# 导出 captrue-nginx 捕获器的 pcap 到当前目录 -n 指定捕获器所在的名称空间
(⎈|mykind) ➜ ~ k dumpy export captrue-nginx ./ -n default
```

### 4. 重启捕获器

重启会重新创建 pod 并删除老 pod, 所以可以指定新的 filter, 可以理解为重新捕获
```shell
(⎈|mykind) ➜ ~ k dumpy restart captrue-nginx

# or

(⎈|mykind) ➜ ~ k dumpy restart captrue-nginx -f '-i eth0'
```

### 5. 停止捕获

```shell
(⎈|mykind) ➜ ~ k dumpy stop captrue-nginx -n default
```

### 6. 删除捕获器

```bash
(⎈|mykind) ➜ ~ k dumpy delete captrue-nginx -n default
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/721812133/  

