# mysql-MySQL配置文件my.cnf的理解

<!--more-->
原文：https://www.cnblogs.com/langdashu/p/5889352.html


参数详解（补充ing...）

[client]                   #客户端设置，即客户端默认的连接参数

port = 3307                 #默认连接端口

socket = /data/mysqldata/3307/mysql.sock   #用于本地连接的socket套接字

default-character-set = utf8mb4       #编码

[mysqld]                   #服务端基本设置

port = 3307 MySQL监听端口

socket = /data/mysqldata/3307/mysql.sock   #为MySQL客户端程序和服务器之间的本地通讯指定一个套接字文件

pid-file = /data/mysqldata/3307/mysql.pid  #pid文件所在目录

basedir = /usr/local/mysql-5.7.11      #使用该目录作为根目录（安装目录）

datadir = /data/mysqldata/3307/data     #数据文件存放的目录

tmpdir = /data/mysqldata/3307/tmp       #MySQL存放临时文件的目录

character_set_server = utf8mb4        #服务端默认编码（数据库级别）

collation_server = utf8mb4_bin        #服务端默认的比对规则，排序规则

user = mysql                 #MySQL启动用户

log_bin_trust_function_creators = 1      #This variable applies when binary logging is enabled. It controls whether stored function creators can be trusted not to create stored functions that will cause                        #unsafe events to be written to the binary log. If set to 0 (the default), users are not permitted to create or alter stored functions unless they have the SUPER                        #privilege in addition to the CREATE ROUTINE or ALTER ROUTINE privilege. 开启了binlog后，必须设置这个值为1.主要是考虑binlog安全

performance_schema = 0            #性能优化的引擎，默认关闭

secure_auth = 1               #secure_auth 为了防止低版本的MySQL客户端(&lt;4.1)使用旧的密码认证方式访问高版本的服务器。MySQL 5.6.7开始secure_auth 默认为启用值1

#ft_min_word_len = 1             #开启全文索引

#myisam_recover                #自动修复MySQL的myisam表

explicit_defaults_for_timestamp        #明确时间戳默认null方式

event_scheduler                #计划任务（事件调度器）

skip-external-locking            #跳过外部锁定;External-locking用于多进程条件下为MyISAM数据表进行锁定

skip-name-resolve              #跳过客户端域名解析；当新的客户连接mysqld时，mysqld创建一个新的线程来处理请求。该线程先检查是否主机名在主机名缓存中。如果不在，线程试图解析主机名。

#使用这一选项以消除MySQL进行DNS解析的时间。但需要注意，如果开启该选项，则所有远程主机连接授权都要使用IP地址方式，否则MySQL将无法正常处理连接请求!

#bind-address = 127.0.0.1          #MySQL绑定IP

skip-slave-start               #为了安全起见，复制环境的数据库还是设置--skip-slave-start参数，防止复制随着mysql启动而自动启动

slave_net_timeout = 30            #The number of seconds to wait for more data from a master/slave connection before aborting the read. MySQL主从复制的时候，

#当Master和Slave之间的网络中断，但是Master和Slave无法察觉的情况下（比如防火墙或者路由问题）。

#Slave会等待slave_net_timeout设置的秒数后，才能认为网络出现故障，然后才会重连并且追赶这段时间主库的数据。

#1.用这三个参数来判断主从是否延迟是不准确的Slave_IO_Running,Slave_SQL_Running,Seconds_Behind_Master.还是用pt-heartbeat吧。

#2.slave_net_timeout不要用默认值，设置一个你能接受的延时时间。

local-infile = 0               #设定是否支持命令load data local infile。如果指定local关键词，则表明支持从客户主机读文件

back_log = 1024               #指定MySQL可能的连接数量。当MySQL主线程在很短的时间内得到非常多的连接请求，该参数就起作用，之后主线程花些时间（尽管很短）检查连接并且启动一个新线程。

#back_log参数的值指出在MySQL暂时停止响应新请求之前的短时间内多少个请求可以被存在堆栈中。

#sql_mode = 'PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,NO_KEY_OPTIONS,NO_TABLE_OPTIONS,NO_FIELD_OPTIONS,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'

