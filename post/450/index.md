# nginx配置https(SSL)访问

<!--more-->
1.申请证书

略

2.下载上传证书

<code class="null">1_www.domain.com_bundle.crt;</code>

<code class="null">2_www.domain.com.key;</code>

将这两个文件上传到服务器nginx/conf/ssl目录中

&nbsp;

3.nginx配置

server字段中配置https
<pre class="pure-highlightjs"><code class="nginx">listen 443;
server_name www.domain.com;  ##
ssl on;
root /var/www/www.domain.com; ##
index index.php index.html index.htm; 
ssl_certificate  ssl/1_www.domain.com_bundle.crt; ## 
ssl_certificate_key ssl/2_www.domain.com.key;   ##
ssl_session_timeout 5m;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;</code></pre>
&nbsp;

配置80跳转443
<pre class="line-numbers" data-start="1"><code class="language-bash">server {
listen 80;
server_name www.domain.com; #填写绑定证书的域名
rewrite ^(.*)$ https://$host$1 permanent; #把http的域名请求转成https
}</code></pre>
&nbsp;

配置完后，重启服务即可。

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/450/  

