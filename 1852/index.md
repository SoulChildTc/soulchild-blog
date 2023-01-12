# pgsql9.4.25源码安装

<!--more-->
安装：
```
yum install -y gcc readline-devel zlib-devel
wget http://ftp.postgresql.org/pub/source/v9.4.25/postgresql-9.4.25.tar.gz
tar xf postgresql-9.4.25.tar.gz
cd postgresql-9.4.25/
./configure --prefix=/usr/local/pgsql
make
make install
mkdir /data/pgsql -p
useradd postgres
chown -R postgres:postgres /usr/local/pgsql /data/pgsql
su postgres
/usr/local/pgsql/bin/initdb -D /data/pgsql/
/usr/local/pgsql/bin/pg_ctl -D /data/pgsql/ -l /usr/local/pgsql/pgsql.log start
```
配置环境变量方便使用
```
vim /etc/profile
export PGSQL_HOME=/usr/local/pgsql
export PATH=$PATH:$PGSQL_HOME/bin

#使配置生效
source /etc/profile
```

systemd启动
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
> URL: https://www.soulchild.cn/1852/  