sql_mode = NO_ENGINE_SUBSTITUTION,NO_AUTO_CREATE_USER  #sql_mode,定义了mysql应该支持的sql语法，数据校验等!  NO_AUTO_CREATE_USER：禁止GRANT创建密码为空的用户。

#NO_ENGINE_SUBSTITUTION 如果需要的存储引擎被禁用或未编译，可以防止自动替换存储引擎

key_buffer_size = 32M            #索引块的缓冲区大小，对MyISAM表性能影响最大的一个参数.决定索引处理的速度，尤其是索引读的速度。默认值是16M，通过检查状态值Key_read_requests

#和Key_reads，可以知道key_buffer_size设置是否合理

max_allowed_packet = 512M          #一个查询语句包的最大尺寸。消息缓冲区被初始化为net_buffer_length字节，但是可在需要时增加到max_allowed_packet个字节。

#该值太小则会在处理大包时产生错误。如果使用大的BLOB列，必须增加该值。

#这个值来限制server接受的数据包大小。有时候大的插入和更新会受max_allowed_packet 参数限制，导致写入或者更新失败。

thread_stack = 256K             #线程缓存；主要用来存放每一个线程自身的标识信息，如线程id，线程运行时基本信息等等，我们可以通过 thread_stack 参数来设置为每一个线程栈分配多大的内存。

sort_buffer_size = 16M            #是MySQL执行排序使用的缓冲大小。如果想要增加ORDER BY的速度，首先看是否可以让MySQL使用索引而不是额外的排序阶段。

#如果不能，可以尝试增加sort_buffer_size变量的大小。

read_buffer_size = 16M            #是MySQL读入缓冲区大小。对表进行顺序扫描的请求将分配一个读入缓冲区，MySQL会为它分配一段内存缓冲区。read_buffer_size变量控制这一缓冲区的大小。

#如果对表的顺序扫描请求非常频繁，并且你认为频繁扫描进行得太慢，可以通过增加该变量值以及内存缓冲区大小提高其性能。

join_buffer_size = 16M           #应用程序经常会出现一些两表（或多表）Join的操作需求，MySQL在完成某些 Join 需求的时候（all/index join），为了减少参与Join的“被驱动表”的

#读取次数以提高性能，需要使用到 Join Buffer 来协助完成 Join操作。当 Join Buffer 太小，MySQL 不会将该 Buffer 存入磁盘文件，

#而是先将Join Buffer中的结果集与需要 Join 的表进行 Join 操作，

#然后清空 Join Buffer 中的数据，继续将剩余的结果集写入此 Buffer 中，如此往复。这势必会造成被驱动表需要被多次读取，成倍增加 IO 访问，降低效率。

read_rnd_buffer_size = 32M         #是MySQL的随机读缓冲区大小。当按任意顺序读取行时(例如，按照排序顺序)，将分配一个随机读缓存区。进行排序查询时，MySQL会首先扫描一遍该缓冲，以避免磁盘搜索，

#提高查询速度，如果需要排序大量数据，可适当调高该值。但MySQL会为每个客户连接发放该缓冲空间，所以应尽量适当设置该值，以避免内存开销过大。

net_buffer_length = 16K           #通信缓冲区在查询期间被重置到该大小。通常不要改变该参数值，但是如果内存不足，可以将它设置为查询期望的大小。

#（即，客户发出的SQL语句期望的长度。如果语句超过这个长度，缓冲区自动地被扩大，直到max_allowed_packet个字节。）

myisam_sort_buffer_size = 128M        #当对MyISAM表执行repair table或创建索引时，用以缓存排序索引；设置太小时可能会遇到” myisam_sort_buffer_size is too small”

bulk_insert_buffer_size = 32M        #默认8M，当对MyISAM非空表执行insert … select/ insert … values(…),(…)或者load data infile时，使用树状cache缓存数据，每个thread分配一个；

#注：当对MyISAM表load 大文件时，调大bulk_insert_buffer_size/myisam_sort_buffer_size/key_buffer_size会极大提升速度

thread_cache_size = 384           #thread_cahe_size线程池，线程缓存。用来缓存空闲的线程，以至于不被销毁，如果线程缓存在的空闲线程，需要重新建立新连接，

#则会优先调用线程池中的缓存，很快就能响应连接请求。每建立一个连接，都需要一个线程与之匹配。

