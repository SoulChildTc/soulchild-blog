# KVM解决nat不能上网的问题

<!--more-->
使用nat需要在宿主机中开启数据包转发

临时修改：

sysctl -w net.ipv4.ip_forward=1

重新加载：

sysctl -p

&nbsp;

&nbsp;

永久修改：

修改配置文件

vim /etc/sysctl.conf

net.ipv4.ip_forward=1

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/533/  

