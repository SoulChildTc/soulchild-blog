# pssh简单使用

<!--more-->
# 安装pssh(在epel源中)

[root@m01 ~]# yum install -y pssh

参数说明：

-h：指定主机列表文件,(文件内容格式:"user@host:port",一行一个)，例:root@172.16.1.10:5832

-H：直接指定主机IP，格式同上

-p：指定线程数，并发执行(可选)

-t：设置超时时间，0为无限(可选)

-A：使用交互的形式输入密码(可选)

-i：将每台服务器的正确信息和错误信息都打印出来

-P：打印出服务器返回信息(不清楚和-i的区别)

&nbsp;

使用：

#单台服务器执行远程命令

[root@m01 ~]# pssh -iH 172.16.1.31 hostname

# 批量执行命令(按照文件列表)

[root@m01 ~]# cat host.txt
172.16.1.31
172.16.1.41
172.16.1.7

[root@m01 ~]# pssh -ih host.txt hostname
[1] 23:54:56 [SUCCESS] 172.16.1.31
nfs01
[2] 23:54:56 [SUCCESS] 172.16.1.41
backup
[3] 23:54:56 [SUCCESS] 172.16.1.7
web01

# 使用sshpass指定密码

[root@m01 ~]# sshpass -pxxxxxxx pssh -ih host.txt hostname


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/230/  

