# pg_xlog过大清理

<!--more-->
### 介绍
pg_xlog
这个日志是记录的Postgresql的WAL信息，也就是一些事务日志信息(transaction log)，默认单个大小是16M，源码安装的时候可以更改其大小。这些信息通常名字是类似'000000010000000000000013'这样的文件，这些日志会在定时回滚恢复(PITR)，流复制(Replication Stream)以及归档时能被用到，这些日志是非常重要的，记录着数据库发生的各种事务信息，不得随意删除或者移动这类日志文件，不然你的数据库会有无法恢复的风险

当你的归档或者流复制发生异常的时候，事务日志会不断地生成，有可能会造成你的磁盘空间被塞满，最终导致DB挂掉或者起不来。遇到这种情况不用慌，可以先关闭归档或者流复制功能，备份pg_xlog日志到其他地方，但请不要删除。然后删除较早时间的的pg_xlog，有一定空间后再试着启动Postgres。


checkpoint(参考)
https://www.phpyuan.com/article/128760.html
http://blog.itpub.net/29990276/viewspace-2654054/
清理日志(参考)
https://blog.csdn.net/dazuiba008/article/details/100659749


### 清理步骤
```bash
echo 'checkpoint' | psql -Upostgres

pg_controldata /data/postgresql
# 主要看下面这两个值
Latest checkpoint location:           1C81/69444018
Prior checkpoint location:            1C81/69443F58
Latest checkpoint's REDO location:    1C81/69443FC8
Latest checkpoint's REDO WAL file:    0000000500001C8100000069

# 清理0000000500001C8100000069之后的日志文件
pg_archivecleanup /data/postgresql/pg_xlog/ 0000000500001C8100000069
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2802/  

