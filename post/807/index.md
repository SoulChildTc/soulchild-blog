# nginx虚拟机主机配置

<!--more-->
<pre class="pure-highlightjs"><code class="nginx">server {
    access_log logs/blog_access.log main;
    location / {
        root /var/www/blog;
        index index.php index.html index.htm;
    }
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root html;
    }

    location ~ \.php$ {
        root /var/www/blog;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
 }

}</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/807/  