query_cache_size = 0             #工作原理： 一个SELECT查询在DB中工作后，DB会把该语句缓存下来，当同样的一个SQL再次来到DB里调用时，DB在该表没发生变化的情况下把结果从缓存中返回给Client。

#在数据库写入量或是更新量也比较大的系统，该参数不适合分配过大。而且在高并发，写入量大的系统，建系把该功能禁掉。

query_cache_type = 0             #决定是否缓存查询结果。这个变量有三个取值：0,1,2，分别代表了off、on、demand。

tmp_table_size = 1024M          #它规定了内部内存临时表的最大值，每个线程都要分配。（实际起限制作用的是tmp_table_size和max_heap_table_size的最小值。）

#如果内存临时表超出了限制，MySQL就会自动地把它转化为基于磁盘的MyISAM表，存储在指定的tmpdir目录下

max_heap_table_size = 512M          #独立的内存表所允许的最大容量.# 此选项为了防止意外创建一个超大的内存表导致永尽所有的内存资源.

open_files_limit = 10240          #mysql打开最大文件数

max_connections = 2000           #MySQL无论如何都会保留一个用于管理员（SUPER）登陆的连接，用于管理员连接数据库进行维护操作，即使当前连接数已经达到了max_connections。

#因此MySQL的实际最大可连接数为max_connections+1；

#这个参数实际起作用的最大值（实际最大可连接数）为16384，即该参数最大值不能超过16384，即使超过也以16384为准；

#增加max_connections参数的值，不会占用太多系统资源。系统资源（CPU、内存）的占用主要取决于查询的密度、效率等；

#该参数设置过小的最明显特征是出现”Too many connections”错误；

max-user-connections = 0          #用来限制用户资源的，0不限制；对整个服务器的用户限制

max_connect_errors = 100000         #max_connect_errors是一个MySQL中与安全有关的计数器值，它负责阻止过多尝试失败的客户端以防止暴力破解密码的情况。max_connect_errors的值与性能并无太大关系。

#当此值设置为10时，意味着如果某一客户端尝试连接此MySQL服务器，但是失败（如密码错误等等）10次，则MySQL会无条件强制阻止此客户端连接。

table_open_cache = 5120          #表描述符缓存大小，可减少文件打开/关闭次数；

interactive_timeout = 86400        #interactive_time -- 指的是mysql在关闭一个交互的连接之前所要等待的秒数(交互连接如mysql gui tool中的连接

wait_timeout = 86400            #wait_timeout -- 指的是MySQL在关闭一个非交互的连接之前所要等待的秒数

binlog_cache_size = 16M          #二进制日志缓冲大小

#我们知道InnoDB存储引擎是支持事务的，实现事务需要依赖于日志技术，为了性能，日志编码采用二进制格式。那么，我们如何记日志呢？有日志的时候，就直接写磁盘？

#可是磁盘的效率是很低的，如果你用过Nginx，，一般Nginx输出access log都是要缓冲输出的。因此，记录二进制日志的时候，我们是否也需要考虑Cache呢？

#答案是肯定的，但是Cache不是直接持久化，于是面临安全性的问题——因为系统宕机时，Cache中可能有残余的数据没来得及写入磁盘。因此，Cache要权衡，要恰到好处：

#既减少磁盘I/O，满足性能要求；又保证Cache无残留，及时持久化，满足安全要求。

slow_query_log = 1             #开启慢查询

long_query_time = 1            #超过的时间为1s；MySQL能够记录执行时间超过参数 long_query_time 设置值的SQL语句，默认是不记录的。

log-slow-admin-statements

log-queries-not-using-indexes       #记录管理语句和没有使用index的查询记录

# *** Replication related settings ***

binlog_format = ROW            #在复制方面的改进就是引进了新的复制技术：基于行的复制。简言之，这种新技术就是关注表中发生变化的记录，而非以前的照抄 binlog 模式。

#从 MySQL 5.1.12 开始，可以用以下三种模式来实现：基于SQL语句的复制(statement-based replication, SBR)，基于行的复制(row-based replication, RBR)，

混合模式复制(mixed-based replication, MBR)。相应地，binlog的格式也有三种：STATEMENT，ROW，MIXED。MBR 模式中，SBR 模式是默认的。

