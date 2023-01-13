# mysql5.7.20编译安装

<!--more-->
安装包下载地址：https://cdn.mysql.com/archives/mysql-5.7/mysql-boost-5.7.20.tar.gz

依赖包：

```bash
yum -y install make gcc-c++ cmake bison-devel  ncurses-devel  libtool  bison perl perl-devel  perl perl-devel 
```



## 1. 解压

```bash
tar -zxvf mysql-boost-5.7.20.tar.gz
```

## 2. 创建用户

```bash
useradd mysql -M -s /sbin/nologin
```

## 3. 编译安装

```bash
cd mysql-5.7.20/

cmake  \
-DCMAKE_INSTALL_PREFIX=/usr/local/mysql  \
-DEXTRA_CHARSETS=all   \
-DDEFAULT_CHARSET=utf8  \
-DDEFAULT_COLLATION=utf8_general_ci  \
-DWITH_INNOBASE_STORAGE_ENGINE=1  \
-DWITH_MYISAM_STORAGE_ENGINE=1  \
-DMYSQL_USER=mysql  \
-DMYSQL_TCP_PORT=3306  \
-DWITH_BOOST=boost  \
-DENABLED_LOCAL_INFILE=1  \
-DWITH_PARTITION_STORAGE_ENGINE=1  \
-DMYSQL_UNIX_ADDR=/tmp/mysqld.sock  \
-DWITH_EMBEDDED_SERVER=1

make && make install
```



## 4. 初始化数据库

```bash
mkdir -p /data/mysql
chown -R mysql.mysql /data/mysql

/usr/local/mysql/bin/mysqld --initialize-insecure --user=mysql --basedir=/usr/local/mysql --datadir=/data/mysql
```



## 5. 编辑配置文件

```bash
vim /etc/my.cnf

[mysqld]
basedir=/usr/local/mysql
datadir=/data/mysql
socket=/tmp/mysql.sock
port=3306
[mysql]
socket=/tmp/mysql.sock
```



## 6. 创建启动脚本,启动服务

```bash
vim /etc/systemd/system/mysqld.service

[Unit]
Description=MySQL Server
Documentation=man:mysqld(8)
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target
[Install]
WantedBy=multi-user.target
[Service]
User=mysql
Group=mysql
ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/etc/my.cnf
LimitNOFILE = 5000

#启动和设置开机自启
systemctl start mysqld
systemctl enable mysqld
```



##7. 添加环境变量，在文件末尾添加

```bash
vim /etc/profile
export PATH=/usr/local/mysql/bin:$PATH

#执行profile，重新生效
source /etc/profile
```



##8.设置mysql密码

```bash
mysqladmin -S /tmp/mysql.sock -uroot password 'mima'
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/870/  

