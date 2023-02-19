# centos7-mysql5.7.20免安装版配置初始化

<!--more-->

下载地址：https://cdn.mysql.com/archives/mysql-5.7/mysql-5.7.20-linux-glibc2.12-x86_64.tar

### 解压
```bash
tar xf mysql-5.7.20-linux-glibc2.12-x86_64.tar
```

### 删除无用压缩包
```bash
rm -rf mysql-5.7.20-linux-glibc2.12-x86_64.tar
rm -rf mysql-test-5.7.20-linux-glibc2.12-x86_64.tar.gz
```

### 解压mysql
```bash
tar zxvf mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz
```

### 创建安装目录
```bash
mkdir -p /server/tools/
```

### 将解压的mysql移动到安装目录
```bash
mv mysql-5.7.20-linux-glibc2.12-x86_64 /server/tools/mysql
```

### 配置环境变量
```bash
echo 'export PATH=/server/tools/mysql/bin:$PATH' >> /etc/profile
source /etc/profile
```

### 创建mysql用户
```bash
useradd mysql -M -s /sbin/nologin
```

### 创建mysql数据存放目录
```bash
mkdir -p /data/mysql
```

### 设置目录权限
```bash
chown -R mysql.mysql /server/tools/mysql
chown -R mysql.mysql /data/mysql
```

### 安装依赖包
```bash
yum install -y libaio-devel
```

### 删除mariadb
```bash
yum remove mariadb-libs
```

### 初始化数据
```bash
# 5.7以上版本
mysqld --initialize-insecure --user=mysql --basedir=/server/tools/mysql --datadir=/data/mysql

# 5.7以下版本
# /server/tools/mysql/scripts/mysql_install_db --user=mysql --basedir=/server/tools/mysql --datadir=/data/mysql
```


参数说明：

`--initialize`：开启安全策略

`--initialize-insecure`：关闭安全策略

 安全策略：

 1.密码长度:12位以上

 2.密码复杂度

 3.密码默认过期时间180天

 4.初始化后会生成一个临时密码

`--user`：指定mysql用户

`--basedir`：mysql安装目录

`--datadir`：数据存放目录


### 创建修改my.cnf配置文件

```ini
[root@db01 ~]# cat /etc/my.cnf 

[mysqld]
basedir=/application/mysql
datadir=/data/mysql
socket=/tmp/mysql.sock
pid-file=mysqld.pid
server_id=1
port=3306
log-bin=/data/mysql-bin
relay-log = /data/mysql-relay-bin
replicate-wild-ignore-table=mysql.%
replicate-wild-ignore-table=information_schema.%
gtid-mode=on
enforce-gtid-consistency=true


[mysql]
socket=/tmp/mysql.sock
prompt=mysql-[\\d]>


[mysqld_safe]
log-error=/var/log/mysql.log
```


### 添加启动脚本
centos6
```bash
cp /server/tools/mysql/support-files/mysql.server /etc/init.d/mysqld

service mysqld start
```
 
centos7
```bash
vi /etc/systemd/system/mysqld.service

[Unit]
Description=MySQL Server
Documentation=man:mysqld(8)
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target

[Install]
WantedBy=multi-user.target
[Service]
User=mysql
Group=mysql
ExecStart=/server/tools/mysql/bin/mysqld --defaults-file=/etc/my.cnf
LimitNOFILE = 5000 
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/266/  

