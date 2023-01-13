# mysql5.5.32配置多实例

<!--more-->
<span style="color: #ff0000;"><strong>停止单实例进程</strong></span>

pkill mysqld

<span style="color: #ff0000;"><strong>创建目录结构</strong></span>

[root@db01 ~]# tree /data/
/data/
├── 3306
│   ├── data
│   ├── my.cnf
│   └── mysql
└── 3307
├── data
├── my.cnf
└── mysql
<div>

<hr />

</div>
<span style="color: #ff0000;"><strong>my.cnf配置文件内容</strong></span>

[client]
port = 3306
socket = /data/3306/mysql.sock

[mysql]
no-auto-rehash

[mysqld]
user = mysql
port = 3306
socket = /data/3306/mysql.sock
basedir = /application/mysql
datadir = /data/3306/data
open_files_limit = 1024
back_log =600
max_connections = 800
max_connect_errors = 3000
table_cache = 614
external-locking = FALSE
max_allowed_packet = 8M
sort_buffer_size = 1M
join_buffer_size = 1M
thread_cache_size = 100
thread_concurrency = 2
query_cache_size = 2M
query_cache_limit = 1M
query_cache_min_res_unit = 2K
#default_table_type = InnoDB
thread_stack = 192K
#transaction_isolation = READ-COMMITTED
tmp_table_size = 2M
max_heap_table_size = 2M
long_query_time = 1
pid-file = /data/3306/mysql.pid
relay-log = /data/3306/relay-bin
relay-log-info-file = /data/3306/relay-log.info
binlog_cache_size = 1M
max_binlog_cache_size = 1M
max_binlog_size = 2M
key_buffer_size = 16M
read_buffer_size = 1M
read_rnd_buffer_size = 1M
bulk_insert_buffer_size = 1M
lower_case_table_names = 1
skip-name-resolve
slave-skip-errors = 1032,1062
replicate-ignore-db = mysql
server-id = 1
innodb_additional_mem_pool_size = 4M
innodb_buffer_pool_size = 32M
innodb_data_file_path = ibdata1:128M:autoextend
innodb_file_io_threads = 4
innodb_thread_concurrency = 8
innodb_flush_log_at_trx_commit = 2
innodb_log_buffer_size = 2M
innodb_log_file_size = 4M
innodb_log_files_in_group = 3
innodb_max_dirty_pages_pct = 90
innodb_lock_wait_timeout = 120
innodb_file_per_table = 0
[mysqldump]
quick
max_allowed_packet = 2M

[mysqld_safe]
log-error = /data/3306/mysql_3306.err
pid-file = /data/3306/mysqld.pid

<hr />

<span style="color: #ff0000;"><strong>mysql启动脚本</strong></span>

#!/bin/sh
#init
port=3306
mysql_user="root"
mysql_pwd="wenmeng"
CmdPath="/application/mysql/bin"
mysql_sock="/data/${port}/mysql.sock"
#startup function
function_start_mysql()
{
if [ ! -e "$mysql_sock" ];then
printf "Starting MySQL...\n"
/bin/sh ${CmdPath}/mysqld_safe --defaults-file=/data/${port}/my.cnf 2&gt;&amp;1 &gt; /dev/null &amp;
else
printf "MySQL is running...\n"
exit
fi
}

#stop function
function_stop_mysql()
{
if [ ! -e "$mysql_sock" ];then
printf "MySQL is stopped...\n"
exit
else
printf "Stoping MySQL...\n"
${CmdPath}/mysqladmin -u ${mysql_user} -p${mysql_pwd} -S /data/${port}/mysql.sock shutdown
fi
}

#restart function
function_restart_mysql()
{
printf "Restarting MySQL...\n"
function_stop_mysql
sleep 2
function_start_mysql
}

case $1 in
start)
function_start_mysql
;;
stop)
function_stop_mysql
;;
restart)
function_restart_mysql
;;
*)
printf "Usage: /data/${port}/mysql {start|stop|restart}\n"
esac

<hr />

<span style="color: #e53333;">配置文件：<span style="color: #e53333; white-space: normal;">需要修改文件中的端口号和</span><span style="color: #e53333; white-space: normal;">server-id</span></span>

<span style="color: #e53333;">启动脚本：需要修改文件中的端口号，管理用户和密码</span>

<span style="color: #ff0000;"><strong>修改目录管理权限</strong></span>

chown -R mysql.mysql /data

<span style="color: #ff0000;"><strong>添加启动脚本执行权限</strong></span>

find /data/ -type f -name mysql | xargs chmod +x

<span style="color: #ff0000;"><strong>初始化数据库</strong></span>

/application/mysql/scripts/mysql_install_db --basedir=/application/mysql --datadir=/data/3306/data --user=mysql

/application/mysql/scripts/mysql_install_db --basedir=/application/mysql --datadir=/data/3307/data --user=mysql

<span style="color: #ff0000;"><strong>启动数据库</strong></span>

/data/3306/mysql start

/data/3307/mysql start


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/293/  

