# tokudb 表空间回收

<!--more-->
使用这个命令回收表空间，剩余的磁盘空间最好大于等于50%
ALTER table xxxx ENGINE=TokuDB ; 

查看表空间使用情况
```sql
select dictionary_name, bt_size_allocated/1024/1024/1024 as '已分配大小(GB)', bt_size_in_use/1024/1024/1024 AS '已使用大小(GB)' from information_schema.TokuDB_fractal_tree_info order by bt_size_allocated asc;
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2846/  

