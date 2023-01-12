# pgsql9.4二进制安装

<!--more-->
下载二进制包：

`wget http://get.enterprisedb.com/postgresql/postgresql-9.4.25-1-linux-x64-binaries.tar.gz`



创建目录：
```
mkdir /application/
mkdir /data/postgresql
```

添加用户：
```
useradd postgres
chown -R postgres.postgres /data/postgresql/
```

解压：
```
tar xf postgresql-9.4.25-1-linux-x64-binaries.tar.gz -C /application/
echo 'export PATH=$PATH:/application/pgsql/bin/' >> /etc/profile
source /etc/profile
```

使用postgres用户初始化数据库：
```
su postgres
initdb -D /data/postgresql/
```

修改配置文件
```
data_directory = '/data/postgresql/'
listen_addresses = '127.0.0.1,10.0.0.92'
max_connections = 1000
logging_collector = on
log_destination = 'stderr'
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
# 当日志文件已存在时,使用追加的方式写日志
log_truncate_on_rotation = off
log_rotation_age = 1d
log_rotation_size = 10MB

log_duration = on
log_min_duration_statement = 4000
log_connections = on
log_disconnections = on
# 日志前缀: < 日期 进程id 用户名 数据库名称 远程主机端口 连接应用>
log_line_prefix = '< %m %p %u %d %r %a >'
log_statement = 'ddl'
datestyle = 'iso, mdy'
log_timezone = 'Asia/Shanghai'
```

启动服务：
```
cd /data/postgresql
pg_ctl -D /data/postgresql/  start
```

连接数据库：
```
psql -U postgres
```

修改密码：
```
ALTER USER postgres with encrypted password '密码';
```

创建用户和库
```
postgres=# create user 用户名 with password '123';
postgres=# create database 库名 with encoding='utf8' owner=用户名;
```

开启、停止、重启：
```
#Start
pg_ctl start -D ${PGDATA} -s -w -t 300
#Stop
pg_ctl stop -D ${PGDATA} -s -m fast
#Reload
pg_ctl reload -D ${PGDATA} -s
```

systemd管理
```bash
[Unit]
Description=PostgreSQL 9.4 database server
Documentation=https://www.postgresql.org/docs/9.4/static/
After=syslog.target
After=network.target

[Service]
Type=forking

User=postgres
Group=postgres

# Note: avoid inserting whitespace in these Environment= lines, or you may
# break postgresql-setup.

# Location of database directory
Environment=PGDATA=/data/postgresql/

# Where to send early-startup messages from the server (before the logging
# options of postgresql.conf take effect)
# This is normally controlled by the global default set by systemd
# StandardOutput=syslog

# Disable OOM kill on the postmaster
OOMScoreAdjust=-1000

ExecStartPre=/application/pgsql/bin/postgresql94-check-db-dir ${PGDATA}
ExecStart=/application/pgsql/bin/pg_ctl start -D ${PGDATA} -s -w -t 300
ExecStop=/application/pgsql/bin/pg_ctl stop -D ${PGDATA} -s -m fast
ExecReload=/application/pgsql/bin/pg_ctl reload -D ${PGDATA} -s

# Do not set any timeout value, so that systemd will not kill postmaster
# during crash recovery.
TimeoutSec=0

[Install]
WantedBy=multi-user.target
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1373/  

