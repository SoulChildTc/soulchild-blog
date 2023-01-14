# mysql主主复制+keepalived部署

<!--more-->
环境：

mysql-master-01：10.0.0.30

mysql-master-02：10.0.0.35

vip：10.0.0.39

&nbsp;

安装mysql5.7.20

可参考：https://soulchild.cn/266.html

&nbsp;

开始配置主主环境

一、修改mysql配置

master-01：
<pre class="line-numbers" data-start="1"><code class="language-bash">[mysqld]
basedir=/application/mysql
datadir=/data/mysql
socket=/tmp/mysql.sock
server_id=1
port=3306
log-bin=mysql-bin
relay-log = mysql-relay-bin
replicate-wild-ignore-table=mysql.%
replicate-wild-ignore-table=information_schema.%

[mysql]
socket=/tmp/mysql.sock
prompt=master-01[\\d]&gt;

[mysqld_safe]
log-error=/var/log/mysql.log</code></pre>
&nbsp;

master-02：
<pre class="line-numbers" data-start="1"><code class="language-bash">[mysqld]
basedir=/application/mysql
datadir=/data/mysql
socket=/tmp/mysql.sock
server_id=11
port=3306
log-bin=mysql-bin
relay-log = mysql-relay-bin
replicate-wild-ignore-table=mysql.%
replicate-wild-ignore-table=information_schema.%

[mysql]
socket=/tmp/mysql.sock
prompt=master-02[\\d]&gt;

[mysqld_safe]
log-error=/var/log/mysql.log</code></pre>
&nbsp;

二、配置<strong><span style="color: #ff0000;">msater-01主</span></strong>,<strong><span style="color: #ff0000;">master-02从</span></strong>

1.添加主从复制用户，<strong><span style="color: #ff0000;">master-01</span></strong>执行
<pre class="line-numbers" data-start="1"><code class="language-bash">grant replication slave on *.* to 'repl'@'10.0.0.%' identified by 'replpass';
grant all on blog.* to 'blog'@'10.0.0.%' identified by 'blog123';
#记录两个值File和Position
show master status;</code></pre>
<img src="images/74d89fda9e4aa48ae20340fb1e7849cc.png "74d89fda9e4aa48ae20340fb1e7849cc"" />

&nbsp;

2.master-02中执行，指定master-01服务器作为主服务器
<pre class="line-numbers" data-start="1"><code class="language-bash">#mysql-bin.000001和704为上面获取的值
change master to master_host='<span style="color: #ff0000;">10.0.0.30</span>',master_user='repl',master_password='replpass',master_log_file='<span style="color: #ff0000;">mysql-bin.000001</span>',master_log_pos=<span style="color: #ff0000;">704</span>;
strart slave;
show slave status\G</code></pre>
<img src="images/0cc7360faa6cee268672fee26b9835de.png "0cc7360faa6cee268672fee26b9835de"" />

&nbsp;

三、配置<span style="color: #ff0000;"><strong>msater-02主</strong></span>,<span style="color: #ff0000;"><strong>master-01从</strong></span>

1.添加主从复制用户，<strong><span style="color: #ff0000;">master-02</span></strong>执行
<pre class="line-numbers" data-start="1"><code class="language-bash">grant replication slave on *.* to 'repl'@'10.0.0.%' identified by 'replpass';
grant all on blog.* to 'blog'@'10.0.0.%' identified by 'blog123';
#记录两个值File和Position
show master status;</code></pre>
<img src="images/57606e28cb6ed6abac89fa8e8f82280d.png "57606e28cb6ed6abac89fa8e8f82280d"" />

2.<span style="color: #ff0000;"><strong>master-01</strong></span>中执行，指定master-02服务器作为主服务器
<pre class="line-numbers" data-start="1"><code class="language-bash">#mysql-bin.000003和704为上面获取的值
change master to master_host='<span style="color: #ff0000;">10.0.0.35</span>',master_user='repl',master_password='replpass',master_log_file='<span style="color: #ff0000;">mysql-bin.000003</span>',master_log_pos=<span style="color: #ff0000;">704</span>;
strart slave;
show slave status\G</code></pre>
&nbsp;

测试数据同步：
<pre class="line-numbers" data-start="1"><code class="language-bash">master-<span style="color: #ff0000;">01</span>[blog]&gt;create database blog;

