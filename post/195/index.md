# rsync服务(守护进程模式)

<!--more-->
**备份服务器搭建服务器端  backup**

## 服务端配置

### 创建rsync用户
`useradd -s /sbin/nologin -M rsync`

### 创建备份目录
`mkdir -p /backup`

### 修改目录所有者和组为rsync
chown rsync.rsync /backup/
### 创建rsync用户密码文件，账号rsync_backup,密码1
echo 'rsync_backup:1'  >/etc/rsync.password

### 修改密码文件权限
chmod 600 /etc/rsync.password


### 修改配置文件，内容如下：
[root@backup ~]# cat /etc/rsyncd.conf
```
uid = rsync
gid = rsync
fake super = yes
use chroot = no
max connections = 200
timeout = 300
pid file = /var/run/rsyncd.pid
lock file = /var/run/rsync.lock
log file = /var/log/rsyncd.log
[backup]
path = /backup/
ignore errors
read only = false
list = false
hosts allow = 172.16.1.0/24
#hosts deny = 0.0.0.0/32
auth users = rsync_backup
secrets file = /etc/rsync.password
```

 

\#################配置项说明########################
```
uid:指定运行用户

gid:指定组

fake super:

use chroot: 如果"use chroot"指定为true，那么rsync在传输文件以前首先chroot到path参数所指定的目录下。这样做的原因是实现额外的安全防护，但是缺点是需要以roots权限，并且不能备份指向外部的符号连接所指向的目录文件。默认情况下chroot值为true。

max connections:最大连接数

timeout:超时时间

pid file:进程号保存路径

lock file:锁文件保存路径

log file:日志文件保存路径

[backup]:模块名

path:指定模块路径

ignore errors:忽略部分错误，不显示在终端中，可在日志中查看

read only:是否只读

list:查看模块路径的内容

hosts allow:允许访问此模块的IP段(deny为拒绝，二选一即可)

auth users:认证用户名

secrets file:指定用户密码文件路径
```

 

### 启动服务

[root@backup ~]# systemctl start rsyncd

### 查看进程是否存在

[root@backup ~]# ps -ef|grep rsync
root     17177     1  0 14:52 ?        00:00:00 /usr/bin/rsync --daemon --no-detach
root     17179 16652  0 14:52 pts/0    00:00:00 grep --color=auto rsync

### 查看端口是否监听
[root@backup ~]# ss -lntup |grep rsync
tcp    LISTEN     0      5         *:873                   *:*                   users:(("rsync",pid=17177,fd=4))
tcp    LISTEN     0      5        :::873                  :::*                   users:(("rsync",pid=17177,fd=5))


## 客户端配置

### 将密码写到文件中并设置权限(实现非交互)
```
echo '1' >/etc/rsync.password
chmod 600 /etc/rsync.password
```
### 将nfs01的/etc目录传输到backup服务器backup模块中，并指定密码文件（不加--password-file需要手动输入密码）

`rsync -avz  /etc   rsync_backup@172.16.1.41::backup  --password-file /etc/rsync.password`

 
### 使用--exclude和--exclude-from排除某文件传输

将/etc/hostname文件排除，不传输
`rsync -avz /etc  rsync_backup@172.16.1.41::backup  --password-file /etc/rsync.password --exclude=/etc/hostname`

 

### 按照文件内容排除

[root@nfs01 ~]# cat /data/exclude.txt
```
/etc/hostname
/etc/hosts
```
排除/etc/hostname，/etc/hosts这两个文件

`rsync -avz  /etc   rsync_backup@172.16.1.41::backup  --password-file /etc/rsync.password --exclude-from=/data/exclude.txt`



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/195/  

