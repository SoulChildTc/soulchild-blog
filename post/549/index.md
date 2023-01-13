# centos7开启console控制台登录

<!--more-->
修改内核参数

grubby --update-kernel=ALL --args="console=ttyS0,115200n8"

&nbsp;

重启

reboot


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/549/  

