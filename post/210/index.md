# centos7-nginx1.14.2编译安装

<!--more-->
## 下载地址：http://nginx.org/download/nginx-1.14.2.tar.gz

## 安装开发依赖环境：

```yum install -y pcre-devel openssl-devel```

## 创建nginx运行用户：

```useradd -g nginx -s /sbin/nologin -M www```

## 编译安装nginx：

```
mkdir -p /server/tools

cd /server/tools

wget -P ./ http://nginx.org/download/nginx-1.14.2.tar.gz

tar zxvf nginx-1.14.2.tar.gz

cd nginx-1.14.2/
./configure --prefix=/application/nginx-1.14.2   --user=www --group=www  --with-http_stub_status_module  --with-http_ssl_module
```

### 参数说明：

--prefix=/application/nginx-1.14.2   #指定安装位置

--user=www #指定运行用户

--group=www  #指定运行用户组

--with-http_stub_status_module  #安装状态模块

--with-http_ssl_module #安装ssl模块，实现https

## 编译&安装

```make && make install```


## 创建软连接，方便以后使用

```
ln -s /application/nginx-1.14.2 /application/nginx

ln -s /application/nginx/sbin/nginx /sbin/nginx
```


## 启动服务
```
nginx
```
### 常用命令说明：
nginx -s stop  #停止服务
nginx -s reload #平滑重启服务
nginx -t  #检查配置文件

## 简化配置文件

```
cd /application/nginx/conf/
egrep -v '^$|#' nginx.conf.default > nginx.conf
```

## 配置logrotate：
vim /etc/logrotate.d/nginx
```
/application/nginx-1.14.2/logs/*log {
    create 0664 www root
    daily
    rotate 10
    dateext
    missingok
    notifempty
    compress
    sharedscripts
    postrotate
        /bin/kill -USR1 `cat /application/nginx/logs/nginx.pid 2>/dev/null` 2>/dev/null || true
    endscript
}
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/210/  

