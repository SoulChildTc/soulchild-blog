# 跨域问题导致资源不能访问：No 'Access-Control-Allow-Origin' header is present on the requested resource.

<!--more-->
No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'xxxxx' is therefore not allowed access.

<strong><span style="color: #ff0000;">不同web应用可参考如下内容：</span></strong>

apache:https://enable-cors.org/server_apache.html

nginx:https://enable-cors.org/server_nginx.html

&nbsp;

<strong><span style="color: #ff0000;">修改apache配置文件</span></strong>

&lt;Directory "xxxx"&gt;在此行下面添加如下内容

Header set Access-Control-Allow-Origin "*"

or

<span style="white-space: normal;">Header set Access-Control-Allow-Origin "http://www.soulchild.cn"</span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/377/  

