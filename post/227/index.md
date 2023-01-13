# nginx日志格式说明

<!--more-->
官方文档：http://nginx.org/en/docs/http/ngx_http_log_module.html

&nbsp;

<span style="color: #e53333; font-size: 14px;"><strong>定义格式：</strong></span>

#log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '

#       '$status $body_bytes_sent "$http_referer" '
#       '"$http_user_agent" "$http_x_forwarded_for"';

#access_log  logs/access.log  main;

######################################################

<span style="color: #e53333; font-size: 14px;"><strong>log_format  main</strong></span><span style="font-size: 14px; color: #e53333;"><strong>：</strong></span>

main的名字可以自定义，可以在http字段中使用

&nbsp;

$remote_addr：客户端ip地址

$remote_user：远程用户，默认为空

$time_local：当前时间

$request：请求起始行

$status：状态码

$body_bytes_sent：返回给客户端的内容大小(字节)

$http_referer：请求来源地址(即从哪个页面跳转过来的)

$http_user_agent：用户使用的客户端

$http_x_forwarded_for：记录用户真实ip，使用负载均衡时会用到

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;">access_log  logs/access.log  main gzip buffer=32k flush=5s;</span></strong>

main:使用指定的日志格式

logs/access.log：日志保存的路径

gzip:保存为压缩包(可使用zcat,zless,zgrep查看)

buffer:先存在内存中，达到32k时再写到日志文件中

flush:每5秒更新一次日志（写入）

&nbsp;

可以在http, server, location, if in location, limit_except字段中使用

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/227/  

