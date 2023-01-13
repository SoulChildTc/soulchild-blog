# centos7使用yum安装postgresql9.4

<!--more-->
安装yum源：
```bash
rpm -ivh https://download.postgresql.org/pub/repos/yum/9.4/redhat/rhel-7.6-x86_64/pgdg-centos94-9.4-3.noarch.rpm
```

安装pgsql：
```bash
yum install -y postgresql94-server postgresql94-contrib
```

初始化数据库：
```bash
# 
/usr/pgsql-9.4/bin/postgresql94-setup initdb
```

创建postgres密码
```bash
su – postgres
psql -U postgres
ALTER USER postgres with encrypted password '密码'
```

配置远程访问
```bash
vim /var/lib/pgsql/9.4/data/postgresql.conf
listen_address = "*"

vim /var/lib/pgsql/9.4/data/pg_hba.conf
IPv4 local connections下方添加允许连接的IP
host     all     all     0.0.0.0/0     md5
```

重启服务
```bash
systemctl restart postgresql-9.4.service
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1149/  

