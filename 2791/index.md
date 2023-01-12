# mysql tokudb引擎

<!--more-->
# 安装文档
https://www.percona.com/doc/percona-server/5.6/tokudb/tokudb_installation.html

yum remove mariadb-libs
yum install -y libaio perl-devel jemalloc autoconf perl-Test-Simple

下载地址
https://downloads.percona.com/downloads/Percona-Server-5.6/Percona-Server-5.6.51-91.0/binary/redhat/7/x86_64/Percona-Server-5.6.51-91.0-rb59139e-el7-x86_64-bundle.tar

rpm -ivh *


关闭大页内存
```bash
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag
```


安装udf
```bash
mysql -uroot -p -e "CREATE FUNCTION fnv1a_64 RETURNS INTEGER SONAME 'libfnv1a_udf.so'"
mysql -uroot -p -e "CREATE FUNCTION fnv_64 RETURNS INTEGER SONAME 'libfnv_udf.so'"
mysql -uroot -p -e "CREATE FUNCTION murmur_hash RETURNS INTEGER SONAME 'libmurmur_udf.so'"
```

启用tokudb
```bash
ps_tokudb_admin --enable -u root -p
```

启用热备份功能
```bash
ps_tokudb_admin --enable-backup -uroot -p
```

开始一个热备份
```bash
mysql> set tokudb_backup_dir='/var/lib/mysql-bak/';
Query OK, 0 rows affected (0.14 sec)
```

```sql
CREATE DATABASE `testdb1`  DEFAULT CHARACTER SET utf8;

CREATE TABLE `ad` (
  `id` int(8) unsigned NOT NULL,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=TokuDB DEFAULT CHARSET=utf8;
```


最终配置文件
```ini
# Percona Server template configuration

[mysqld]
character-set-server = utf8
collation-server = utf8_general_ci

#
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
# innodb_buffer_pool_size = 128M
#
# Remove leading # to turn on a very important data integrity option: logging
# changes to the binary log between backups.
# log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
pid-file = /var/run/mysqld/mysqld.pid
log-error = /var/log/mysqld.err


# me
relay_log_info_repository=TABLE
master_info_repository=TABLE
relay_log_recovery=ON

# Slow Log Settings
slow_query_log
log-slow-slave-statements
long_query_time = 1
slow_query_log_file = /var/log/mysql-slow.log

# Tunning
#key_buffer_size = 2G
#myisam_sort_buffer_size = 128M
memlock
max_allowed_packet = 64M
table_open_cache = 512
sort_buffer_size = 2M
read_buffer_size = 1M
read_rnd_buffer_size = 4M
query_cache_size = 0
query_cache_type = 0
thread_cache_size = 64
net_buffer_length = 512K

wait_timeout = 30
max_connections = 512
max_connect_errors = 100000
interactive_timeout = 180

# tokudb
loose-tokudb_fs_reserve_percent = 1
#toku backup requirement
innodb_use_native_aio=0


# master slave
server-id = 200
# Master Settings
#log-bin = /home/mysql/binlog/mysql-bin
#binlog_format= row     #statement,mixed,row
#max_binlog_size = 100M
#expire-logs-days = 7
log-slave-updates

# Slave Settings
relay-log = mysql-relay-bin


# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

# Recommended in standard MySQL setup
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES

[mysqld_safe]
preload-hotbackup
thp-setting=never
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2791/  

