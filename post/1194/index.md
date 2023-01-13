# nginx配置pathinfo，解决thinkphp404问题

<!--more-->
参考地址：https://www.cnblogs.com/hfdp/p/5867844.html

&nbsp;

请求的网址是http://xxx.com/index.php/admin/bbb/ccc/index

PATH_INFO的值是/admin/bbb/ccc/index

SCRIPT_FILENAME的值是$doucment_root/index.php

SCRIPT_NAME /index.php

&nbsp;

所以<code class="null">php(.*)$</code>中$1的值就是PATH_INFO

配置pathinfo
<pre class="line-numbers" data-start="1"><code class="language-bash">    # 正则匹配.php后的pathinfo部分
    location ~ \.php(.*)$ {
        root /xxx;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $DOCUMENT_ROOT$fastcgi_script_name;

        # 把pathinfo部分赋给PATH_INFO变量
        fastcgi_param PATH_INFO $1;
        include fastcgi_params;
    }</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1194/  

