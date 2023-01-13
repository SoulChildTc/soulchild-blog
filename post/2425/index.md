# redis哨兵模式+vip配置

<!--more-->
### 1.安装redis
```bash
yum install -y gcc-c++
cd /server/packages
wget http://download.redis.io/releases/redis-5.0.5.tar.gz
tar xf redis-5.0.5.tar.gz
cd redis-5.0.5
make
make install
```

### 2.整合redis
```bash
mkdir /usr/local/redis/{etc,bin,log} -p
cp redis.conf sentinel.conf /usr/local/redis/etc/
cd src
cp mkreleasehdr.sh redis-benchmark redis-check-aof redis-check-rdb redis-cli redis-sentinel redis-server redis-trib.rb /usr/local/redis/bin/
```
> 整合后可以复用，分发到其他节点

### 3.配置环境变量
```bash
echo 'export PATH=$PATH:/usr/local/redis/bin' >> /etc/profile
source /etc/profile
```

### 4.调优
```bash
echo -e 'vm.overcommit_memory=1\nnet.core.somaxconn=2048' >> /etc/sysctl.conf

# 重新加载配置
sysctl -p
```

### 5.修改配置文件
vim /usr/local/redis/etc/redis.conf
```bash
bind 0.0.0.0
protected-mode yes
port 6379
tcp-backlog 2048
timeout 0
tcp-keepalive 300
daemonize yes
supervised systemd
pidfile "/var/run/redis_6379.pid"
loglevel notice
logfile "/usr/local/redis/log/access.log"
databases 16
always-show-logo yes
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename "dump.rdb"
dir "/usr/local/redis"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-disable-tcp-nodelay no
replica-priority 100
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
maxclients 4064
```
> 如果是从节点，需要指向主节点，添加类似如下配置项
> slaveof 172.17.10.161 6379

### 6.配置sentinel
vim /usr/local/redis/etc/sentinel.conf
```bash
daemonize yes
port  26379
logfile  /var/log/redis/redis-sentinel.log
pidfile  /var/run/redis-sentinel.pid
sentinel monitor elk 172.17.10.161 6379 2
sentinel down-after-milliseconds elk 3000  
sentinel failover-timeout elk 20000
sentinel parallel-syncs elk 1
sentinel client-reconfig-script elk /server/scripts/redis_sentinel.sh
```
> 三个节点同样的配置

### 7.创建启动用户
```bash
useradd -r redis && chown -R redis.redis /usr/local/redis/
```

### 8.配置systemd脚本

#### redis-server
vim /etc/systemd/system/redis.service
```bash
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

#### redis-sentinel
vim /etc/systemd/system/redis-sentinel.service
```bash
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

### 9.配置VIP漂移脚本
每个sentinel节点都需要添加如下脚本

vim /server/scripts/redis_sentinel.sh
```bash
#!/bin/bash
MASTER_IP=${6}
VIP='172.17.10.164'
NETMASK='24'
INTERFACE='eth0'
MY_IP=`ip a s dev ${INTERFACE} | awk 'NR==3{split($2,ip,"/");print ip[1]}'`
if [ ${MASTER_IP} = ${MY_IP} ]; then
        /sbin/ip addr add ${VIP}/${NETMASK} dev ${INTERFACE}
        /sbin/arping -q -c 3 -A ${VIP} -I ${INTERFACE}
        exit 0
else
        /sbin/ip addr del ${VIP}/${NETMASK} dev ${INTERFACE}
        exit 0
fi
exit 1
```

### 10.启动服务
```bash
systemctl start redis
systemctl enable redis
systemctl start redis-sentinel
systemctl enable redis-sentinel
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2425/  

