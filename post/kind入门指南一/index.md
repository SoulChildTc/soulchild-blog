# Kind入门指南(一)


<!--more-->

## 什么是 Kind?
kind 可以让您在本地运行 Kubernetes 集群。它使用 Docker 容器来模拟 Kubernetes 集群的节点，并使用 kubeadm 来启动集群。

kind 主要用于测试 Kubernetes 本身，但也可用于本地开发或 CI。

## 为什么要使用 Kind?
使用 Kind 具有以下优点: 

- 快速搭建: 在几分钟内创建和销毁 Kubernetes 集群，而无需等待云提供商资源。
- 便于测试: Kind 使用 Docker 容器来模拟 Kubernetes 节点，因此您可以轻松地对整个集群或单个组件进行测试。
- 简化开发: Kind 可以在本地提供一个类似于生产环境的 Kubernetes 集群，从而加快应用程序的开发和调试过程。
- 可移植性: Kind 可以在任何支持 Docker 的环境中运行，例如本地机器、CI/CD 系统、云环境等。

## 安装和配置 Kind

### 1：安装 Docker
略

### 2. 安装 kind
```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.18.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

## 常用操作

### 1. 创建一个单节点 Kubernetes 集群
```bash
kind create cluster --name mykind1 --wait 5m
```
> 默认 name 为 kind
> 
> 默认安装最新的版本, 可以通过 `--image kindest/node:v1.26.3` 指定k8s版本
> 
> 安装成功后需要自行安装配置 kubectl, wget https://dl.k8s.io/v1.26.3/kubernetes-client-linux-amd64.tar.gz

### 2. 查看集群列表
```bash
kind get clusters
```

### 3. 删除集群
```bash
kind delete cluster --name mykind1
```
> 默认删除 name 为 kind 的集群

### 4. 将容器镜像导入到集群中
导入本地镜像到集群中
```bash
kind load docker-image my-custom-image-0 my-custom-image-1 --name mykind1
```
> 这将导入 `my-custom-image-0`,`my-custom-image-1` 到 mykind1 集群中

导入归档文件镜像到集群中
```bash
kind load image-archive /my-image-archive.tar
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/kind%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97%E4%B8%80/  

