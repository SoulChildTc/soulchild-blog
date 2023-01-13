# mysql修改密码和设置密码永不过期

<!--more-->
进入mysql命令行执行：

#改密码

SET PASSWORD = PASSWORD('12345');

#设置密码永不过期

ALTER USER 'root'@'localhost' PASSWORD EXPIRE NEVER;

#刷新权限表

flush privileges;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1045/  

