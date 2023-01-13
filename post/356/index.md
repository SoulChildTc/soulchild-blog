# linux系统日志文件

<!--more-->
secure：安全相关,主要是用户认证,如登录 、创建和删除账号 、sudo等

audit/audit.log：审计日志。跟用户账号相关

messages：记录系统和软件的绝大多数消息。如服务启动 、停止 、服务错误等。

boot.log：系统启动日志。能看到启动流程。

cron：计划任务日志。会记录crontab计划任务的创建、执行信息。

dmesg：硬件设备信息(device)。纯文本,也可以用dmesg命令查看。

yum.log：yum软件的日志。记录yum安装、卸载软件的记录。

lastlog：最后登录的日志。用lastlog查看(二进制日志文件)

btmp：登录失败的信息(bad)。用lastb查(二进制日志文件)

wtmp：正确登录的所有用户命令(who、w)，用last查(二进制日志文件)


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/356/  

