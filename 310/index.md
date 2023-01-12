# mysql-insert插入

<!--more-->
<strong>基础创建语句</strong>
<h2><span style="color: #ff0000; font-size: 12pt;"><strong>1.创建一张test表</strong></span></h2>
create table test(

`id` int(4) not null auto_increment,

`name` char(20) not null,

primary key(id)

);
<h2><span style="color: #ff0000; font-size: 12pt;"><strong>2.插入</strong></span></h2>
<span style="font-size: 11pt;"><strong>方法1：</strong>插入<span style="white-space: normal;">多条数据在后面加逗号和括号即可</span></span>

语法：insert into `表名`(字段名,字段名) values(值,值),(值,值);

mysql&gt;insert into test(id,name) values(1,'soulchild');

因为id字段是自增的，所以插入时不写id也可以
<p style="white-space: normal;">mysql&gt;insert into test(name) values('xiaoming');</p>
mysql&gt; select * from test;

+----+-----------+

| id | name      |

+----+-----------+

|  1 | soulchild |

|  2 | xiaoming  |

+----+-----------+

2 rows in set (0.00 sec)
<h4><strong> </strong></h4>
<span style="font-size: 12pt;"><strong>方法2:</strong></span>

<span style="white-space: normal;">按照表结构顺序插入</span>(多条数据在后面加逗号和括号即可)

<span style="white-space: normal;">语法：insert into `表名` values(值,值),(值,值);</span>

mysql&gt;insert into test values(3,'xiaobai');

mysql&gt; select * from test;
+----+-----------+
| id | name      |
+----+-----------+
|  1 | soulchild |
|  2 | xiaoming  |
|  3 | xiaobai   |
+----+-----------+
3 rows in set (0.00 sec)
<h3></h3>
<h2><span style="font-size: 12pt;"><strong>插入多条数据举例：<span style="color: #e53333;">(推荐)</span></strong></span></h2>
mysql&gt; insert into test values(1,'soulchild'),(2,'xiaoming'),(3,'xiaobai'),(4,'xiaoli'),(5,'xiaohong');


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/310/  

