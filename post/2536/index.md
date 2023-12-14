# kubernetes 1.20.7 二进制安装-配置master污点和role lable(十四)

<!--more-->
添加污点

```bash
kubectl taint node 172.17.20.201 node-role.kubernetes.io/master:NoSchedule
kubectl taint node 172.17.20.202 node-role.kubernetes.io/master:NoSchedule
kubectl taint node 172.17.20.203 node-role.kubernetes.io/master:NoSchedule
```

配置角色标签

```bash
kubectl label nodes 172.17.20.201 node-role.kubernetes.io/master=
kubectl label nodes 172.17.20.201 node-role.kubernetes.io/control-plane=

kubectl label nodes 172.17.20.202 node-role.kubernetes.io/master=
kubectl label nodes 172.17.20.202 node-role.kubernetes.io/control-plane=

kubectl label nodes 172.17.20.203 node-role.kubernetes.io/master=
kubectl label nodes 172.17.20.203 node-role.kubernetes.io/control-plane=
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2536/  

