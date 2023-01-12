# pgsql配置文件说明

<!--more-->
```
#指定数据文件目录
data_directory = '/data/postgresql/'

#监听地址
listen_addresses = '*'

#最大连接数
max_connections = 1000
查询sql：SELECT sum(numbackends) FROM pg_stat_database;

#处理tcp连接
tcp_keepalives_idle = 0
tcp_keepalives_interval = 0
tcp_keepalives_count = 0

对于每个连接，postgresql会对这个连接空闲tcp_keepalives_idle秒后，主动发送tcp_keeplive包给客户 端，以侦探客户端是否还活着 ，当发送tcp_keepalives_count个侦探包，每个侦探包在tcp_keepalives_interval 秒内没有回应，postgresql就认为这个连接是死的。于是切断这个死连接。参数设置为o时，使用系统默认值。

对应关系：
tcp_keepalives_idle   == tcp_keepalive_time
tcp_keepalives_interval == tcp_keepalives_interval
tcp_keepalives_count == tcp_keepalive_probes

#缓存大小
shared_buffers = 128MB



#启动日志收集， 这是一个后台进程，抓取发送到stderr的日志消息，并会将他们重定向到日志文件。
logging_collector = on

#日志类型,需要先开启logging_collector
log_destination = 'stderr'

#日志目录
log_directory = 'pg_log'

#日志名
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'

#当日志文件已存在时，该配置如果为off，新生成的日志将在文件尾部追加，如果为on，则会覆盖原来的日志。
log_truncate_on_rotation = off

单个日志文件的生存期，默认1天，在日志文件大小没有达到10M时，一天只生成一个日志文件
log_rotation_age = 7d

单个日志文件的大小，如果时间没有超过7天，一个日志文件最大只能到10M，否则将新生成一个日志文件。
log_rotation_size = 10MB

#记录每条SQL语句执行完成消耗的时间
log_duration = on

#-1表示不可用，0将记录所有SQL语句和它们的耗时，大于0只记录那些耗时超过（或等于）这个值（ms）的SQL语句。
log_min_duration_statement = 5000

#记录用户连接日志
log_connections = on

#记录用户断开连接的日志
log_disconnections = on

#配置日志格式
log_line_prefix = '< %m %p %u %d %r >'


#控制记录哪些SQL语句。none不记录，ddl记录所有数据定义命令，比如CREATE,ALTER,和DROP 语句。mod记录所有ddl语句,加上数据修改语句INSERT,UPDATE等,all记录所有执行的语句，将此配置设置为all可跟踪整个数据库执行的SQL语句。
log_statement = 'ddl'

#日志格式
datestyle = 'iso, mdy'

#时区设置
log_timezone = 'Asia/Shanghai'

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1450/  

