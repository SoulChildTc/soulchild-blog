# nginx中rewrite的使用

<!--more-->
<span style="color: #ff0000;"><strong>标记参数：</strong></span>

last

停止当前这个请求，并根据重写后的规则，重新发起一个请求。

break

停止当前这个请求，在当前字段继续向下执行，但不会匹配其他location。

redirect

临时重定向302

permanent

永久重定向301

&nbsp;

注*

last和break重写后的地址不会显示在浏览器地址栏中

redirect和permanent重写后的地址会显示在浏览器的地址栏中

&nbsp;

<strong><span style="color: #ff0000;">使用格式：</span></strong>rewrite 匹配规则 URI重写后的内容 执行动作(标记);

<span style="color: #ff0000;"><strong>使用字段：</strong></span>server, location, if

&nbsp;

举例:

# 访问soulchild.com时，会自动跳转到www.soulchild.com

server {
listen       80;
server_name  soulchild.com;
rewrite (^.*$) http://www.soulchild.com$1 permanent;
}

server {
listen       80;
server_name  www.soulchild.com;
location / {
root   /app/www;
index  index.html index.htm;
access_log /app/logs/access_www.log main;

&nbsp;

# 当匹配到以html结尾的URI时，进行rewrite，$1为匹配到(.*)的内容。

# 访问soulchild.cn/index.html时，将URI重写为/?p=index，在进行匹配其他location(last的作用)

location ~ html$ {

rewrite /(.*)\.html$ /?p=$1 last;

}

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/243/  

