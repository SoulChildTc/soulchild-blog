# mongodb权限

<!--more-->
1.用户权限说明

A．MongoDB是没有默认管理员账号，所以要先添加管理员账号，再开启权限认证。

B．切换到admin数据库，添加的账号才是管理员账号。

C．用户只能在创建用户对应的数据库中完成认证，包括管理员账号。

D．管理员可以管理所有数据库，但是不能直接管理其他数据库，要先在admin数据库认证后才可以。

2.MongoDB数据库角色

A.数据库用户角色：read、readWrite;

B.数据库管理角色：dbAdmin、dbOwner、userAdmin；

C.集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；

D.备份恢复角色：backup、restore；

E.所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase

F.超级用户角色：root

角色说明：

Read：允许用户读取指定数据库

readWrite：允许用户读写指定数据库

dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile

userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户

clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。

readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限

readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限

userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限

dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。

root：只在admin数据库中可用。超级账号，超级权限

3.添加管理员账号及完成认证

db.createUser({user:’root’,pwd:’zuchezaixian’,roles:[{role:’root’,db:’admin’}]})

注：所有数据库下的用户都在admin的users集合中可以查询到：db.system.users.find()


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1221/  

