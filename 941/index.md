# apache配置反向代理和负载均衡

<!--more-->
&nbsp;

开启反向代理模块：
<pre class="line-numbers" data-start="1"><code class="language-bash">LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule slotmem_shm_module modules/mod_slotmem_shm.so</code></pre>
开启负载均衡模块：
<pre class="line-numbers" data-start="1"><code class="language-bash">LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule lbmethod_bytraffic_module modules/mod_lbmethod_bytraffic.so
LoadModule lbmethod_bybusyness_module modules/mod_lbmethod_bybusyness.so</code></pre>
<h1></h1>
<h1>反向代理</h1>
&nbsp;

<span style="font-size: 14pt;"><b>1.</b><b>ProxyPass</b><b>指令</b></span>

在反向代理到后端的url后，path是不会带过去的。此指令不支持正则。

可以使用在server config ，location，virtualhost中使用

用法：
<pre>ProxyPass [path]  ! | url</pre>
&nbsp;

<span style="font-size: 14pt;"><strong>2.ProxyPassReverse指令</strong></span>

此指令一般和ProxyPass指令配合使用。

通过此指令，可以避免  在Apache作为反向 代理使用时，后端服务器的HTTP重定向造成绕过反向代理的问题。

用法：
<pre>ProxyPassReverse [path]  ! | url</pre>
&nbsp;

<span style="font-size: 14pt;"><strong>3.ProxyPassMatch指令</strong></span>

用法同ProxyPass，此指令支持正则
<pre>ProxyPass [path]  ! | url</pre>
&nbsp;

例子：

全站代理：
<pre>ProxyPass "/" "http://www.test.com"
ProxyPassReverse "/" "http://www.test.com"</pre>
要为特定的URI进行代理，其它的所有请求都在本地处理，可执行如下配置：
<pre>ProxyPass "/images"  "http://www.test.com"</pre>
当客户端请求http://www.soulchild.cn/images/server.gif 这个URL时，apache将请求后端服务器http://www.test.com/server.gif 地址，注意，这里在反向代理到后端的url后，/images这个路径没有带过去。

<strong><span style="color: #ff0000;">注意：如果第一个参数path结尾添加了一个斜杠，则url部分也必须添加了一个斜杠</span></strong>

加斜杠
<pre>ProxyPass "/img/flv/"  "http://www.abc.com/isg/"</pre>
&nbsp;

对某个路径不做代理转发：
<pre>ProxyPass / images/ !</pre>
&nbsp;

使用正则：
<pre>ProxyPassMatch  ^(/.*.gif)  http://www.static.com/$1</pre>
<h1></h1>
<h1>负载均衡：</h1>
&nbsp;

3种负载均衡算法，分别是：

byrequests：默认。按照请求次数平均分配

可以手动指定权重，权重越大访问越多：loadfactor=xx

&nbsp;

bytraffic：按照I/O流量大小平均分配

bybusyness：按照挂起的请求(排队暂未处理)数量计算。分配给活跃请求数最少的服务器

&nbsp;

编辑配置文件

vim /usr/local/apache2/conf/extra/site1.conf
<pre class="line-numbers" data-start="1"><code class="language-bash">&lt;VirtualHost *:80&gt;
    ServerAdmin webmaster@dummy-host2.example.com
    DocumentRoot "/usr/local/apache2/docs/site1"
    ServerName apache.test.com
    ErrorLog "logs/apache.test.com-error_log"
    CustomLog "logs/apache.test.com-access_log" common

    &lt;Proxy balancer://soulchild&gt;
        BalancerMember http://10.0.0.239  loadfactor=2  
        BalancerMember http://10.0.0.140:81
        ProxySet lbmethod=byrequests
    &lt;/Proxy&gt;
    
    proxypass / balancer://soulchild
    proxypassreverse / balancer://soulchild
&lt;/VirtualHost&gt;</code></pre>
loadfactor=2可以实现，访问2次10.0.0.239，访问1次10.0.0.140按照这样的顺序访问

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/941/  

