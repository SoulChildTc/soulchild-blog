# mongodb3.6二进制安装

<!--more-->
下载地址：

http://downloads.mongodb.org/linux/mongodb-linux-x86_64-rhel70-v3.6-latest.tgz

&nbsp;

安装：
```
mkdir /application

tar xf mongodb-linux-x86_64-rhel70-v3.6-latest.tgz -C /application/

cd /application
mv mongodb-linux-x86_64-rhel70-3.6.16-15-g4cd114f/ mongodb

echo 'export PATH=$PATH:/application/mongodb/bin' &gt;&gt;/etc/profile
source /etc/profile

# 创建用户
groupadd mongod
useradd -g mongod mongod
echo 123456 |passwd --stdin mongod

#创建目录
cd /application/mongodb
mkdir conf log data
chown -R mongod.mongod /application/mongodb
```
关闭大页内存
```
echo 'never' &gt;&gt; /sys/kernel/mm/transparent_hugepage/enabled
echo 'never' &gt;&gt; /sys/kernel/mm/transparent_hugepage/defrag
```
编写配置文件
```
# 系统日志相关
systemLog:
  destination: file
  logAppend: true
  path: /application/mongodb/log/mongod.log

# 数据存储相关
storage:
  dbPath: /application/mongodb/data
  journal:
    enabled: true

# 网络相关
net:
  port: 27017
  bindIp: 0.0.0.0

# 进程控制相关
processManagement:
   fork: true
#   pidFilePath: /var/run/mongod.pid

# 安全配置
security:
  authorization: enabled
```
启动mongodb
```
su - mongod
#无配置文件启动
mongod --dbpath=/application/mongodb/data --logpath=/application/mongodb/log/mongodb.log --logappend --fork

#使用配置文件启动
su - mongod
mongod -f /application/mongodb/conf/mongo.conf
```

启动脚本
```
[Unit]
Description=Mongos server
Wants=network.target
After=network.target

[Service]
Type=forking
PIDFile=/data/mongodb/mongod.pid
ExecStart=/application/mongodb/bin/mongod -f /usr/local/mongodb/etc/mongod.conf
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
User=mongod
Group=mongod
LimitNOFILE=65534
LimitNPROC=65534

[Install]
WantedBy=multi-user.target
```


创建mongodb超级管理用户：
```
use admin
db.createUser(
{
    user:"root",
    pwd:"123",
    roles:[ { role: "root", db:"admin" } ]
}
)
```
连接数据库
```
mongo -uroot -p123 10.0.0.40/admin
或者
mongo
use admin
db.auth('root','123')
```

创建普通读写用户：
```
use app
db.createUser(
{
    user: "app1",
    pwd: "app1",
    roles: [ { role: "readWrite", db: "app" } ] 
}
)
```
关闭数据库
```
mongod -f conf/mongo.conf --shutdown
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1279/  