master-<span style="color: #ff0000;">01</span>[blog]&gt;use blog;

master-<span style="color: #ff0000;">01</span>[blog]&gt;create table user(

`username` char(10),

`password` char(10)

);

master-<span style="color: #ff0000;">02</span>[blog]&gt;show databases;

master-<span style="color: #ff0000;">02</span>[blog]&gt;use blog;

master-<span style="color: #ff0000;">02</span>[blog]&gt;show tables;

master-<span style="color: #ff0000;">02</span>[blog]&gt;insert into `user` (username,password) values('li','123');

master-<span style="color: #ff0000;">01</span>[blog]&gt;select * from user;

</code></pre>
&nbsp;

四、安装配置keepalived

1.两个节点安装

yum install -y keepalived

master-01的keepalived配置文件（此配置未考虑脑裂问题）：
<pre class="line-numbers" data-start="1"><code class="language-bash">global_defs {
   notification_email {
     742899387@qq.com
   }
   notification_email_from keepalived@local.com
   smtp_server 192.168.200.1
   smtp_connect_timeout 30
   router_id mysql-master-01
}

vrrp_script check_mysql {
    script "/server/scripts/keepalived/check_mysql.pl"
    interval 2
}

vrrp_instance mysql {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }

    virtual_ipaddress {
        10.0.0.39
    }
    track_script {
        check_mysql
    }
}</code></pre>
master-02的keepalived配置文件
<pre class="line-numbers" data-start="1"><code class="language-bash">global_defs {
   notification_email {
     742899387@qq.com
   }
   notification_email_from keepalived@local.com
   smtp_server 192.168.200.1
   smtp_connect_timeout 30
   router_id mysql-master-02
}

vrrp_script check_mysql {
    script "/server/scripts/keepalived/check_mysql.pl"
    interval 2
}

vrrp_instance mysql {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 80
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }

    virtual_ipaddress {
        10.0.0.39
    }
    track_script {
        check_mysql
    }
}</code></pre>
2.编写状态检测脚本
<pre class="line-numbers" data-start="1"><code class="language-bash">mkdir /server/scripts/keepalived/ -p
cd /server/scripts/keepalived/
vim check_mysql.pl</code></pre>
脚本
<pre class="line-numbers" data-start="1"><code class="language-bash">#!/usr/bin/perl -w

use DBI;
use DBD::mysql;

# CONFIG VARIABLES
$SBM = 120;
$db = "mysql";
$host = $ARGV[0];
$port = 3306;
$user = "root";
$pw = "123456";

# SQL query
$query = "show slave status";

$dbh = DBI-&gt;connect("DBI:mysql:$db:$host:$port", $user, $pw, { RaiseError =&gt; 0,PrintError =&gt; 0 });

if (!defined($dbh)) {
    exit 1;
}

$sqlQuery = $dbh-&gt;prepare($query);

$sqlQuery-&gt;execute;
$Slave_IO_Running =  "";
$Slave_SQL_Running = "";
$Seconds_Behind_Master = "";

while (my $ref = $sqlQuery-&gt;fetchrow_hashref()) {
    $Slave_IO_Running = $ref-&gt;{'Slave_IO_Running'};
    $Slave_SQL_Running = $ref-&gt;{'Slave_SQL_Running'};
    $Seconds_Behind_Master = $ref-&gt;{'Seconds_Behind_Master'};
}

$sqlQuery-&gt;finish;
$dbh-&gt;disconnect();

if ( $Slave_IO_Running eq "No" || $Slave_SQL_Running eq "No" ) {
    exit 1;
} else {
    if ( $Seconds_Behind_Master &gt; $SBM ) {
        exit 1;
    } else {
        exit 0;
    }
}
</code></pre>
<pre class="line-numbers" data-start="1"><code class="language-bash">chmod +x check_mysql.pl
</code></pre>
&nbsp;

3. 开启keepalived
<pre class="line-numbers" data-start="1"><code class="language-bash">systemctl start keepalived
systemctl enable keepalived</code></pre>
&nbsp;

4.连接测试

mysql -ublog -p -h 10.0.0.39

show variables like '%hostname%';

关闭master-01

mysql -ublog -p -h 10.0.0.39

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1264/  

