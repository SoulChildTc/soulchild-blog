# nginx实现负载均衡

<!--more-->
<span style="color: #e53333;"><strong><span style="color: #e53333;">web02配置（我的测试环境web01和web03也是一样的配置）</span></strong></span>

[root@web02 conf.d]# cat /etc/nginx/conf.d/{bbs,www}.conf

server {
listen       80;
server_name  bbs.soulchild.cn;
location / {
root   /html/bbs;
index  index.html;
}
}
server {
listen       80;
server_name  www.soulchild.cn;
location / {
root   /html/www;
index  index.html;
}

}

&nbsp;

[root@web02 conf.d]# cat /html/{bbs,www}/index.html
web02-10.0.0.8-bbs
web02-10.0.0.8-www

&nbsp;

<span style="color: #e53333;"><strong><span style="color: #e53333;">负载均衡lb01配置</span></strong></span>

[root@lb01 ~]# cat /etc/nginx/conf.d/lb.conf

server {

listen       80;

server_name  localhost;

location / {

root   /usr/share/nginx/html;

index  index.html index.htm;

<span style="color: #e53333;">       proxy_pass http://soulchild;</span>

<span style="color: #e53333;">        proxy_set_header host $host;</span>

<span style="color: #e53333;">        proxy_set_header X-Real-IP  $remote_addr;</span>

<span style="color: #e53333;">       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span>

}

}

<span style="color: #e53333;">upstream soulchild {</span>

<span style="color: #e53333;">    server 10.0.0.7:80 backup;</span>

<span style="color: #e53333;">    server 10.0.0.8:80 weight=7 max_fail</span><span style="color: #e53333;">s=3 fail_timeout=20s;</span>

<span style="color: #e53333;">    server 10.0.0.9:80 weight=3 max_fails=3 fail_timeout=20s;</span>

<span style="color: #e53333;">}</span>

&nbsp;

<hr />

<span style="color: #e53333; font-size: 14px;"><strong>upstream区块特殊指令和用法：</strong></span>

upstream：定义集群信息

server：定义集群节点（可以使用以下参数）

max_fails：连接失败，重试次数（默认1）

fail_timeout：重新检查间隔时间(默认10s),失败指定次数(max_fails)后,间隔(fail_timeout)时间后,重试1次，失败则结束.(成功后下次检测还是3次机会)

backup：热备，所有节点不能访问时，使用backup

weight：设置轮询权重(分配比例)

ip_hash：同一个用户访问，分配到同一台服务器，可以解决session问题

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/245/  

