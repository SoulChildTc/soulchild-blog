# Mysql8 readonly不生效


<!--more-->

在 MySQL8 中，通过设置 read_only 参数可以实现只读模式。当该参数设置为1时，MySQL 实例变为只读模式，禁止对数据进行修改，只允许执行 SELECT 和 SHOW 语句。但是，如果用户拥有 CONNECTION_ADMIN 权限，则仍然可以连接到实例并执行写操作。

可以通过以下方法来解决

```sql
revoke CONNECTION_ADMIN on *.* from xxx;
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/mysql8-readonly%E4%B8%8D%E7%94%9F%E6%95%88/  

