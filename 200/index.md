# 配置nfs并挂载使用

<!--more-->
#rsync服务器和nfs服务器都需要安装nfs工具

yum install -y nfs-utils rpcbind

<span style="color: #e53333; font-size: 24px;">服务端配置</span>

#服务端启动nfs和rpcbind

[root@nfs01 ~]# systemctl start rpcbind

[root@nfs01 ~]# systemctl start nfs

&nbsp;

#查看rpc注册信息

[root@nfs01 ~]# rpcinfo -p localhost

#查看nfs共享的目录

[root@nfs01 ~]# showmount -e locahost

Export list for localhost:

#配置nfs共享目录

[root@nfs01 ~]# vim /etc/exports

#share /data
/data   172.16.1.0/24(rw,sync,all_squash)

############################################################################

第一行:注释说明

第二行:共享的目录和允许访问的ip段，rw:读写权限，sync:实时同步,all_squash:将所有用户压缩为nfsnobody所有者和组

&nbsp;

权限参数：

只读:ro

读写:rw

&nbsp;

all_squash还可以改为如下内容

root_squash:如果客户端用户是root用户访问将被压缩为nfsnobody所有者和组

no_root_squash:如果客户端用户是root用户，那么他对共享目录的权限为root

&nbsp;

默认压缩的用户为nfsnobody，手动指定举例：

/data   172.16.1.0/24(rw,sync,all_squash,anonuid=888,anongid=888)

anonuid:用户id

anongid:组id

对应的共享目录(/data)也需要将所有者和组更改为与上面设置一致

############################################################################

&nbsp;

#创建目录并将所有者改为nfsnobody

[root@nfs01 ~]# mkdir -p /data

[root@nfs01 ~]# chown nfsnobody.nfsnobody /data

#平滑重启nfs服务

[root@nfs01 ~]# systemctl reload nfs

#查看nfs共享目录

[root@nfs01 ~]# showmount -e locahost

Export list for locahost:
/data 172.16.1.0/24

&nbsp;

<span style="color: #e53333; font-size: 24px;">客户端挂载</span>

#挂载nfs服务器的/data目录挂载到rsync服务器的/mnt目录下(-t参数指定文件系统类型)

[root@backup ~]# mount -t nfs 172.16.1.31:/data /mnt

#查看磁盘挂载情况，可以看到结果中存在以下内容

[root@backup ~]# df -Th

172.16.1.31:/data nfs4       48G  1.9G   47G   4% /mnt

&nbsp;

#设置开机自动挂载

#centos7需要设置执行权限

[root@backup ~]# chmod +x /etc/rc.d/rc.local

#在rc.local文件末尾添加如下内容

mount -t nfs 172.16.1.31:/data /mnt

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/200/  

