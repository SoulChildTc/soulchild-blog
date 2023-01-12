# k8s 1.14.2 升级集群至1.15.12

<!--more-->
## master节点：
#### 1.升级kubeadm
```bash
yum install -y kubeadm-1.15.12-0 --disableexcludes=kubernetes
```

查看版本```kubeadm version```

#### 2.检查可升级的版本
```kubeadm upgrade plan```

#### 3.升级kubeadm配置
```kubeadm upgrade apply v1.15.12```
最后可以看到提示：
`[upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.15.12". Enjoy!`

#### 4.升级kubelet和kubectl
```bash
yum install -y kubelet-1.15.12-0 kubectl-1.15.12-0 --disableexcludes=kubernetes
```

#### 5.升级CNI插件
容器网络接口（CNI）提供程序可能有其自己的升级说明。检查插件页面以找到您的CNI提供程序，并查看是否需要其他升级步骤。https://v1-15.docs.kubernetes.io/docs/concepts/cluster-administration/addons/
如果CNI程序是DaemonSet运行，则在其他节点上不需要执行此步骤

#### 6.升级其他master节点
```bash
kubeadm upgrade node
yum install -y kubelet-1.15.12-0 kubectl-1.15.12-0 --disableexcludes=kubernetes
```
#### 7.重启master节点kubelet
```systemctl restart kubelet```

## node节点：
升级kubeadm
```bash
yum install -y kubeadm-1.15.12-0 --disableexcludes=kubernetes
```

驱逐节点
```bash
kubectl drain <NodeName> --ignore-daemonsets
```

node节点执行升级kubeadm、kubelet：
```bash
kubeadm upgrade node
yum install -y kubelet-1.15.12-0 kubectl-1.15.x-0 --disableexcludes=kubernetes
```

重启kubelet：
```bash
systemctl restart kubelet
```

恢复node节点调度：
```bash
kubectl uncordon <NodeName>
```

查看升级后的节点版本信息：
```kubectl get nodes```

官方文档：
https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1795/  

