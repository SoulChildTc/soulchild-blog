# mysqldump备份数据库

<!--more-->
1.参数

<span style="color: #ff0000;">-A 全部备份</span>

mysqldump -uroot -p -A &gt; /data/backup/full.sql

&nbsp;

<span style="color: #ff0000;">-B 备份单库或多库</span>

<span style="white-space: normal;">mysqldump -uroot -p -S /data/3306/mysql.sock -B soulchild &gt; /data/backup/soulchild.sql</span>

or

<span style="white-space: normal;">mysqldump -uroot -p -B wordpress emlog &gt; /data/backup/wpaeml.sql</span>

&nbsp;

<span style="color: #ff0000;">单表或多表备份</span>
<p style="padding-left: 150px;">  库名         表名</p>
<span style="white-space: normal;">mysqldump -uroot -p wordpress user  &gt; /data/backup/full.sql</span>

&nbsp;

<span style="color: #ff0000;">-d 只备份表的结构</span>

mysqldump -uroot -p -d wordpress &gt; /data/backup/wp.sql

&nbsp;

&nbsp;

&nbsp;

mysqldump特殊功能参数

-R --triggers -E ：备份过程、函数、触发器、事件等

--master-data=2:

--single-transaction

--set-gtid-purged=OFF

&nbsp;

较为完整全备份语句：

mysqldump -uroot -p123 -A --master-data=2 --single-transaction -R --triggers -E --set-gtid-purged=OFF --max-allowed-packet=64M &gt;/data/backup/full.sql


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/334/  

