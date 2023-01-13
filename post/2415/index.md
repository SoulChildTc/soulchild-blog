# jira_confluence全量迁移

<!--more-->
1.准备基础环境
mkdir /application

mkdir /server/packages -p

mkdir /data



安装java环境

jdk-8u221-linux-x64.tar.gz

tar xf jdk-8u221-linux-x64.tar.gz -C /application/jdk



安装mysql5.7.20：

mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz

tar xf mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz -C /application/mysql

useradd mysql -M -s /sbin/nologin

mkdir -p /data/mysql

chown -R mysql.mysql /application/mysql

chown -R mysql.mysql /data/mysql

yum install -y libaio-devel

yum remove mariadb-libs

mysqld --initialize-insecure --user=mysql --basedir=/application/mysql --datadir=/data/mysql

cp /application/mysql/support-files/mysql.server /etc/init.d/mysqld



vim /etc/my.cnf

修改配置文件

[mysqld]
basedir=/application/mysql
datadir=/data/mysql
socket=/tmp/mysql.sock
server_id=2
port=3306
log-error=/data/mysql/mysql.log

max_allowed_packet = 256M
transaction-isolation=READ-COMMITTED
character_set_server=utf8mb4
innodb_default_row_format=DYNAMIC
default-storage-engine=INNODB
innodb_large_prefix=ON
innodb_file_format=Barracuda
innodb_log_file_size=2G


[mysql]
socket=/tmp/mysql.sock
prompt=maiunsoft-db-[\\d]>
default-character-set=utf8



启动服务

/etc/init.d/mysqld start





配置环境变量

echo 'PATH=$PATH:/application/jdk/bin/:/application/mysql/bin' >> /etc/profile

source /etc/profile



2.安装jira_confluence
2.1安装tomcat

tar xf jira-tomcat.tar.gz -C /application/jira

tar xf confluence-tomcat.tar.gz -C /application/confluence



2.2还原数据

tar xf jira-data.tar.gz -C /data/Jira

tar xf confluence-data.tar.gzz -C /data/confluence





3.恢复mysql
3.1创建库

CREATE DATABASE jira CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE DATABASE confluence CHARACTER SET utf8 COLLATE utf8_bin;

GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,REFERENCES,ALTER,INDEX on jira.* TO 'jira'@'localhost' IDENTIFIED BY '7a15vuLai$';

GRANT all on confluence.* TO 'jira'@'localhost' ;

flush privileges;



mysql -uroot -p jira < xxx.sql

mysql -uroot -p confluence < xxx.sql



4.启动配置Jira
4.1设置目前权限创建用户

useradd jira

chown -R jira.jira /application/jira/

chown -R jira.jira /data/jira/



useradd confluence

chown -R confluence.confluence /application/confluence

chown -R confluence.confluence /data/confluence/





4.2修改数据库连接,启动服务

vim /data/jira/dbconfig.xml

/application/jira/bin/start-jira.sh



vim /data/confluuence/confluence.cfg.xml

将用户改成confluence

vim /application/confluence/bin/user.sh

启动服务

sh /application/confluence/bin/start-confluence.sh






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2415/  