#max_binlog_cache_size = 102400                 # 为每个session 最大可分配的内存，在事务过程中用来存储二进制日志的缓存。

log-bin = /data/mysqldata/3307/binlog/mysql-bin        #开启二进制日志功能，binlog数据位置

log-bin-index = /data/mysqldata/3307/binlog/mysql-bin.index

relay-log = /data/mysqldata/3307/relay/mysql-relay-bin     #relay-log日志记录的是从服务器I/O线程将主服务器的二进制日志读取过来记录到从服务器本地文件，

#然后SQL线程会读取relay-log日志的内容并应用到从服务器

relay-log-index = /data/mysqldata/3307/relay/mysql-relay-bin.index #binlog传到备机被写道relaylog里，备机的slave sql线程从relaylog里读取然后应用到本地。

server_id = 100             #服务端ID，用来高可用时做区分

log_slave_updates = 1           #log_slave_updates是将从服务器从主服务器收到的更新记入到从服务器自己的二进制日志文件中。

expire-logs-days = 15           #二进制日志自动删除的天数。默认值为0,表示“没有自动删除”。启动时和二进制日志循环时可能删除。

max_binlog_size = 512M           #如果二进制日志写入的内容超出给定值，日志就会发生滚动。你不能将该变量设置为大于1GB或小于4096字节。 默认值是1GB。

replicate-wild-ignore-table = mysql.%  #replicate-wild-ignore-table参数能同步所有跨数据库的更新，比如replicate-do-db或者replicate-ignore-db不会同步类似

#replicate-wild-do-table = db_name.%   #设定需要复制的Table

#slave-skip-errors = 1062,1053,1146    #复制时跳过一些错误;不要胡乱使用这些跳过错误的参数，除非你非常确定你在做什么。当你使用这些参数时候，MYSQL会忽略那些错误，

#这样会导致你的主从服务器数据不一致。

auto_increment_offset = 1

auto_increment_increment = 2        #这两个参数一般用在主主同步中，用来错开自增值, 防止键值冲突

relay_log_info_repository = TABLE     #将中继日志的信息写入表:mysql.slave_realy_log_info

master_info_repository = TABLE       #将master的连接信息写入表：mysql.salve_master_info

relay_log_recovery = on          #中继日志自我修复；当slave从库宕机后，假如relay-log损坏了，导致一部分中继日志没有处理，则自动放弃所有未执行的relay-log，

#并且重新从master上获取日志，这样就保证了relay-log的完整性

# *** innodb setting ***

innodb_buffer_pool_size = 4G        #InnoDB 用来高速缓冲数据和索引内存缓冲大小。 更大的设置可以使访问数据时减少磁盘 I/O。

innodb_data_file_path = ibdata1:1G:autoextend  #单独指定数据文件的路径与大小

innodb_flush_log_at_trx_commit = 0      #每次commit 日志缓存中的数据刷到磁盘中。通常设置为 1，意味着在事务提交前日志已被写入磁盘， 事务可以运行更长以及服务崩溃后的修复能力。

#如果你愿意减弱这个安全，或你运行的是比较小的事务处理，可以将它设置为 0 ，以减少写日志文件的磁盘 I/O。这个选项默认设置为 0。

#sync_binlog = 1000            #sync_binlog=n，当每进行n次事务提交之后，MySQL将进行一次fsync之类的磁盘同步指令来将binlog_cache中的数据强制写入磁盘。

innodb_read_io_threads = 8

innodb_write_io_threads = 8        #对于多核的CPU机器，可以修改innodb_read_io_threads和innodb_write_io_threads来增加IO线程，来充分利用多核的性能

innodb_file_format = Barracuda      #Innodb Plugin引擎开始引入多种格式的行存储机制，目前支持：Antelope、Barracuda两种。其中Barracuda兼容Antelope格式。

innodb_open_files = 65536         #限制Innodb能打开的表的数量

innodb_purge_threads = 1         #开始碎片回收线程。这个应该能让碎片回收得更及时而且不影响其他线程的操作

innodb_support_xa = FALSE        #分布式事务

innodb_log_buffer_size = 256M      #InnoDB 将日志写入日志磁盘文件前的缓冲大小。理想值为 1M 至 8M。大的日志缓冲允许事务运行时不需要将日志保存入磁盘而只到事务被提交(commit)。

