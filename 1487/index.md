# Postgres设置用户角色权限

<!--more-->
1.使用管理员连接pgsql
```
# 赋予所有表的所有权限给指定用户
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "用户名"; 

# 赋予指定表的所有权限给指定用户
GRANT ALL PRIVILEGES ON "表名" TO "用户名";

#修改库的所有者
alter database 库名 owner to 用户名;
#授予用户库权限
grant ALL ON DATABASE 库名 TO 用户名;
#授予用户指定的库权限
grant select on all tables in schema public to 用户名;     // 在那个db执行就授哪个db的权限

#修改表的所有者
alter table 表名 owner to 用户名;
#授予用户表权限
GRANT ALL ON 表名 TO 用户名;

#修改sequence所有者
alter sequence 序列名 owner to 用户名;
#修改sequence权限
GRANT ALL ON 序列名 TO 用户名;



# 只给指定的表只读权限
GRANT Usage ON SCHEMA "schema1" TO "user1";
GRANT Usage ON SCHEMA "schema2" TO "user1";
GRANT Select ON TABLE my_db.schema1.table1 TO "user1"
GRANT Select ON TABLE my_db.schema2.table1 TO "user1"
GRANT Select ON TABLE my_db.schema2.table2 TO "user1"
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1487/  

