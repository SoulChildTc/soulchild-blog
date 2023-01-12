# redis哨兵模式vip

<!--more-->
## 三个哨兵配置如下
```
port 26379
daemonize yes
pidfile "/var/run/redis-sentinel.pid"
logfile "/var/log/redis/redis-sentinel.log"
sentinel monitor mymaster 10.0.0.30 6379 2
sentinel down-after-milliseconds mymaster 5000  
sentinel failover-timeout mymaster 20000
sentinel parallel-syncs mymaster 1
sentinel client-reconfig-script mymaster /server/scripts/redis_sentinel.sh
```

## IP漂移脚本
每个sentinel节点都需要添加
vim /server/scripts/redis_sentinel.sh
```
#!/bin/bash
MASTER_IP=${6}
VIP='10.0.0.25'
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
redis-sentinel会向脚本传参`mymaster observer start 旧主ip 6379 新主ip 6379`

添加执行权限
`chmod +x /server/scripts/redis_sentinel.sh`

## 手动添加VIP
主节点执行：
`ip addr add 10.0.0.25/24 dev eth0`


## 测试
停止主节点
```
redis-cli shutdown
```

查看哨兵日志,主节点已经切到10.0.0.31了
```
tail /var/log/redis/redis-sentinel.log

3723:X 28 Jun 2020 03:51:28.289 # +switch-master mymaster 10.0.0.30 6379 10.0.0.31 6379
3723:X 28 Jun 2020 03:51:28.290 * +slave slave 10.0.0.32:6379 10.0.0.32 6379 @ mymaster 10.0.0.31 6379
3723:X 28 Jun 2020 03:51:28.290 * +slave slave 10.0.0.30:6379 10.0.0.30 6379 @ mymaster 10.0.0.31 6379
3723:X 28 Jun 2020 03:51:33.297 # +sdown slave 10.0.0.30:6379 10.0.0.30 6379 @ mymaster 10.0.0.31 6379
```


检查旧主节点vip是否删除

检查新主节点vip是否添加
```
ip a
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1849/  

