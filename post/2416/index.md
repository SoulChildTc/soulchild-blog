# docker快速运行mysql5.7.20

<!--more-->
懒病:
```bash
docker run -d -p3306:3306 --name mysqld -e MYSQL_ROOT_PASSWORD=123456 -v /mysql-server/mysql-data/:/var/lib/mysql -v /mysql-server/mysql-conf/:/etc/mysql/conf.d  mysql:5.7.20
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2416/  

