# mysql ERROR 1129 (HY000): Host 'xxxx' is blocked because of many connect

<!--more-->
参考链接：http://blog.itpub.net/21374452/viewspace-2155266/

&nbsp;

解决方法：

1、提高允许的max_connection_errors数量：
<pre class="line-numbers" data-start="1"><code class="language-bash">进入Mysql数据库查看max_connection_errors：
show variables like '%max_connect_errors%'; 

修改max_connection_errors的数量为1000：
set global max_connect_errors = 1000; 

查看是否修改成功：
show variables like '%max_connect_errors%'; </code></pre>
&nbsp;

2、刷新hosts
<pre class="line-numbers" data-start="1"><code class="language-bash"> mysqladmin -uxxx -pxxx flush-hosts 

也可以使用socket方式：
mysqladmin -uxxx -pxxx --socket=/tmp/mysql.sock flush-hosts</code></pre>
&nbsp;

默认情况下，my.cnf文件中可能没有此行，如果需要设置此数值，手动添加即可。
<pre class="line-numbers" data-start="1"><code class="language-bash">vi /etc/my.cnf
max_connect_errors = 1000</code></pre>
配置说明：
当此值设置为10时，意味着如果某一客户端尝试连接此MySQL服务器，但是失败（如密码错误等等）10次，则MySQL会无条件强制阻止此客户端连接。

如果希望重置此计数器的值，则必须重启MySQL服务器或者执行 mysql&gt; flush hosts; 命令。
当这一客户端成功连接一次MySQL服务器后，针对此客户端的max_connect_errors会清零。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1144/  

