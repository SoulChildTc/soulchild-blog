# nginx常用内置变量

<!--more-->
&nbsp;
<pre class="pure-highlightjs"><code class="nginx">$args    #URL中的参数

$document_root    #当前请求的root指令指定的值(站点目录)

$uri    #表示不带请求参数的当前URI，$uri不包含主机名。

$document_uri    #此变量与$uri含义一样。

$host    #此变量与请求头部中“Host”行指定的值一致。

$limit_rate    #此变量用来设置限制连接的速率。

$request_method    #此变量等同于request的method，通常是“GET”或“POST”。

$remote_addr    #此变量表示客户端IP地址。

$remote_port    #此变量表示客户端端口。

$remote_user    #此变量等同于用户名，由ngx_http_auth_basic_module认证。

$request_filename    #此变量表示当前请求的文件的路径名，由root或alias和URI request组合而成。

$request_uri    #此变量表示含有参数的完整的初始URI。

$query_string    #此变量与$args含义一致。

$server_addr    #表示请求的服务器地址。

$server_name    #服务器的主机名

$server_port    #服务器的端口号

$request_uri     #包含请求参数的原始URI，不包含主机名，由客户端请求决定，不能修改。</code></pre>
&nbsp;

以http://10.0.0.20:8080/abc?test=123&amp;test2=abc 为例子:

其中：

$args：test=123&amp;test2=abc

$uri： /abc

$server_addr：10.0.0.20

$server_port：8080

$request_filename：abc

$request_uri：/abc?test=123&amp;test2=abc

&nbsp;

例2：http://xxx.com:88/test1/test2/test.php ，假定虚拟主机根目录为/var/www/html

其中：

$host：xxx.com

$server_port：88

$request_uri： /test1/test2/test.php

$document_uri：/test1/test2/test.php

$document_root：/var/www/html

$request_filename：/var/www/html/test1/test2/test.php

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/829/  

