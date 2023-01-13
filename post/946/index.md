# apache负载均衡开启状态检测页面

<!--more-->
在配置文件中添加如下内容：

vim /usr/local/apache2/conf/extra/site1.conf
<pre class="line-numbers" data-start="1"><code class="language-bash">&lt;Location "/lbstatus"&gt;
    proxypass !
    SetHandler balancer-manager
    Require ip 10.0.0.0/24
&lt;/Location&gt;</code></pre>
&nbsp;

通过http://ip/lbstatus访问


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/946/  

