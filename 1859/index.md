# pgsql9.4主备配置

<!--more-->
## 准备2台pgsql
主服务器安装并初始化，从服务器只安装不用初始化
|主机|IP|角色|
|----|----|----|
|pgsql01|10.0.0.72|主|
|pgsql02|10.0.0.73|从|

## 主库配置
1.创建同步用户
```bash
psql -c "create user replica CREATEDB SUPERUSER LOGIN REPLICATION password '123456';"
```

2.给同步用户添加连接权限
`vim /data/pgsql/pg_hba.conf`添加如下内容
```
host    all             all             10.0.0.0/24             md5
local   replication     replica                                trust
host    replication     replica        10.0.0.0/24              md5
host    replication     replica        ::1/128                 trust
```

3.修改主库配置
`vim /data/pgsql/postgres.conf`
```
# 监听地址
listen_addresses = 'localhost,10.0.0.72'
# 从服务器的最大并发连接数（即，同时运行的WAL sender进程的最大数量）
max_wal_senders = 3
# 流复制级别决定有多少信息被写入到WAL中，默认只写入服务端崩溃时所需信息。 archive补充WAL归档需要的日志记录； hot_standby进一步增加在从服务器上运行只读查询所需的信息
wal_level = hot_standby
# 服务器会在检查点后的第一次修改期间将每个磁盘页的全部内容写入WAL，即使对于所谓的提示位的非关键修改也是如此。
wal_log_hints = on
# 指定在pg_xlog目录下的以往日志文件段的最小数量
wal_keep_segments = 10
# 指定恢复期间是否可以连接并运行查询
hot_standby = on
```
4.重启
`pg_ctl -D /data/pgsql restart -l pgsql.log`

## 从库配置
1.基础备份
`pg_basebackup -h10.0.0.72 -Ureplica -Fp -Xs -v -P -D /data/pgsql/  -R`

参数说明：
- -Fp：使用plain(原样输出)格式备份
- -Xs：表示备份开始后，启动另一个流复制连接从主库接收WAL日志.
- -v：输出详细信息
- -P：显示进度信息
- -D：将基本备份放到哪个目录
- -R：在备份结束后自动生成recovery.conf文件

2.修改从库配置
postgres.conf
```
listen_addresses = 'localhost,10.0.0.73'
# 指定恢复期间是否可以连接并运行查询
hot_standby = on
# 设置多长时间发送一次从库的状态
wal_receiver_status_interval = 10
# 减少从节点执行查询时复制冲突的可能
hot_standby_feedback = on
```

recovery.conf
```
standby_mode = 'on'
primary_conninfo = 'user=replica password=123456 host=10.0.0.72 port=5432 sslmode=disable sslcompression=1'
recovery_target_timeline = 'latest'
trigger_file = '/data/pgsql/trigger_file'
```
3.设置目录权限
`chmod -R 0700 /data/pgsql/`

4.启动服务
`pg_ctl -D /data/pgsql -l /data/pgsql/pgsql.log start`


## 查询同步状态
```
\x auto
select * from pg_stat_replication;
-[ RECORD 1 ]----+------------------------------
pid              | 1693
usesysid         | 16404
usename          | replica
application_name | walreceiver
client_addr      | 10.0.0.73
client_hostname  |
client_port      | 33086
backend_start    | 2020-06-29 22:51:27.448759-04
backend_xmin     | 1913
state            | streaming
sent_location    | 0/5017268
write_location   | 0/5017268
flush_location   | 0/5017268
replay_location  | 0/5017268
sync_priority    | 0
sync_state       | async



```


## 测试
登陆主库创建数据：
```
create database test1;
\c test1;
create table public.user(id SERIAL primary key, name varchar(32), age int);
insert into "user" values(1,'soulchild',18);
```

登陆从库查询：
```
\l
\c test1
\dt
select name from public.user where id=1;
   name
-----------
 soulchild
(1 row)
```

## 模拟服务器故障
停止主服务器
`pg_ctl stop -D /data/pgsql/`

从库仍然可查询，但不能写
创建trigger文件,提升从服务器为主：
`touch /data/pgsql/trigger_file`
现在从服务器就可以读写了。

在从服务器插入数据
```
\c test
insert into public."user" values(2,'xiaolan',12);
```


启动10.0.0.72这台服务器并设置为从服务器
```
vim /data/pgsql/recovery.conf

standby_mode = 'on'
primary_conninfo = 'user=replica password=123456 host=10.0.0.73 port=5432 sslmode=disable sslcompression=1'
recovery_target_timeline = 'latest'
trigger_file = '/data/pgsql/trigger_file'
```

启动新的从服务器
`pg_ctl -D /data/pgsql/ -l /data/pgsql/pgsql.log start`

查询是否和新的主服务器同步了数据
```
\c test
select * from public.user;
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1859/  

