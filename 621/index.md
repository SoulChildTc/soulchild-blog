# 使用dockerfile制作镜像

<!--more-->
工作目录：/opt/dockerfile/centos6.9_kod/

基于centos6.9制作一个kodexplorer的镜像

&nbsp;

1.创建编辑dockerfile文件
<pre>#新版本的dockerfile文件名首字母不区分大小写，老版本中文件名必须是Dockerfile
vim /opt/dockerfile/centos6.9_kod/dockerfile</pre>
dockerfile内容如下：
<pre class="line-numbers" data-start="1"><code class="language-bash">FROM centos:6.9
RUN curl -o /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-6.repo &amp;&amp; \
    curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo &amp;&amp; \
    yum install nginx php-fpm php-gd php-mbstring unzip -y
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /data
ADD kodexplorer4.40.zip /data/
RUN unzip kodexplorer4.40.zip &amp;&amp; \
 chmod -R 777 /data/
EXPOSE 80
COPY init.sh /init.sh
CMD ["/bin/sh","/init.sh"]</code></pre>
&nbsp;

init.sh：用于启动服务使用
<pre class="line-numbers" data-start="1"><code class="language-bash">#!/bin/bash
service php-fpm start
nginx -g "daemon off;"</code></pre>
&nbsp;

nginx.conf：简单修改一下php部分
<pre class="pure-highlightjs"><code class="nginx">worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   /data;
            index  index.php index.html index.htm;
        }
        location ~ \.php$ {
            root           /data;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  /data$fastcgi_script_name;
            include        fastcgi_params;
        }
    }
}</code></pre>
&nbsp;

构建镜像：

-t：打一个标签

.：当前目录--&gt;/opt/dockerfile/centos6.9_kod/
<pre>docker build -t kod:v1 .</pre>
&nbsp;

创建并运行容器：
<pre>docker -d -p80:80 kod:v1</pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/621/  

