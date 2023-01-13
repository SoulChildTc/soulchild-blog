# centos7 yum安装zabbix4.0

<!--more-->
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">1.配置zabbix源</span></strong></span></h3>
rpm -ivh https://mirrors.tuna.tsinghua.edu.cn/zabbix/zabbix/4.0/rhel/7/x86_64/zabbix-release-4.0-1.el7.noarch.rpm

修改为清华大学镜像源

sed -i 's#repo.zabbix.com#mirrors.tuna.tsinghua.edu.cn/zabbix#g' /etc/yum.repos.d/zabbix.repo

&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">2.安装mysql版zabbix</span></strong></span></h3>
yum install -y zabbix-server-mysql zabbix-web-mysql

&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">3.安装配置数据库</span></strong></span></h3>
# 安装数据库

yum install -y mariadb-server

# 设置开机自启和启动数据库

systemctl enable mariadb

systemctl start mariadb

# 安全初始化 可参考<a href="http://www.soulchild.cn/380.html" target="_blank" rel="noopener">http://www.soulchild.cn/380.html</a>

mysql_secure_installation

创建zabbix库

create database zabbix character set utf8 collate utf8_bin;

创建和授权zabbix用户

grant all privileges on zabbix.* to zabbix@localhost identified by 'zabbix';

#导入zabbix初始数据

zcat /usr/share/doc/zabbix-server-mysql-4.0.8/create.sql.gz | mysql -uroot -p zabbix

&nbsp;
<h3><span style="color: #ff0000; font-size: 12pt;"><strong>4.配置zabbix-server</strong></span></h3>
# 修改为如下信息：

vim /etc/zabbix/zabbix_server.conf

DBHost=localhost

DBName=zabbix

DBUser=zabbix

DBPassword=zabbix

# 启动zabbix-server和设置开机自启

systemctl enable zabbix-server.service

systemctl start zabbix-server.service

&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">5.配置zabbix-web</span></strong></span></h3>
# 修改apache配置文件（第20行）

vim /etc/httpd/conf.d/zabbix.conf

php_value date.timezone Asia/Shanghai

# 启动apache

systemctl start httpd

# 修改目录权限

chown apache.apache -R /usr/share/zabbix/assets/

&nbsp;

打开web，按照提示填写下一步即可

http://10.0.0.62/zabbix/

默认用户名：Admin

默认   密码：zabbix


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/395/  

