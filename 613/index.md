# dcoker 手动制作kodexplorer镜像

<!--more-->
1.首先选择底层镜像centos6.9
<pre>docker pull centos:6.9</pre>
2.运行容器
<pre>docker run -it -p80:80 --name kodexplorer centos:6.9</pre>
3.进入容器系统后的操作
<pre>#安装lnmp
curl -o /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-6.repo
curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
yum install nginx php-fpm php-gd php-mbstring wget unzip -y
cd /usr/share/nginx/html
rm -f /usr/share/nginx/html/*
wget http://static.kodcloud.com/update/download/kodexplorer4.40.zip
rm -f kodexplorer4.40.zip

#修改nginx配置文件，可参考下面的配置
vi /etc/nginx/conf.d/default.conf

#修改权限
chmod -R 777 /usr/share/nginx/html/

#创建服务启动脚本
mkdir /server/
vim /server/init.sh
setenforce 0
service php-fpm start
nginx -g 'daemon off;'

#删除无用软件,缩减镜像大小
yum remove unzip wget -y
yum clean all</pre>
退出容器。

&nbsp;

nginx配置文件：
<pre class="pure-highlightjs"><code class="nginx">server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  _;
    root         /usr/share/nginx/html;
    index        index.php

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    location / {
    }

    location ~ \.php$ {
           root           html;
           fastcgi_pass   127.0.0.1:9000;
           fastcgi_index  index.php;
           fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
           include        fastcgi_params;
       }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }

}</code></pre>
&nbsp;

4.提交镜像

指定容器ID或名字：kodexplorer

给生成的镜像名字打标签：kodexplorer:v1
<pre>docker commit kodexplorer kodexplorer:v1</pre>
&nbsp;

5.测试
<pre>docker run -d -p80:80 kodexplorer:v1 sh /server/init.sh</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/613/  

