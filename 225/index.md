# centos6.5安装cacti0.8.8h

<!--more-->
##cacti0.8.8h安装笔记
设置时区
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ntpdate time.windows.com
关闭防火墙、selinux
service iptables stop
chkconfig iptables off
setenforce 0


1.安装LAMP环境和snmp、rrdtool
yum install -y httpd httpd-devel mysql-devel  mysql-server mysql php php-mysql gd php-gd gd-devel php-xml php-common php-mbstring php-ldap php-pear php-xmlrpc php-imap net-snmp net-snmp-utils net-snmp-devel rrdtool php-snmp gcc

2.设置服务开机自启
chkconfig --level 35 httpd on
chkconfig --level 35 mysqld on
chkconfig --level 35 snmpd on

3.开启服务
service httpd start
service mysqld start
service snmpd start

4.设置mysql密码
mysqladmin -u root password Abc123.com

5.安装cacti
wget http://www.cacti.net/downloads/cacti-0.8.8h.tar.gz
tar zxvf ./cacti-0.8.8h.tar.gz
cp -r cacti-0.8.8h/* /var/www/html/

6.修改配置文件
vim /var/www/html/include/config.php
#修改为如下参数：
$database_type = "mysql";
$database_default = "cacti";
$database_hostname = "localhost";
$database_username = "cacti";
$database_password = "Abc123.com";

7.配置mysql
mysql -uroot -p #登陆mysql
create database cacti;    #创建库
GRANT ALL ON cacti.* TO cacti@localhost IDENTIFIED BY 'Abc123.com'; #授权cacti用户本地访问，并设置密码为Abc123.com
flush privileges; #刷新权限
quit;

mysql -u cacti -p cacti &lt; /var/www/html/cacti.sql #导入cacti数据库

8.修改php时区
vim /etc/php.ini
#修改如下内容
date.timezone = PRC

#重启服务
service httpd restart


9.安装spine
wget https://www.cacti.net/downloads/spine/cacti-spine-0.8.8h.tar.gz
tar zxvf cacti-spine-0.8.8h.tar.gz
cd cacti-spine-0.8.8h
./configure
make &amp;&amp; make install

cp /usr/local/spine/etc/spine.conf.dist /etc/spine.conf
vim /etc/spine.conf
#修改为如下配置：
DB_Host         localhost
DB_Database     cacti
DB_User         cacti
DB_Pass         Abc123.com
DB_Port         3306


10.添加计划任务
crontab -e
*/1 * * * *  /usr/bin/php /var/www/html/poller.php &gt; /dev/null 2&gt;&amp;1


11.图表中文显示
vim /var/www/html/lib/functions.php
在第二行添加如下内容：
setlocale(LC_CTYPE,"zh_CN.UTF-8");

安装中文字体
yum install -y wqy-zenhei-fonts

12.修改cacti默认URI
vim /var/www/html/include/global.php
将第46行改为如下内容：
$url_path = "/";

13.登陆web页面
地址：http://IP/cacti
默认账号密码：admin
第一次登陆要求更改密码

14.设置cacti参数
Console -&gt; Cacti Settings -&gt; General 将SNMP Timeout修改为1000
Console -&gt; Cacti Settings -&gt; paths   将Spine Poller File Path修改为/usr/local/spine/bin/spine
Console -&gt; Cacti Settings -&gt; Poller  将Poller Type改为spine，Poller Interval和cron Interval改为Every Minute
Console -&gt; Cacti Settings -&gt; Poller  将Maximum SNMP OID's 修改为1
Console -&gt; Utilities 点击Rebuild Poller Cache，重建缓存

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/225/  

