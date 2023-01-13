# mongodb常用命令

<!--more-->
创建超级管理员
```sql
db.createUser(
 { 
   user:"root", 
   pwd:"123", 
   roles:[{role:"root",db:"admin"}] 
 } 
)
```

创建普通读写用户
```sql
db.createUser(
 { 
 user:"root", 
 pwd:"123", 
 roles:[{role:"readWrite",db:"app"}] 
 } 
)
```

查看所有用户
```sql
db.system.users.find().pretty()
```
修改用户密码
```
db.updateUser("admin",{pwd:"password"})
```
删除用户
```sql
db.system.users.remove({user:"app1"})
```


创建集合：
```sql
db.createCollection("runoob")
```

创建文档：
```sql
#app为库名
db.app.insert(
   {
    key1: "value1",
    key2: "value2"
   }
)
```
查看集合文档
```sql
db.app.find().pretty()
```

连接信息查询
```sql
db.serverStatus().connections
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1292/  

