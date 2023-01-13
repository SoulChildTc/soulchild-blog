# redis哨兵模式配置

<!--more-->
Redis 的 Sentinel 系统用于管理多个 Redis 服务器（instance）， 该系统执行以下三个任务：

- 监控（Monitoring）： Sentinel 会不断地检查你的主服务器和从服务器是否运作正常。
- 提醒（Notification）： 当被监控的某个 Redis 服务器出现问题时， Sentinel 可以通过 API 向管理员或者其他应用程序发送通知。
- 自动故障迁移（Automatic failover）： 当一个主服务器不能正常工作时， Sentinel 会开始一次自动故障迁移操作， 它会将失效主服务器的其中一个从服务器升级为新的主服务器， 并让失效主服务器的其他从服务器改为复制新的主服务器； 当客户端试图连接失效的主服务器时， 集群也会向客户端返回新主服务器的地址， 使得集群可以使用新主服务器代替失效服务器。

## 环境准备：
redis-server：
10.0.0.30:6379  主
10.0.0.30:6389  从
10.0.0.31:6379  从
10.0.0.31:6380  从

redis-sentinel：
10.0.0.30:26379
10.0.0.30:26380
10.0.0.31:26379

## 配置redis主从
[参考链接](https://soulchild.cn/1845.html)

## 配置sentinel
sentinel配置文件:
```
daemonize yes
port  26379
logfile  /var/log/redis/redis-sentinel.log
pidfile  /var/run/redis-sentinel.pid
sentinel monitor mymaster 10.0.0.30 6379 2
sentinel down-after-milliseconds mymaster 5000  
sentinel failover-timeout mymaster 20000
sentinel parallel-syncs mymaster 1
```

### 配置说明：
`sentinel monitor mymaster 10.0.0.30 6379 2`:
配置Sentinel去监视一个名为mymaster的主服务器， 这个主redis的IP地址为10.0.0.30，端口号为 6379，而将这个主redis判断为失效至少需要2个Sentinel同意（只要同意Sentinel的数量不达标，自动故障迁移就不会执行）。

不过要注意， 无论你设置要多少个Sentinel同意才能判断一个服务器失效，Sentinel 都需要获得系统中多数Sentinel的支持，才能发起一次自动故障迁移

`sentinel down-after-milliseconds mymaster 5000`: 指定了Sentinel认为服务器已经断线所需的毫秒数。
如果服务器在给定的毫秒数之内， 没有返回Sentinel发送的PING命令的回复，或者返回一个错误，那么 Sentinel将这个服务器标记为主观下线(subjectively down,简称SDOWN)。

不过只有一个Sentinel将服务器标记为主观下线并不一定会引起服务器的自动故障迁移：只有在足够数量的Sentinel都将一个服务器标记为主观下线之后，服务器才会被标记为客观下线（objectively down， 简称ODOWN），这时自动故障迁移才会执行。

`sentinel failover-timeout mymaster 15000`: 故障迁移的超时时间

`sentinel parallel-syncs mymaster 1`：选项指定了在执行故障转移时， 最多可以有多少个从服务器同时对新的主服务器进行同步， 这个数字越小， 完成故障转移所需的时间就越长。
如果从服务器被设置为允许使用过期数据集（参见对 redis.conf 文件中对 slave-serve-stale-data 选项的说明）， 那么你可能不希望所有从服务器都在同一时间向新的主服务器发送同步请求， 因为尽管复制过程的绝大部分步骤都不会阻塞从服务器， 但从服务器在载入主服务器发来的 RDB 文件时， 仍然会造成从服务器在一段时间内不能处理命令请求： 如果全部从服务器一起对新的主服务器进行同步， 那么就可能会造成所有从服务器在短时间内全部不可用的情况出现。

你可以通过将这个值设为 1 来保证每次只有一个从服务器处于不能处理命令请求的状态。


## 启动哨兵
其他节点修改配置后，相同方式启动
```bash
redis-sentinel sentinel.conf
```

## 模拟故障
```bash
# 关闭主节点
redis-cli shutdown

# 连接其他节点，查看
[root@redis02 ~]# redis-cli
127.0.0.1:6379> info Replication
# Replication
role:slave
master_host:10.0.0.31
master_port:6380
master_link_status:up
```
主节点已经切换到10.0.0.31:6380这台机器上了

#查看哨兵集群状态
```bash
# 连接哨兵服务端口
redis-cli -p 26379
127.0.0.1:26379> info Sentinel

# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=10.0.0.31:6380,slaves=3,sentinels=4
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1847/  

