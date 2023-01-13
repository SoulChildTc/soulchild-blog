# mysql-select查询(1)

<!--more-->
<h2><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">简单查询</span></strong></span></h2>
语法：select 字段,字段 from 表名;

mysql&gt;select id,name from test;

&nbsp;
<h2><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">条件查询</span></strong></span></h2>
查看前2行的数据

mysql&gt;select id,name from test limit 2;

&nbsp;

查看第1条到第3条数据(第一条是0，所以是0,3)

<span style="white-space: normal;">mysql&gt;select id,name from test limit 0,3;</span>

&nbsp;

按照指定内容查询(字符串内容需要加引号)

mysql&gt;select id,name from test where name='soulchild';

&nbsp;

多个条件查询(<span style="white-space: normal;">and、</span><span style="white-space: normal;">or、&gt;、&lt;、=)</span>

mysql&gt; select id,name from test where name='soulchild' and id=1;

&nbsp;

查询结果根据id列排序

<span style="white-space: normal;">asc：升序(默认)</span>

<span style="white-space: normal;">desc：降序</span>

mysql&gt; select id,name from test order by id desc;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/319/  

