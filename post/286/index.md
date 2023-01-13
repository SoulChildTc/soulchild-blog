# mysql5.5.32源代码安装

<!--more-->
mysql5.5.32源码包下载地址：

<a href="https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.32.tar.gz" target="_blank" rel="noopener">https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.32.tar.gz</a>

<strong><span style="color: #e53333; font-size: 14px;">1.安装依赖包</span></strong>

yum install -y cmake ncurses-devel

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">2.创建用户、组</span></strong>

groupadd mysql

useradd mysql -s /sbin/nologin -M -g mysql

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">3.解压mysql</span></strong>

tar xf mysql-5.5.32.tar.gz

cd mysql-5.5.32

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">4.编译</span></strong>

cmake . -DCMAKE_INSTALL_PREFIX=/application/mysql-5.5.32 \

-DMYSQL_DATADIR=/application/mysql-5.5.32/data \

-DMYSQL_UNIX_ADDR=/application/mysql-5.5.32/tmp/mysql.sock \

-DDEFAULT_CHARSET=utf8 \

-DDEFAULT_COLLATION=utf8_general_ci \

-DEXTRA_CHARSET=gbk,gb2312,utf8,ascii \

-DENABLED_LOCAL_INFILE=on \

-DWITH_INNOBASE_STORAGE_ENGINE=1 \

-DWITH_FEDERATED_STORAGE_ENGINE=1 \

-DWITH_BLACKHOLE_STORAGE_ENGINE=1 \

-DWITHOUT_EXAMPL_ESTORAGE_ENGINE=1 \

-DWITHOUT_PARTITION_ESTORAGE_ENGINE=1 \

-DWITH_FAST_MUTEXES=1 \

-DWITH_ZLIB=bundled \

-DENABLED_LOCAL_INFILE=1 \

-DWITH_READLINE=1 \

-DWITH_ENBEDDED_SERVER=1 \

-DWITH_DEBUG=0

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">5.安装</span></strong>

make &amp;&amp; make install

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">6.创建软链接</span></strong>

ln –s /application/mysql-5.5.32/ /application/mysql

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">7.复制配置文件</span></strong>

cp /application/mysql/support-files/my-small.cnf /etc/my.cnf

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">8.配置环境变量</span></strong>

echo 'export PATH=/application/mysql/bin:$PATH' &gt;&gt; /etc/profile

source /etc/profile

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">9.初始化mysql</span></strong>

chown -R mysql:mysql /application/mysql/data

/application/mysql/scripts/mysql_install_db <span style="white-space: normal;">--user=mysql</span> --basedir=/application/mysql --datadir=/application/mysql/data

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">10.创建启动脚本</span></strong>

cp /application/mysql/support-files/mysql.server /etc/init.d/mysqld

chmod +x <span style="white-space: normal;">/etc/init.d/mysqld</span>

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">11.启动服务并设置开机自启</span></strong>

<span style="white-space: normal;">service mysqld start</span>

<span style="white-space: normal;">chkconfig mysqld on</span>

&nbsp;

<span style="white-space: normal; color: #e53333; font-size: 14px;"><strong>12.创建和更改密码</strong></span>

/application/mysql//bin/mysqladmin -u root password 'new-password'

或
/application/mysql//bin/mysqladmin -u root -h localhost password 'new-password'

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">13.删除mysql空用户</span></strong>

<span style="white-space: normal;">mysql&gt; </span>delete from mysql.user where user='';

&nbsp;

<span style="color: #e53333; font-size: 14px;"><strong>14.删除test库</strong></span>

mysql&gt; drop database test;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/286/  

