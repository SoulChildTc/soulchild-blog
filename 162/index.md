# scp简单使用

<!--more-->
scp (secure rcp)      不同机器之间传输       每次传输都是全量

rsync                      备份 在不同服务器之间传输   增加传输 只传输发生变化的 或者是新文件

使用格式：

scp 要复制的文件路径   目标路径

-r   复制目录

<span style="font-family: Microsoft YaHei;">-p</span>  保留原文件的修改时间，访问时间和访问权限。

<span style="font-family: Microsoft YaHei;">-<span style="font-size: 14px;">P</span></span>  指定远程端口号

#使用：scp -P 4588 要复制的文件路径   目标路径

#本地 /etc/hostname 文件发送到 nfs01 的/tmp目录中

[root@backup ~]# scp  /etc/hostname     172.16.1.31:/tmp
root@172.16.1.31's password:
hostname                                                                               100%    7     3.1KB/s   00:00

#复制远程主机/tmp/xx.txt文件 到本地/tmp目录下

scp -<span style="font-size: 14px;">P</span> 4588   root@172.16.1.31:/tmp/xx.txt    /tmp


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/162/  

