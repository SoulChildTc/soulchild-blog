# zabbix4.0编译安装

<!--more-->
下载地址：

https://nchc.dl.sourceforge.net/project/zabbix/ZABBIX%20Latest%20Stable/4.0.16/zabbix-4.0.16.tar.gz

&nbsp;

解压安装：

tar xf zabbix-4.0.16.tar.gz

groupadd zabbix

useradd -g zabbix zabbix

yum install -y net-snmp net-snmp-devel libevent libevent-devel

./configure --prefix=/application/zabbix --enable-server --enable-agent --with-mysql --enable-ipv6 --with-net-snmp --with-libcurl --with-libxml2

make install

echo 'export PATH=/application/zabbix/sbin:$PATH'  &gt;&gt; /etc/profile

&nbsp;

配置mysql：

create database zabbix character set utf8 collate utf8_bin;

grant all privileges on zabbix.* to 'zabbix'@'localhost' identified by '&lt;password&gt;';

导入库：

cd /server/packages/zabbix-4.0.16/frontends/phpdatabase/mysql
mysql -uzabbix -p&lt;password&gt; zabbix &lt; schema.sql
# 下面步骤当创建Zabbix proxy数据库时不需要执行
mysql -uzabbix -p&lt;password&gt; zabbix &lt; images.sql
mysql -uzabbix -p&lt;password&gt; zabbix &lt; data.sql

&nbsp;

配置zabbix_server
vim /application/zabbix/etc/zabbix_server.conf
DBName=zabbix
DBUser=zabbix
DBUser=zabbix

&nbsp;

启动zabbix_server(agent同理)

su - zabbix -c zabbix_server

&nbsp;

安装zabbix_web
/server/packages/zabbix-4.0.16/frontends/php
cp -a /application/zabbix_web

打开浏览器安装

&nbsp;

zabbix-server启动脚本
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">[Unit]
Description=zabbix server
After=syslog.target network.target

[Service]
Type=simple
PIDFile=/tmp/zabbix_server.pid
ExecStart=/application/zabbix/sbin/zabbix_server
ExecReload=/bin/kill -USR2 $MAINPID
ExecStop=/bin/kill -SIGTERM $MAINPID

[Install]
WantedBy=multi-user.target</code></pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1395/  

