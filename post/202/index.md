# sersync实现实时同步备份

<!--more-->
sersync  github下载地址：https://github.com/wsgzao/sersync/

(下载这个sersync2.5.4_64bit_binary_stable_final.tar.gz)

sersync：监控目录的变化，推送到rsync服务器上
这里检测到指定目录文件有变化时会自动调用rsync同步到backup服务器中(backup服务器安装rsync服务)

## 1、安装

解压后得到两个文件:sersync，confxml.xml,移动到/usr/local/sersync目录下（目录结构可以自己创建）
```
[root@nfs01 ~]# tree /usr/local/sersync/
/usr/local/sersync/
├── bin
│   └── sersync
├── conf
│   └── confxml.xml
└── logs

#创建软连接，方便以后使用

[root@nfs01 sersync]# ln -s  /usr/local/sersync/bin/sersync   /bin/

[root@nfs01 sersync]# chmod +x  /usr/local/sersync/bin/sersync
```

## 2、修改配置文件
打开confxml.xml配置文件
```
<?xml version="1.0" encoding="ISO-8859-1" ?>
- <head version="2.5">
 <host hostip="localhost" port="8008" />
 <debug start="false" />
 <fileSystem xfs="true" />  # 文件系统类型，根据自己的分区类型选择

# 此处可设置需要过滤的文件类型
- <filter start="false">
 <exclude expression="(.*)\.svn" />
 <exclude expression="(.*)\.gz" />
 <exclude expression="^info/*" />
 <exclude expression="^static/*" />
 </filter>
- <inotify> # 监控文件目录的变化
 <delete start="true" />
 <createFolder start="true" />
 <createFile start="false" />
 <closeWrite start="true" />
 <moveFrom start="true" />
 <moveTo start="true" />
 <attrib start="false" />
 <modify start="false" />
 </inotify>

- <sersync>
- <localpath watch="/data"> # 监控的目录
 <remote ip="172.16.1.41" name="nfsbackup" /> # rsync服务器的IP(也就是backup服务器)和模块名称
- <!-- <remote ip="192.168.8.39" name="tongbu"/>-->
- <!-- <remote ip="192.168.8.40" name="tongbu"/>-->
</localpath>
- <rsync>
 <commonParams params="-az" /> # rsync命令执行参数
 <auth start="true" users="nfsbackup" passwordfile="/etc/nfsbackup.password" /> # users:rsync认证用户名，passwordfile:密码文件
 <userDefinedPort start="false" port="874" />
- <!--  port=874 -->
 <timeout start="false" time="100" />
- <!--  timeout=100 -->
 <ssh start="false" />
 </rsync>
 <failLog path="/tmp/rsync_fail_log.sh" timeToExecute="60" /> # 日志文件路径
- <!-- default every 60mins execute once -->
- <crontab start="false" schedule="600">
- <!-- 600mins -->
- <crontabfilter start="false">
 <exclude expression="*.php" />
 <exclude expression="info/*" />
 </crontabfilter>
 </crontab>
 <plugin start="false" name="command" />
 </sersync>
- <plugin name="command">
 <param prefix="/bin/sh" suffix="" ignoreError="true" />
- <!-- prefix /opt/tongbu/mmm.sh suffix -->
- <filter start="false">
 <include expression="(.*)\.php" />
 <include expression="(.*)\.sh" />
 </filter>
 </plugin>
- <plugin name="socket">
- <localpath watch="/opt/tongbu">
 <deshost ip="192.168.138.20" port="8009" />
 </localpath>
 </plugin>
- <plugin name="refreshCDN">
- <localpath watch="/data0/htdocs/cms.xoyo.com/site/">
 <cdninfo domainname="ccms.chinacache.com" port="80" username="xxxx" passwd="xxxx" />
 <sendurl base="http://pic.xoyo.com/cms" />
 <regexurl regex="false" match="cms.xoyo.com/site([/a-zA-Z0-9]*).xoyo.com/images" />
 </localpath>
 </plugin>
 </head>
```

### 主要修改位置
```
<fileSystem xfs="true"/>   #使用xfs文件系统
<localpath watch="/data">  #指定需要监控的目录
 <remote ip="172.16.1.41" name="nfsbackup"/> # 指定rsync服务器的ip和模块名
<commonParams params="-az"/> # 使用-az参数
 <auth start="true" users="nfsbackup" passwordfile="/etc/nfsbackup.password"/> 
# 指定用户名为：nfsbackup和密码文件
```

## 配置backup服务器（rsync服务）
```
[root@backup uploads]# cat  /etc/rsyncd.conf
uid = rsync
gid = rsync
fake super = yes
use chroot = no
max connections = 200
timeout = 300
pid file = /var/run/rsyncd.pid
lock file = /var/run/rsync.lock
log file = /var/log/rsyncd.log
ignore errors
read only = false
list = false
hosts allow = 172.16.1.0/24
#hosts deny = 0.0.0.0/32
[backup]
path = /backup/
auth users = backup
secrets file = /etc/backup.password
[nfsbackup]
path = /nfsbackup
auth users = nfsbackup
secrets file = /etc/nfsbackup.password
```

## 启动sersync守护进程模式
查看帮助

[root@nfs01 bin]# sersync -h
set the system param
execute：echo 50000000 > /proc/sys/fs/inotify/max_user_watches
execute：echo 327679 > /proc/sys/fs/inotify/max_queued_events
parse the command param
>参数-d:启用守护进程模式
>参数-r:在监控前，将监控目录与远程主机用rsync命令推送一遍
>参数-n: 指定开启守护线程的数量，默认为10个
>参数-o:指定配置文件，默认使用confxml.xml文件
>参数-m:单独启用其他模块，使用 -m refreshCDN 开启刷新CDN模块
>参数-m:单独启用其他模块，使用 -m socket 开启socket模块
>参数-m:单独启用其他模块，使用 -m http 开启http模块
不加-m参数，则默认执行同步程序


##开启服务
`sersync -r -d -o  /usr/local/sersync/conf/confxml.xml`

在首次正常执行后，此时/data目录的内容会全部推送到backup服务器的/nfsbackup目录下











---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/202/  