#因此，如果有大的事务处理，设置大的日志缓冲可以减少磁盘I/O。

innodb_log_file_size = 1G        #日志组中的每个日志文件的大小(单位 MB)。如果 n 是日志组中日志文件的数目，那么理想的数值为 1M 至下面设置的缓冲池(buffer pool)大小的 1/n。较大的值，

#可以减少刷新缓冲池的次数，从而减少磁盘 I/O。但是大的日志文件意味着在崩溃时需要更长的时间来恢复数据。

innodb_log_files_in_group = 3      #指定有三个日志组

#innodb_lock_wait_timeout = 120     #在回滚(rooled back)之前，InnoDB 事务将等待超时的时间(单位 秒)

innodb_max_dirty_pages_pct = 75     #innodb_max_dirty_pages_pct作用：控制Innodb的脏页在缓冲中在那个百分比之下，值在范围1-100,默认为90.这个参数的另一个用处：

#当Innodb的内存分配过大，致使swap占用严重时，可以适当的减小调整这个值，使达到swap空间释放出来。建义：这个值最大在90%，最小在15%。

#太大，缓存中每次更新需要致换数据页太多，太小，放的数据页太小，更新操作太慢。

innodb_buffer_pool_instances = 4     #innodb_buffer_pool_size 一致 可以开启多个内存缓冲池，把需要缓冲的数据hash到不同的缓冲池中，这样可以并行的内存读写。

innodb_io_capacity = 500        #这个参数据控制Innodb checkpoint时的IO能力

innodb_file_per_table = 1        #作用：使每个Innodb的表，有自已独立的表空间。如删除文件后可以回收那部分空间。

#分配原则：只有使用不使用。但ＤＢ还需要有一个公共的表空间。

innodb_change_buffering = inserts    #当更新/插入的非聚集索引的数据所对应的页不在内存中时（对非聚集索引的更新操作通常会带来随机IO），会将其放到一个insert buffer中，

#当随后页面被读到内存中时，会将这些变化的记录merge到页中。当服务器比较空闲时，后台线程也会做merge操作

innodb_adaptive_flushing = 1      #该值影响每秒刷新脏页的操作，开启此配置后，刷新脏页会通过判断产生重做日志的速度来判断最合适的刷新脏页的数量；

transaction-isolation = READ-COMMITTED  #数据库事务隔离级别 ，读取提交内容

innodb_flush_method = O_DIRECT      #innodb_flush_method这个参数控制着innodb数据文件及redo log的打开、刷写模式

#InnoDB使用O_DIRECT模式打开数据文件，用fsync()函数去更新日志和数据文件。

#innodb_use_sys_malloc = 1        #默认设置值为1.设置为0：表示Innodb使用自带的内存分配程序；设置为1：表示InnoDB使用操作系统的内存分配程序。

[mysqldump]

quick                 #它强制 mysqldump 从服务器查询取得记录直接输出而不是取得所有记录后将它们缓存到内存中

max_allowed_packet = 512M        #限制server接受的数据包大小;指代mysql服务器端和客户端在一次传送数据包的过程当中数据包的大小

net_buffer_length = 16384        #TCP/IP和套接字通信缓冲区大小,创建长度达net_buffer_length的行

[mysql]

auto-rehash              #auto-rehash是自动补全的意思

[isamchk]                #isamchk数据检测恢复工具

key_buffer = 256M

sort_buffer_size = 256M

read_buffer = 2M

write_buffer = 2M

[myisamchk]              #使用myisamchk实用程序来获得有关你的数据库桌表的信息、检查和修复他们或优化他们

key_buffer = 256M

sort_buffer_size = 256M

read_buffer = 2M

write_buffer = 2M

[mysqlhotcopy]

interactive-timeout #mysqlhotcopy使用lock tables、flush tables和cp或scp来快速备份数据库.它是备份数据库或单个表最快的途径,完全属于物理备份,但只能用于备份MyISAM存储引擎和运行在数据库目录所在的机器上.

#与mysqldump备份不同,mysqldump属于逻辑备份,备份时是执行的sql语句.使用mysqlhotcopy命令前需要要安装相应的软件依赖包.


[mysqld_safe]

log-error=/var/log/mysql.log   #指定mysql错误日志路径


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/350/  

