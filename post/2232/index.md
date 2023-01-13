# mac osx修改mac地址和管理路由表的方法

<!--more-->
原文：http://www.huilog.com/?p=660
mac osx虽然是类unix的系统，默认也是bash shell，但是修改mac地址及管理路由表跟linux还是不一样。

### 修改mac地址,重启后失效
`sudo ifconfig en0 lladdr d0:67:e5:2e:07:f1`

### 查看路由表
`netstat -nr`

### 修改路由表
```
sudo route delete 0.0.0.0  删除默认路由
sudo route add -net 0.0.0.0 192.168.1.1 默认使用192.168.1.1网关
sudo route add 10.0.1.0/24 10.200.22.254 其它网段指定网关
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2232/  

