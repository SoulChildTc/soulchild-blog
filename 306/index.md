# mysql-添加删除索引

<!--more-->
<span style="color: #ff0000;"><strong>1.</strong><strong>添加</strong><strong>PRIMARY KEY（主键索引）</strong></span>

语法：ALTER TABLE `表名` ADD PRIMARY KEY ( `列名称` )
<span style="white-space: normal;">mysql&gt;</span>ALTER TABLE `table_name` ADD PRIMARY KEY ( `column_name` )

<span style="white-space: normal; color: #ff0000;"><strong>添加自增属性的主键索引：</strong></span>

<span style="white-space: normal;">语法：alter table 表名 change 列名称 新的列名称 类型 primary key auto_increment;</span>

mysql&gt;<span style="white-space: normal;">alter table student change id id int primary key auto_increment;</span>

删除：

alter table student modify id int;(有自增时,需要先取消自增)

alter table `table_name` drop primary key;

&nbsp;

<span style="color: #ff0000;"><strong>2.添加UNIQUE(唯一索引)</strong></span>
方法1：

语法：ALTER TABLE `表名` ADD UNIQUE ( `列名称`)
mysql&gt;ALTER TABLE `table_name` ADD UNIQUE ( `column_name`)
<p style="white-space: normal;">方法2：</p>
<p style="white-space: normal;"><span style="white-space: normal;">语法：</span><span style="white-space: normal;">create unique index 索引名 on 表名(列名);</span></p>
mysql&gt;create unique index uni_ind_name on student(name);

&nbsp;

<span style="color: #ff0000;"><strong>3.添加INDEX(普通索引)</strong></span>
语法：ALTER TABLE `表名` ADD INDEX index_name ( `列名称` )
mysql&gt;ALTER TABLE `table_name` ADD INDEX index_name ( `column_name` )

&nbsp;

<span style="color: #ff0000;"><strong>4.添加FULLTEXT(全文索引)</strong></span>
语法：ALTER TABLE `表名` ADD FULLTEXT ( `列名称`)
mysql&gt;ALTER TABLE `table_name` ADD FULLTEXT ( `column_name`)

&nbsp;

<span style="color: #ff0000;"><strong>5.添加多列索引</strong></span>

方法1：
语法：ALTER TABLE `表名` ADD INDEX index_name ( `列名称`, `列名称`, `列名称` )
mysql&gt;ALTER TABLE `table_name` ADD INDEX index_name ( `column1_name`, `column2_name`, `column3_name` )

方法2：

<span style="white-space: normal;">语法：</span><span style="white-space: normal;">create index `索引名` on 表名称(</span><span style="white-space: normal;">列名称,列名称</span><span style="white-space: normal;">)</span>

mysql&gt;create index ind_name_dept on student(name,dept);

&nbsp;

<span style="color: #ff0000;"><strong>6.字段对应内容的前N个字符创建普通索引</strong></span>

<span style="white-space: normal;">语法：create index `索引名称` on `表名称` ( `列名称`(`N`))</span>

<span style="white-space: normal;">mysql&gt;</span>create index index_name on table_name(<span style="white-space: normal;">column_name</span>(8));

<span style="color: #ff0000;"><strong>删除索引：</strong></span>

<span style="white-space: normal;">方法1：</span>

<span style="white-space: normal;">语法：</span>drop index `索引名称` on `表名`;

<span style="white-space: normal;">mysql&gt;</span><span style="white-space: normal;">drop index ind_name_dept on student;</span>

<span style="white-space: normal;">方法2：</span>

<span style="white-space: normal;">语法：alter table 表名 drop index 索引名;
</span>

<span style="white-space: normal;">mysql&gt;alter table student drop index index_name;</span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/306/  

