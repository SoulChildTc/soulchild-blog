# nginx配置文件说明

<!--more-->
[root@web01 nginx]# egrep -v '^$|#' conf/nginx.conf.default
worker_processes  1;    # 工作进程数量(建议设置与cpu核心数一致)
events {
worker_connections  1024;    # 每个工作进程支持最大连接数
}
http {
include       mime.types;    # nginx支持的媒体类型
default_type  application/octet-stream;    # 默认的媒体类型
sendfile        on;    # 开启高效传输模式
keepalive_timeout  65; # 存活超时时间(一次连接保留65秒)
server {
listen       80;    # 监听端口
server_name  localhost;    # 绑定的域名
location / {    # 默认location规则
root   html;    # 默认站点目录
index  index.html index.htm;    # 默认主页文件
}
error_page   500 502 503 504  /50x.html;    # 遇到这些状态码都会跳转50x.html
location = /50x.html {    # URI的内容是/50x.html
root   html; # 在此目录找50x.html
}
}
}


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/212/  

