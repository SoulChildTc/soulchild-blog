# mysql-增删改表的字段

<!--more-->
<strong><span style="color: #ff0000;">在表中增加字段(在最后添加字段)</span></strong>

语法：alter table `表名` add `字段名` <span style="white-space: normal;">字段</span>类型；

mysql&gt; alter table test add sex char(4);

&nbsp;

<strong><span style="color: #ff0000;">在指定位置增加字段</span></strong>

<span style="white-space: normal;">after：在xx字段之后添加字段</span>

<span style="white-space: normal;">first： 在最前面添加字段</span>

<span style="white-space: normal;">语法：alter table `表名` add `要添加的字段名` 字段类型 after`字段名`；</span>

mysql&gt; alter table test add age int(3) after name;

mysql&gt; alter table test add qq int(10) first;

&nbsp;

<strong><span style="color: #ff0000;">调整字段顺序</span></strong>

语法:alter table `表名` modify `要修改的字段名称` 字段类型 after 字段名;

mysql&gt; alter table test modify sex_new char(4) after name;

&nbsp;

<strong><span style="color: #ff0000;">删除指定字段</span></strong>

<span style="white-space: normal;">语法：alter table `表名` drop `字段名`;</span>

mysql&gt; alter table test drop qq;

&nbsp;

<strong><span style="color: #ff0000;">修改字段类型</span></strong>

<span style="white-space: normal;">语法：alter table `表名` modify 字段类型;</span>

mysql&gt; alter table test modify age int(4);

&nbsp;

<strong><span style="color: #ff0000;">修改字段名称</span></strong>

语法：alter table `表名` change `旧名称` `新名称` 字段类型;

mysql&gt; alter table test change sex sex_new char(4);

&nbsp;

<strong><span style="color: #ff0000;">添加表注释</span></strong>

<span style="white-space: normal;">语法：</span>alter table `表名` comment '注释';

mysql&gt; alter table test comment '测试表';

&nbsp;

<strong><span style="white-space: normal; color: #ff0000;">添加字段注释</span></strong>

方法1：

语法：alter table `表名` modify `字段名` 字段类型 comment `注释`;

mysql&gt; alter table test modify name char(20) comment '名字';

<span style="white-space: normal;">方法2：</span>

<span style="white-space: normal;">语法：</span>alter table `表名` change `字段名` <span style="white-space: normal;">`字段名` </span>字段类型 comment '注释';
<p style="white-space: normal;">mysql&gt; alter table test change name name char(20) comment '姓名';</p>
&nbsp;

<strong><span style="color: #ff0000;">查看字段注释</span></strong>

语法：<span style="white-space: normal;">show full fields from 表名;</span>

mysql&gt; show full fields from student;

&nbsp;

<strong><span style="color: #ff0000;">添加自增属性的主键索引：</span></strong>

语法：alter table 表名 change 列名称 新的列名称 <span style="white-space: normal;">字段</span>类型 primary key auto_increment;

mysql&gt;alter table student change id id int primary key auto_increment;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/343/  

