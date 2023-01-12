# mysql-update修改

<!--more-->
语法：update 表名 set 字段=新值 where 条件;(<span style="background-color: #e53333; color: #000000;">不写条件则更改所有内容，所以条件一定要确认好</span>)

将表中id为3的记录name字段改为ritian

mysql&gt;update test set name='ritian' where id=3;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/325/  

