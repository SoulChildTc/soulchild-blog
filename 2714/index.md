# argocd Unable to connect SSH repository: ssh: handshake failed: knownhosts: key is unknown

<!--more-->
解决方法: 
修改`argocd-ssh-known-hosts-cm`这个configmap，添加要信任的主机公钥信息。
> 公钥信息可以通过其他已连接过的主机中的known_hosts获取.
> 也可以通过类似`ssh-keyscan gitlab.soulchild.cn`获取


这个configmap被挂载到argocd-server和argocd-repo-server POD中的`/app/config/ssh`目录下。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2714/  

