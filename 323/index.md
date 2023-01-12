# mysql-select多表连表查询(2)

<!--more-->
<strong><span style="color: #ff0000;">首先创建三张表</span></strong>

<strong><span style="color: #ff0000;">学生表：</span></strong>

create table student(

Sno int(10) not null comment '学号',

Sname varchar(16) not null comment '姓名',

Ssex char(2) not null comment '性别',

Sage tinyint(2) not null default '0' comment '学生年龄',

Sdept varchar(16) default null comment '学生所在系别',

primary key (Sno),

key index_Sname (Sname)

) ;

&nbsp;

<strong><span style="color: #ff0000;">课程表：</span></strong>

create table course(

Cno int(10) NOT NULL COMMENT '课程号',

Cname varchar(64) NOT NULL COMMENT '课程名',

Ccredit tinyint(2) NOT NULL COMMENT '学分',

PRIMARY KEY (Cno)

) ;

&nbsp;

<strong><span style="color: #ff0000;">选课表：</span></strong>

create table `SC` (
SCid int(12) not null auto_increment comment '主键',
Sno int(10) not null comment '学号',
Cno int(10) not null comment '课程号',
Grade tinyint(2) not null comment '学生成绩',
primary key (SCid)
);

&nbsp;

<strong><span style="color: #ff0000;">学生表插入数据：</span></strong>

insert into student values(0001,'小明','男',18,'计算机科学与技术');

insert into student values(0002,'小红','女',25,'管理学');

insert into student values(0003,'小粉','女',28,'会计');

insert into student values(0004,'小紫','女',35,'网络工程');

insert into student values(0005,'小绿','男',28,'工商管理');

insert into student values(0006,'小蓝','男',21,'物流管理');

&nbsp;

<strong><span style="color: #ff0000;">课程表插入数据：</span></strong>

insert into course values(1001,'云计算',1);

insert into course values(1002,'python',1);

insert into course values(1003,'java',1);

insert into course values(1004,'网络工程',1);

insert into course values(1005,'大保健',6);

&nbsp;

<strong><span style="color: #ff0000;">选课表插入数据：</span></strong>

insert into sc (Sno,Cno,Grade) values (0001,1001,4);
insert into sc (Sno,Cno,Grade) values (0001,1002,3);
insert into sc (Sno,Cno,Grade) values (0001,1003,1);
insert into sc (Sno,Cno,Grade) values (0001,1004,6);
insert into sc (Sno,Cno,Grade) values (0002,1001,3);
insert into sc (Sno,Cno,Grade) values (0002,1002,2);
insert into sc (Sno,Cno,Grade) values (0002,1003,2);
insert into sc (Sno,Cno,Grade) values (0002,1004,8);
insert into sc (Sno,Cno,Grade) values (0003,1001,4);
insert into sc (Sno,Cno,Grade) values (0003,1002,4);
insert into sc (Sno,Cno,Grade) values (0003,1003,2);
insert into sc (Sno,Cno,Grade) values (0003,1004,8);
insert into sc (Sno,Cno,Grade) values (0004,1001,1);
insert into sc (Sno,Cno,Grade) values (0004,1002,1);
insert into sc (Sno,Cno,Grade) values (0004,1003,2);
insert into sc (Sno,Cno,Grade) values (0004,1004,3);
insert into sc (Sno,Cno,Grade) values (0005,1001,5);
insert into sc (Sno,Cno,Grade) values (0005,1002,3);
insert into sc (Sno,Cno,Grade) values (0005,1003,2);
insert into sc (Sno,Cno,Grade) values (0005,1005,9);

&nbsp;

<strong><span style="color: #ff0000;">查询所有学生所选的课程与对应的成绩：</span></strong>

mysql&gt; select student.Sno,student.Sname,student.Sage,course.Cname,sc.Grade from student,course,sc where student.Sno=sc.sno and course.Cno=sc.Cno order by Sno asc;

+-----+--------+------+--------------+-------+
| Sno | Sname  | Sage | Cname        | Grade |
+-----+--------+------+--------------+-------+
|   1 | 小明   |   18 | 云计算       |     4 |
|   1 | 小明   |   18 | python       |     3 |
|   1 | 小明   |   18 | java         |     1 |
|   1 | 小明   |   18 | 网络工程     |     6 |
|   2 | 小红   |   25 | 云计算       |     3 |
|   2 | 小红   |   25 | python       |     2 |
|   2 | 小红   |   25 | java         |     2 |
|   2 | 小红   |   25 | 网络工程     |     8 |
|   3 | 小粉   |   28 | 云计算       |     4 |
|   3 | 小粉   |   28 | python       |     4 |
|   3 | 小粉   |   28 | java         |     2 |
|   3 | 小粉   |   28 | 网络工程     |     8 |
|   4 | 小紫   |   35 | 云计算       |     1 |
|   4 | 小紫   |   35 | python       |     1 |
|   4 | 小紫   |   35 | java         |     2 |
|   4 | 小紫   |   35 | 网络工程     |     3 |
|   5 | 小绿   |   28 | 云计算       |     5 |
|   5 | 小绿   |   28 | python       |     3 |
|   5 | 小绿   |   28 | java         |     2 |
|   5 | 小绿   |   28 | 大保健       |     9 |
+-----+--------+------+--------------+-------+
20 rows in set (0.00 sec)

&nbsp;

<strong><span style="color: #ff0000;">查看所有人的选课情况</span></strong>

mysql&gt; select student.Sno,student.Sname,course.Cname,course.Cno from student,course,sc where student.Sno=sc.Sno and course.Cno=sc.Cno order by Sno;
+-----+--------+--------------+------+
| Sno | Sname  | Cname        | Cno  |
+-----+--------+--------------+------+
|   1 | 小明   | 云计算       | 1001 |
|   1 | 小明   | python       | 1002 |
|   1 | 小明   | java         | 1003 |
|   1 | 小明   | 网络工程     | 1004 |
|   2 | 小红   | 云计算       | 1001 |
|   2 | 小红   | python       | 1002 |
|   2 | 小红   | java         | 1003 |
|   2 | 小红   | 网络工程     | 1004 |
|   3 | 小粉   | 云计算       | 1001 |
|   3 | 小粉   | python       | 1002 |
|   3 | 小粉   | java         | 1003 |
|   3 | 小粉   | 网络工程     | 1004 |
|   4 | 小紫   | 云计算       | 1001 |
|   4 | 小紫   | python       | 1002 |
|   4 | 小紫   | java         | 1003 |
|   4 | 小紫   | 网络工程     | 1004 |
|   5 | 小绿   | 云计算       | 1001 |
|   5 | 小绿   | python       | 1002 |
|   5 | 小绿   | java         | 1003 |
|   5 | 小绿   | 大保健       | 1005 |
+-----+--------+--------------+------+
20 rows in set (0.00 sec)


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/323/  

