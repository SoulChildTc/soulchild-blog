# redis安装和基础调优

<!--more-->
最新稳定版下载地址：http://download.redis.io/releases/redis-5.0.5.tar.gz

### 一、安装
```
yum install -y gcc-c++
wget http://download.redis.io/releases/redis-5.0.5.tar.gz
tar xf redis-5.0.5.tar.gz -C /server
cd /server/redis-5.0.5
make
mkdir /usr/local/redis
make install PREFIX=/usr/local/redis
```

### 配置文件
```
mkdir /usr/local/redis/{etc,log}
cd /server/redis-5.0.5
cp redis.conf sentinel.conf /usr/local/redis/etc/
```
常用二进制命令功能介绍：

redis-server：Redis服务器的daemon启动程序

redis-cli：Redis命令行操作工具。也可以用telnet根据其纯文本协议来操作

redis-benchmark：Redis性能测试工具，测试Redis在当前系统下的读写性能

redis-check-aof：数据修复

redis-check-dump：检查导出工具



修改环境变量
```
vim /etc/profile
export PATH=$PATH:/usr/local/redis/bin
```


### 二、配置基础参数调优

#### 1.修改内核参数
```
echo vm.overcommit_memory=1 >> /etc/sysctl.conf
sysctl -p
```
参数含义：

0，表示内核将检查是否有足够的可用内存供应用进程使用；如果有足够的可用内存，内存申请允许；否则，内存申请失败，并把错误返回给应用进程。

1，表示内核允许分配所有的物理内存，而不管当前的内存是否足够。

2，表示内核使用"never overcommit"策略来尝试防止任何内存过度使用

```
echo net.core.somaxconn=2048 >> /etc/sysctl.conf
sysctl -p
```
修改TCP连接队列长度为2048，配置文件中tcp-backlog



#### 2.修改配置文件

vim /usr/local/redis/etc/redis.conf
```
#绑定IP，只能通过此IP连接
bind 10.0.0.237

#次值不能大于somaxconn的值
tcp-backlog 2048

#开启守护进程模式
daemonize yes

#指定日志输出文件，默认在屏幕输出
logfile "/usr/local/redis/log/access.log"

#关闭保护(不建议)
#protected-mode no

#设置密码（不建议）
#requirepass 123
```

创建用户授权`useradd -r redis && chown -R redis.redis /usr/local/redis/`




使用redis用户启动redis
`su redis -s /bin/bash -c "/usr/local/redis/bin/redis-server  /usr/local/redis/etc/redis.conf"`



停止或者
`/usr/local/redis/bin/redis-cli shutown`

有密码停止
`/usr/local/redis/bin/redis-cli -a password shutown`

使用kill
`kill -QUIT pid`


### 使用systemd管理
redis-server
vim /etc/systemd/system/redis.service
```
[Unit]
Description=Redis persistent key-value database
After=network.target
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/redis/bin/redis-server /usr/local/redis/etc/redis.conf --supervised systemd
Type=notify
User=redis
Group=redis

[Install]
WantedBy=multi-user.target
```

redis-sentinel
vim /etc/systemd/system/redis-sentinel.service
```
[Unit]
Description=Redis Sentinel
After=network.target
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/redis/bin/redis-sentinel /usr/local/redis/etc/sentinel.conf --supervised systemd
Type=notify
#User=redis
#Group=redis

[Install]
WantedBy=multi-user.target
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/976/  

