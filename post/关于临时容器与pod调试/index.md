# 关于临时容器与Pod调试


<!--more-->
特性状态: Kubernetes v1.25 [stable]

### 临时容器和普通容器的区别

- 临时容器没有端口配置，因此像 ports，livenessProbe，readinessProbe 这样的字段是不允许的。
- Pod 资源分配是不可变的，因此 resources 配置是不允许的。
- 有关允许字段的完整列表，请参见 [EphemeralContainer 参考文档](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.25/#ephemeralcontainer-v1-core)。

临时容器是使用 API 中的一种特殊的 ephemeralcontainers 处理器进行创建的， 而不是直接添加到 pod.spec ，因此无法使用 kubectl edit 来添加一个临时容器。与常规容器一样，将临时容器添加到 Pod 后，将不能更改或删除临时容器

### 临时容器的用途

当由于容器崩溃或容器镜像不包含调试工具而导致 kubectl exec 无用时， 临时容器对于交互式故障排查很有用。

尤其是，[Distroless 镜像](https://github.com/GoogleContainerTools/distroless) 允许用户部署最小的容器镜像，从而减少攻击面并减少故障和漏洞的暴露。 由于 distroless 镜像不包含 Shell 或任何的调试工具，因此很难单独使用 kubectl exec 命令进行故障排查。

使用临时容器时，启用 [进程名字空间共享](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/) 很有帮助，可以查看其他容器中的进程。

### 使用临时容器调试Pod

#### 1. 普通debug调试

首先创建一个Pod, 我们使用临时容器来调试这个Pod

```bash
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
```

使用 kubectl exec 来创建一个 shell，你将会看到一个错误，因为这个容器镜像中没有 shell。

```bash
kubectl exec -it ephemeral-demo -- sh
```

> error: Internal error occurred: error executing command in container: failed to exec in container: failed to start exec "23b3fa827fb214fade3271402e482e9c49f5ed17172d69428279d7acee2357ae": OCI runtime exec failed: exec failed: unable to start container process: exec: "sh": executable file not found in $PATH: unknown

我们使用临时容器的特性来调试这个pod

```bash
[root@k8s-master-01 yaml]# kubectl debug -it ephemeral-demo --image=busybox:1.28 --target=ephemeral-demo
Defaulting debug container name to debugger-nb7vl.
If you don't see a command prompt, try pressing enter.
/ # 
```

> --image 指定临时容器的镜像
> --target 指定调试目标容器的名称，目的是将临时容器的进程命名空间加入到要调试的容器中。 当然你不想他们在同一个进程命名空间中不加也无所谓
> cd /proc/1/root可以看到ephemeral-demo容器的文件系统

### 使用非临时容器调试Pod

#### 1. 复制Pod调试-加入调试容器

kubectl会创建新的pod副本，**这不会影响到原有的Pod**，并且新的pod中有我们指定的调试容器，但是这里使用的不是临时容器，而是普通容器。

```bash
[root@k8s-master-01 yaml]# kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
Defaulting debug container name to debugger-8zmpv.
If you don't see a command prompt, try pressing enter.
```

> --image 调试容器的镜像
> --copy-to=myapp-debug 表示复制pod，不会对原pod造成侵入
> --share-processes 开启Pod的share-processes。 (pod.spec.shareProcessNamespace=true) 因为使用了复制Pod调试，这里就不再创建临时容器了，而是普通容器

#### 2. 复制Pod调试-仅改变原容器启动命令

这个和上面的区别是，这里并没有添加调试容器，而是复制了Pod，然后改变了原容器的启动命令，所以这种方式不需要指定镜像，因为他只改变了容器的启动命令

我们有一个如下的Pod，他在运行后立刻会异常退出

```bash
kubectl run --image=busybox:1.28 myapp -- false
```

假如我们不知道为什么启动命令执行失败了，我们通过如下命令，可以进入到pod中手动调试启动命令

```bash
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

> --container=myapp -- sh  表示我们要将myapp容器的启动命令改为sh

#### 3. 复制Pod调试-仅改变原容器镜像

创建一个pod

```bash
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

让我们调试这个pod，将他的镜像改为ubuntu

```bash
kubectl debug myapp --copy-to=myapp-debug --set-image *=ubuntu
```

> --set-image *=ubuntu 设置所有容器的镜像为ubuntu，如果要分别指定，请参考--set-image busybox=busybox nginx=nginx:1.9.1

#### 总结

1. 当我们排查问题需要保留现场才可以排查时，临时容器的用处就大
2. 如果我们不希望破坏原Pod，可以使用复制Pod副本的方式(复制的Pod是不包含label的，所以无需担心流量问题)
3. 复制Pod调试的方式2和方式3可以结合在一起使用，但是貌似没什么用
4. debug镜像推荐 `nicolaka/netshoot:v0.8`
5. 复制Pod的方式用完了，别忘记删除调试Pod


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/%E5%85%B3%E4%BA%8E%E4%B8%B4%E6%97%B6%E5%AE%B9%E5%99%A8%E4%B8%8Epod%E8%B0%83%E8%AF%95/  

