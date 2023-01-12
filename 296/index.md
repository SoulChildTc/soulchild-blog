# mysql基础sql语句(2)

<!--more-->
<span style="color: #ff0000;">创建不同编码的数据库</span>

utf8：

create database soulchild_utf8 default character set utf8 collate utf8_chinese_ci;

gbk：

create database soulchild_gbk default character set <span style="white-space: normal;">gbk collate gbk_chinese_ci;</span>

<hr />

<span style="color: #ff0000;">查看所有数据库：</span>

<span style="white-space: normal;">show databases;</span>

<span style="color: #ff0000;">根据条件查找数据库：</span>

show databases like 'soulchild%';

<span style="color: #ff0000;">查看当前数据库的表：</span>

show tables;

<span style="white-space: normal; color: #ff0000;">查询mysql库中user表的，user、host字段</span><br style="white-space: normal; text-indent: 24px;" /><span style="white-space: normal; text-indent: 24px;">select user ,host  from mysql.user;</span>

<span style="color: #ff0000;">查看指定数据库的表：</span>

show tables in xxx;

show tables like 'xxx';

show tables from xxx;

<span style="white-space: normal; color: #ff0000;">查看当前所在数据库：</span>

<span style="white-space: normal;">select database();</span>

&nbsp;

<span style="white-space: normal; color: #ff0000;">查看数据库版本：</span>

<span style="white-space: normal;">select version();</span>

<span style="white-space: normal; color: #ff0000;">查看当前用户：</span>

<span style="white-space: normal;">select user();
</span>

<span style="color: #ff0000;">查看当前时间：</span>

select now();

<hr />

<span style="color: #ff0000;">删除数据库：</span>

drop database soulchild;

<span style="white-space: normal; color: #ff0000;">进入数据库：</span>

<span style="white-space: normal;">use soulchild;</span>

<hr />

<span style="text-indent: 24px; color: #ff0000;">删除用户:</span>

<span style="white-space: normal; text-indent: 24px;">方法1</span><span style="text-indent: 24px;">.</span>

<span style="text-indent: 24px;">drop user 'soulchild'@'localhost';</span>

<span style="white-space: normal;">flush privileges;</span>

<span style="white-space: normal;">方法2</span>.

delete from mysql.user where user='soulchild' and host='localhost';

<span style="white-space: normal;">flush privileges;</span>

<hr />

<span style="text-indent: 24px; color: #ff0000;">创建用户</span>
<p style="white-space: normal;"><span style="text-indent: 24px;"><span style="white-space: normal; text-indent: 24px;">方法1</span><span style="white-space: normal; text-indent: 24px;">.</span><span style="white-space: normal;">(创建soulchild用户，允许10.0.0网段访问，密码为123</span><span style="white-space: normal;">)</span>
</span></p>
<p style="white-space: normal;"><span style="text-indent: 24px;">create user soulchild@'10.0.0.%' identified by '123';</span></p>
<p style="white-space: normal;"><span style="white-space: normal;">flush privileges;</span></p>
<p style="white-space: normal;">方法2.(创建soulchild用户，对db1库拥有所有权限，允许localhost访问，密码为123)</p>
<p style="text-indent: 0px;">grant all on db1.* to 'soulchild'@'localhost' identified by '123'</p>
<p style="text-indent: 0px;"><span style="white-space: normal;">flush privileges;</span></p>


<hr />

<span style="color: #ff0000;">查看用户权限</span>
<p style="white-space: normal;">show grants for <span style="text-indent: 24px;">soulchild</span>@'localhost';</p>
<p style="white-space: normal;"><span style="color: #ff0000;">收回权限</span></p>
<p style="white-space: normal;">revoke delete on wordpress.* from '<span style="text-indent: 24px;">soulchild</span>'@'10.0.0.%';</p>


<hr />

<span style="white-space: normal; text-indent: 24px; color: #ff0000;">修改用户密码</span><br style="text-indent: 24px;" /><span style="white-space: normal; text-indent: 24px;">方法1.</span>

<span style="white-space: normal; text-indent: 24px;">alter user soulchild@'10.0.0.%' identified by '456'; </span>
<p style="white-space: normal;"><span style="text-indent: 24px;">方法2.</span></p>
<p style="white-space: normal;"><span style="text-indent: 24px;">update mysql.user set password=password('456') where user='soulchild';</span></p>


<hr />
<p style="white-space: normal;"><span style="color: #ff0000;">建表</span></p>
<p style="white-space: normal;"><span style="white-space: normal;">#字段名  类型  是否为空   default默认值</span></p>
<p style="white-space: normal;">create table student(</p>
<p style="white-space: normal;">id int(4) not null,</p>
<p style="white-space: normal;">name char(20) not null,</p>
<p style="white-space: normal;">age tinyint(2) not null default '0',</p>
<p style="white-space: normal;">dept varchar(16) default null</p>
<p style="white-space: normal;">);</p>


<hr />

<span style="color: #ff0000;">清空一张表</span>
<p style="white-space: normal;">truncate table test;</p>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/296/  

