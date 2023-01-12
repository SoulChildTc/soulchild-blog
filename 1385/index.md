# pgsql 设置监听地址提供外部访问

<!--more-->
认证方式说明：

https://www.postgresql.org/docs/9.4/auth-methods.html

&nbsp;

修改：

vim /data/postgresql/pg_hba.conf

# IPv4 local connections:
host all all 0.0.0.0/0 md5

&nbsp;

vim /data/postgresql/postgresql.conf

listen_addresses = '*'

&nbsp;

重启服务：

pg_ctl stop -D /data/postgresql/ -s -m fast

pg_ctl start -D /data/postgresql/ -s -w -t 300

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1385/  

