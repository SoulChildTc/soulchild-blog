# nginx负载均衡的五种算法

<!--more-->
参考：https://blog.csdn.net/chenyulancn/article/details/70800991

&nbsp;

1.轮询（默认），每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某台服务器死机，故障系统被自动剔除，使用户访问不受影响。

2.Weight，指定轮询权值，Weight值越大，分配到的访问机率越高，主要用于后端每个服务器性能不均的情况下。

举例：
<pre class="line-numbers" data-start="1"><code class="language-bash">upstream bakend {    
server 192.168.0.14 weight=10;    
server 192.168.0.15 weight=10;    
}</code></pre>
3.ip_hash，每个请求按访问IP的hash结果分配，这样来自同一个IP的访客固定访问一个后端服务器，有效解决了动态网页存在的session共享问题。

举例：
<pre class="line-numbers" data-start="1"><code class="language-bash">upstream bakend {  
ip_hash;  
server 192.168.0.14:88;  
server 192.168.0.15:80;  
} 
</code></pre>
&nbsp;

4.fair（第三方）

比上面两个更加智能的负载均衡算法。根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx本身是不支持fair的，如果需要使用这种调度算法，必须下载Nginx的upstream_fair模块。

举例：
<pre class="line-numbers" data-start="1"><code class="language-bash">upstream backend {    
server server1;    
server server2;    
fair;    
} </code></pre>
&nbsp;

&nbsp;

5.url_hash（第三方）
按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx本身是不支持url_hash的，如果需要使用这种调度算法，必须安装Nginx 的hash软件包。

举例：
<pre class="line-numbers" data-start="1"><code class="language-bash">upstream backend {    
server squid1:3128;    
server squid2:3128;    
hash $request_uri;    
hash_method crc32;    
} </code></pre>
&nbsp;

<span style="color: #ff0000;"><strong>upstream区块特殊指令和用法：</strong></span>

upstream：定义集群信息

server：定义集群节点（可以使用以下参数）

max_fails：连接失败，重试次数（默认1）

fail_timeout：重新检查间隔时间(默认10s),失败指定次数(max_fails)后,间隔(fail_timeout)时间后,重试1次，失败则结束.(成功后下次检测还是3次机会)

backup：热备，所有节点不能访问时，使用backup

weight：设置轮询权重(分配比例)

ip_hash：同一个用户访问，分配到同一台服务器，可以解决session问题

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/850/  

