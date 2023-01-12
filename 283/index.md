# mysql忘记root密码解决方法

<!--more-->
跳过mysql的TCP/IP连接方式和验证模块

需要用到两个参数：

--skip-grant-tables：跳过加载授权表（mysql.user）

--skip-networking：<span style="white-space: normal;">跳过加载</span>网络连接（<span style="white-space: normal;">关闭通过网络连接</span>）

&nbsp;

(1)停数据库
systemctl  stop mysqld

&nbsp;

(2)跳过授权表启动数据库
mysqld_safe --defaults-file=/etc/my.cnf --skip-grant-tables --skip-networking  &amp;

&nbsp;

(3)修改密码

<span style="white-space: normal;">[root@db01 mysql]mysql</span>

[(none)]&gt;flush privileges;
[(none)]&gt;grant all on *.* to root@'localhost' identified by 'abc' with grant option;
[root@db01 mysql]# mysqladmin -uroot -pabc shutdown
[root@db01 mysql]# systemctl start mysqld
<div></div>
<div style="white-space: nowrap;"></div>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/283/  

