# nginx-proxy_redirect

<!--more-->
当nginx代理的后端服务器有301、302重定向时,我们可以通过proxy_redirect来重写Location请求头。


例如:

```nginx
   location /test/  {
     proxy_pass    http://127.0.0.1:8000;
   }
```
上面的配置中
访问`xxx.com/test/`,会被反向代理到后端的`http://127.0.0.1:8000/test/`



由于`http://127.0.0.1:8000/test/`这个地址会重定向到`http://127.0.0.1:8000/index/`

此时浏览器会跳转到`http://127.0.0.1:8000/index/`，127.0.0.1的地址肯定不是我们希望返回的结果。


在上面的配置中做一些修改：

```nginx
   location /test/  {
     proxy_pass    http://127.0.0.1:8000;
     proxy_redirect    ~^http://127.0.0.1/(.*)  $1;
   }
```

现在的返回结果就是`xxx.com/test/index`




一些其他的url转换：
```nginx
   location /test/  {
     proxy_pass    http://127.0.0.1:8000;
     proxy_redirect    ~^http://127.0.0.1/(.*)  $1;
   } # http://127.0.0.1:8000/index/  ==> http://xxx.com/test/index/


   location /test/  {
     proxy_pass    http://127.0.0.1:8000;
     proxy_redirect    ~^http://127.0.0.1/(.*)  aaa/$1;
   } # http://127.0.0.1:8000/index/  ==> http://xxx.com/test/aaa/index/


   location /test/  {
     proxy_pass    http://127.0.0.1:8000;
     proxy_redirect    ~^http://127.0.0.1/(.*)  /aaa/$1;
   } # http://127.0.0.1:8000/index/  ==> http://xxx.com/aaa/index/


   location /test/  {
     proxy_pass    http://127.0.0.1:8000;
     proxy_redirect    ~^http://127.0.0.1/(.*)  $schema://$host/$1;
   } # http://127.0.0.1:8000/index/  ==> http://xxx.com/index/


   location /test/  {
     proxy_pass    http://127.0.0.1:8000;
     proxy_redirect    ~^http://127.0.0.1/(.*)  http://soulchild.cn/$1;
   } # http://127.0.0.1:8000/index/  ==> http://soulchild.cn/index/

```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2066/  

