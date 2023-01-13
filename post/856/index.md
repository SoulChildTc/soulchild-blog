# nginx负载均衡proxy_next_upstream

<!--more-->
官方文档：

http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream

&nbsp;

作用：

当后端服务器返回指定的错误时，将请求传递到其他服务器。

<code>error</code>与服务器建立连接，向其传递请求或读取响应头时发生错误;

<code>timeout</code>在与服务器建立连接，向其传递请求或读取响应头时发生超时;

<code>invalid_header</code>服务器返回空的或无效的响应;

<code>http_500</code>服务器返回代码为500的响应;

<code>http_502</code>服务器返回代码为502的响应;

<code>http_503</code>服务器返回代码为503的响应;

<code>http_504</code>服务器返回代码504的响应;

<code>http_403</code>服务器返回代码为403的响应;

<code>http_404</code>服务器返回代码为404的响应;

<code>http_429</code>服务器返回代码为429的响应;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/856/  

