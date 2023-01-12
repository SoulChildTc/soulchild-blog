# cacti-Incorrect file format 'syslog' ... LOCK TABLES

<!--more-->
备份数据库时报错：Incorrect file format 'syslog' when using LOCK TABLES

查看syslog.MYI文件大小为0，判断是索引损坏

&nbsp;

进入mysql执行：

REPAIR TABLE cacti.syslog USE_FRM;

&nbsp;

<span style="white-space: normal;">syslog_incoming表也有问题</span>

<span style="white-space: normal;">Incorrect file format 'syslog_incoming' when using LOCK TABLES</span>

&nbsp;

继续执行：

REPAIR TABLE cacti.syslog_incoming USE_FRM;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/352/  

