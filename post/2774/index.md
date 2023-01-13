# ChaosMesh-安装

<!--more-->
实验环境:
k8s v1.21.0
helm v3.1.2


1、创建namespace
```bash
kubectl create namespace chaos-mesh
```

2、用helm直接安装
```bash
helm repo add chaos-mesh https://charts.chaos-mesh.org
helm repo update

# 使用helm安装
# docker cri
helm install chaos-mesh chaos-mesh/chaos-mesh --version v2.0.0 --namespace chaos-mesh

# containerd cri
helm install chaos-mesh chaos-mesh/chaos-mesh --version v2.0.0 --namespace chaos-mesh --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock

```
> 清单生成: helm template chaos-mesh chaos-mesh/chaos-mesh --version v2.0.0 --include-crds --namespace chaos-mesh > chaos-mesh.install.yaml

3、查看安装的组件
```bash
kubectl get deploy,ds,pods,svc --namespace chaos-mesh
```
> chaos-controller-manager: Chaos Mesh的核心逻辑组件，主要负责混沌实验的调度与管理。该组件包含多个 CRD Controller，例如 Workflow Controller、Scheduler Controller 以及各类故障类型的 Controller。

> chaos-daemon: 是具体执行故障注入的组件，以daemonset的方式运行.默认拥有Privileged权限（可以关闭）。该组件主要通过侵入目标 Pod Namespace 的方式干扰具体的网络设备、文件系统、内核等。

> chaos-dashboard: 可视化组件，用户可通过该界面对混沌实验进行操作和观测。同时，Chaos Dashboard 还提供了 RBAC 权限管理机制。

4、通过nodeport访问dashboard


5、配置token
```bash
# 创建超级管理员账号
k create sa -n chaos-mesh superadmin

# 绑定管理员权限
k create clusterrolebinding --clusterrole=cluster-admin --serviceaccount=chaos-mesh:superadmin superadmin-binding

# 获取登陆token
k get secret -n chaos-mesh $(k get sa -n chaos-mesh superadmin -o jsonpath={.secrets[0].name}) -o jsonpath={.data.token} | base64 -d
```
name随便输入，token输入我们获取的，然后就可以去dashboard中探索混沌工程的世界了


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2774/  

