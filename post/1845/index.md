# redis主从复制和配置

<!--more-->
###1.安装redis
[参考链接](https://soulchild.cn/976.html)

###2.配置redis
master:
```bash
port 6379
daemonize yes
bind 0.0.0.0
pidfile /var/run/redis_6379-master.pid
logfile "/var/log/redis/redis_6379-master.log"
```

slave:
```bash
port 6379
daemonize yes
bind 0.0.0.0
pidfile /var/run/redis_6379-slave.pid
logfile "/var/log/redis/redis_6379-slave.log"
# 指定redis-master的地址和端口
slaveof 10.0.0.30 6379
```

###3.启动两台redis
`redis-server redis.conf`

###4.测试
登陆主redis
```
[root@redis01 etc]# redis-cli
127.0.0.1:6379> set name soulchild
OK
```
登陆从redis
```
[root@redis02 ~]# redis-cli
127.0.0.1:6379> keys *
1) "name"
127.0.0.1:6379> get name
"soulchild"
```
如果在主从复制架构中出现宕机的情况，需要分情况看：
1）从Redis宕机
这个相对而言比较简单，在Redis中从库重新启动后会自动加入到主从架构中，自动完成同步数据，这是因为在Redis2.8版本后就新增了增量复制功能，主从断线后恢复是通过增量复制实现的。所以这种情况无需担心。

2）主Redis宕机
这个情况相对而言就会复杂一些，需要以下2步才能完成：
第一步，在从数据库中执行SLAVEOF NO ONE命令，断开主从关系并且提升为主库继续服务；
第二步，将主库修复重新启动后，执行SLAVEOF host port命令，将其设置为其他库的从库，这时数据就能更新回来；

这两个步骤要通过手动完成恢复，过程其实是比较麻烦的并且容易出错，有没有好办法解决呢？有的，Redis提供的哨兵（sentinel）功能就可以实现主Redis宕机的自动切换。这个将在后面重点介绍。

###5.redis主从配置优化
`slaveof <masterip> <masterport>`
复制选项，slave复制对应的master的ip和端口。

`masterauth <master-password>`
如果master设置了requirepass，那么slave要连上master，需要有master的密码才行。masterauth就是用来配置master的密码，这样可以在连上master后进行认证。

`slave-serve-stale-data yes`
当从库同主库失去连接或者复制正在进行，从库有两种运行方式，决定如何处理后续的请求：
1) 如果slave-serve-stale-data设置为yes(默认设置)，从库会继续响应客户端的请求。
2) 如果slave-serve-stale-data设置为no，除去INFO和SLAVOF命令之外的任何请求都会返回一个错误”SYNC with master in progress”。

`slave-read-only yes`
作为从服务器，默认情况下是只读的（yes），可以修改成NO，用于写（不建议）。

`repl-diskless-sync no`
是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或者重连的slave无法增量同步，就会执行全量同步，master会生成rdb文件。有2种方式：

disk方式是master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。

socket是master创建一个新的进程，直接将RDB通过网络发送给slave，不使用磁盘作为中间存储。

disk方式的时候，rdb是作为一个文件保存在磁盘上，因此多个slave都能共享这个rdb文件。

socket方式的复制（无盘复制）是基于顺序的串行复制（master会等待一个repl-diskless-sync-delay的秒数，如果没slave来注册话，就直接传，后来的slave得排队等待。已注册的就可以一起传）。在磁盘速度缓慢，网速快的情况下推荐用socket方式。

`repl-diskless-sync-delay 5`
无磁盘复制的延迟时间，不要设置为0。因为一旦复制开始，master节点不会再接收新slave的复制请求，直到这个rdb传输完毕。所以最好等待一段时间，等更多的slave注册上到master后一起传输，提供同步性能。

`repl-ping-slave-period 10`
slave根据指定的时间间隔向服务器发送ping请求。默认10秒。

`repl-timeout 60`
复制连接超时时间。master和slave都有超时时间的设置。master检测到slave上次发送的时间超过repl-timeout，即认为slave离线，清除该slave信息。slave检测到上次和master交互的时间超过repl-timeout，则认为master离线。需要注意的是repl-timeout需要设置一个比repl-ping-slave-period更大的值，不然会经常检测到超时。

`repl-backlog-size 5mb`
复制缓冲区大小，这是一个环形复制缓冲区，用来保存最新复制的命令。这样在slave离线的时候，不需要完全复制master的数据，如果可以执行部分同步，只需要把缓冲区的部分数据复制给slave，就能恢复正常复制状态。缓冲区的大小越大，slave离线的时间可以更长，复制缓冲区只有在有slave连接的时候才分配内存。没有slave的一段时间，内存会被释放出来，默认1m。

`repl-backlog-ttl 3600`
master释放缓冲区内存的时间，单位为秒。





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1845/  

