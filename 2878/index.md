# kubectl debug - 社区方案

<!--more-->
github
https://github.com/aylei/kubectl-debug
https://github.com/JamesTGrant/kubectl-debug

原作教程
https://aleiwu.com/post/kubectl-debug-intro/


正如readme中所说
> 从 kubernetes 1.23开始，临时容器功能处于测试阶段（默认启用） 
临时容器功能从 kubernetes 1.16到1.22 处于alpha阶段。在 Kubernetes 中，默认情况下，需要显式启用 alpha 功能（默认情况下不启用alpha功能）。
> 在老版本的集群中，我们就可以用下面的这种方式来实现kubectl debug


### 一、安装
```bash
wget https://github.com/aylei/kubectl-debug/releases/download/v0.1.1/kubectl-debug_0.1.1_linux_amd64.tar.gz
tar xf kubectl-debug_0.1.1_linux_amd64.tar.gz
chmod +x kubectl-debug
mv kubectl-debug /usr/local/bin
```

### 二、示例
创建测试Pod
```bash
kubectl run ephemeral-demo --image=registry.aliyuncs.com/google_containers/pause:3.1 --restart=Never
```

#### 1.简单调试
```bash
kubectl debug ephemeral-demo --agentless --port-forward --agent-image=aylei/debug-agent:v0.1.1
```
> 如果看到Error: No such image: nicolaka/netshoot:latest这样的错误，需要手动去对应的Node上拉取nicolaka/netshoot:latest镜像。或者使用参数`--agent-image=aylei/debug-agent:v0.1.1`

访问目标容器的根文件系统: `cd /proc/1/root/`


#### 2.fork
排查 CrashLoopBackoff 是一个很麻烦的问题，Pod 可能会不断重启， kubectl exec 和 kubectl debug 都没法稳定进行排查问题，基本上只能寄希望于 Pod 的日志中打印出了有用的信息。 为了让针对 CrashLoopBackoff 的排查更方便， kubectl-debug 参考 oc debug 命令，添加了一个 --fork 参数。当指定 --fork 时，插件会复制当前的 Pod Spec，做一些小修改， 再创建一个新 Pod：

- 新 Pod 的所有 Labels 会被删掉，避免 Service 将流量导到 fork 出的 Pod 上
- 新 Pod 的 ReadinessProbe 和 LivnessProbe 也会被移除，避免 kubelet 杀死 Pod
- 新 Pod 中目标容器（待排障的容器）的启动命令会被改写为`sh`，避免新 Pod 继续 Crash(这需要目标容器包含sh,上面的例子不行)

接下来，我们就可以在新 Pod 中尝试复现旧 Pod 中导致 Crash 的问题。为了保证操作的一致性，可以先 chroot 到目标容器的根文件系统中
```bash
kubectl debug demo-pod --fork

chroot /proc/1/root
```


### 三、安装daemonset agent
```bash
# kubernetes版本大于等于1.16
kubectl apply -f https://raw.githubusercontent.com/aylei/kubectl-debug/master/scripts/agent_daemonset.yml

# kubernetes版本小于v1.16
wget https://raw.githubusercontent.com/aylei/kubectl-debug/master/scripts/agent_daemonset.yml
sed -i '' '1s/apps\/v1/extensions\/v1beta1/g' agent_daemonset.yml
kubectl apply -f agent_daemonset.yml

# 使用agent模式
kubectl debug --agentless=false POD_NAME
```
> 注意阿里云ack使用的cni terway是不支持hostPort的，所以需要改为hostNetwork或者使用`--port-forward`参数
> 最好将yaml中的镜像修改为`aylei/debug-agent:v0.1.1`


### 四、配置文件

~/.kube/debug-config
```bash
# debug agent listening port(outside container)
# default to 10027
agentPort: 10027

# whether using agentless mode
# default to true
agentless: false
# namespace of debug-agent pod, used in agentless mode
# default to 'default'
agentPodNamespace: default
# prefix of debug-agent pod, used in agentless mode
# default to  'debug-agent-pod'
agentPodNamePrefix: debug-agent-pod
# image of debug-agent pod, used in agentless mode
# default to 'aylei/debug-agent:latest'
agentImage: aylei/debug-agent:v0.1.1

# daemonset name of the debug-agent, used in port-forward
# default to 'debug-agent'
debugAgentDaemonset: debug-agent
# daemonset namespace of the debug-agent, used in port-forwad
# default to 'default'
debugAgentNamespace: default
# whether using port-forward when connecting debug-agent
# default true
portForward: true
# image of the debug container
# default as showed
image: nicolaka/netshoot:v0.1
# start command of the debug container
# default ['bash']
command:
- '/bin/bash'
- '-l'
# private docker registry auth kuberntes secret
# default registrySecretName is kubectl-debug-registry-secret
# default registrySecretNamespace is default
#registrySecretName: my-debug-secret
#registrySecretNamespace: debug
# in agentless mode, you can set the agent pod's resource limits/requests:
# default is not set
agentCpuRequests: ""
agentCpuLimits: ""
agentMemoryRequests: ""
agentMemoryLimits: ""
# in fork mode, if you want the copied pod retains the labels of the original pod, you can change this params
# format is []string
# If not set, this parameter is empty by default (Means that any labels of the original pod are not retained, and the labels of the copied pods are empty.)
forkPodRetainLabels: []
# You can disable SSL certificate check when communicating with image registry by 
# setting registrySkipTLSVerify to true.
registrySkipTLSVerify: false
# You can set the log level with the verbosity setting
verbosity : 0
```

目前遇到一个问题，进入的shell会发生错乱, 和kubecolor有关系。 


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2878/  

