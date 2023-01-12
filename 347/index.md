# mysql-中文乱码设置字符集编码

<!--more-->
<strong><span style="color: #ff0000;">查看库、表、字段的字符集</span></strong>

mysql&gt; show create database `库名`;
mysql&gt; show create table `表名`;

&nbsp;

<strong><span style="color: #ff0000;">修改库的字符集</span></strong>

mysql&gt; alter database `库名` default character set utf8 collate utf8_general_ci;

&nbsp;

<strong><span style="color: #ff0000;">修改表的字符集</span></strong>

mysql&gt; alter table `表名` default character set utf8collate utf8_general_ci;

&nbsp;

<strong><span style="color: #ff0000;">修改字段的字符集</span></strong>

mysql&gt; alter table`表名`modify name char(10) collate utf8_general_ci;

&nbsp;

<strong><span style="color: #ff0000;">查看字符集</span></strong>

show variables like '%character%';

&nbsp;

<strong><span style="color: #ff0000;">修改客户端字符集</span></strong>

临时：

mysql&gt; set names utf8;

永久：修改my.cnf配置文件

[client]

default-character-set=utf8

&nbsp;

<strong><span style="color: #ff0000;">修改服务端字符集</span></strong>

永久：修改my.cnf配置文件

[mysqld]

init_connect='SET NAMES utf8'

default-character-set=utf8    # mysql5.1及以前版本

or
<div>character-set-server=utf8     # 其他版本</div>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/347/  

