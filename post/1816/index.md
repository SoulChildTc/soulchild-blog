# pgsql自增序列-主键冲突问题

<!--more-->
```sql
SELECT setval('t_app_app_id_seq',MAX(id),true) FROM 表名；

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1816/  

