# ansible使用剧本时卡死解决方法

<!--more-->
修改配置文件/etc/ansible/ansible.cfg

将37行的gathering修改为如下内容

gathering = explicit


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/264/  

