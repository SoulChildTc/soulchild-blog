# apache配置文件常用配置项说明

<!--more-->
## httpd.conf文件
<pre>ServerRoot "/usr/local/apache2"

指定apache的安装目录</pre>
&nbsp;
<pre>Listen 80

设置apache的监听端口</pre>
&nbsp;
<pre>LoadModule access_module modules/mod_access.so
LoadModule auth_module modules/mod_auth.so
LoadModule jk_module modules/mod_jk.so

动态加载模块，在安装apache的时候指定了动态加载，因此就可以将需要的模块放到了modules目录下，然后在这里指定加载即可。</pre>
&nbsp;
<pre>User daemon
Group daemon

设定执行httpd的用户和组</pre>
&nbsp;
<pre>ServerName www.example.com:80

用于绑定域名使用</pre>
&nbsp;
<pre>&lt;Directory /&gt;
    AllowOverride none
    Require all denied
&lt;/Directory&gt;

Directory一般用于对指定目录进行权限控制
AllowOverride 决定是否读取目录中的.htaccess文件
    All：表示可以读取.htaccess文件的内容，修改原来的访问权限。
    None：表示不读取.htaccess文件，权限由httpd.conf统一控制。

Require all denied：表示禁止所有请求访问资源，此配置表示禁止访问web服务器的任何目录
Require all granted：表示允许所有请求访问资源。Require是apache2.4版本的一个新特性
Require ip IP地址：允许某个IP访问
Require not ip IP地址：拒绝某个IP访问
Require host 主机名：允许某个主机访问
Require not host 主机名：拒绝某个主机访问</pre>
&nbsp;
<pre>DocumentRoot "/usr/local/apache2/htdocs"

设置站点目录位置</pre>
&nbsp;
<pre>&lt;Directory "/usr/local/apache2/htdocs"&gt;
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
&lt;/Directory&gt;

Options  表示在这个目录内能够执行的操作，主要有4个可设定的值：
  Indexes：此参数表示如果在DocumentRoot指定目录下找不到索引文件时，就将此目录下所有文件列出来。
  FollowSymLinks：表示在DocumentRoot指定目录下允许符号链接到其它目录。
  ExecCGI：表示允许在DocumentRoot指定的目录下执行cgi操作。
</pre>
&nbsp;

## httpd-default.conf

Timeout 300

Timeout用来定义客户端和服务器端程序连接的超时间隔，单位为秒，超过这个时间间隔，服务器将断开与客户端的连接。

&nbsp;

KeepAlive On

KeepAlive用来定义是否允许用户建立永久连接，On为允许建立永久连接，Off表示拒绝用户建立永久连接，建议此选项设置为On

&nbsp;

MaxKeepAliveRequests 100

MaxKeepAliveRequests用来定义一个tcp连接可以进行HTTP请求的最大次数，设置为0代表不限制请求次数，这个选项与上面的KeepAlive相互关联，当KeepAlive设定为On，这个设置开始起作用。

&nbsp;

KeepAliveTimeout 15

KeepAliveTimeout用来限定一次连接中最后一次请求完成后的等待时间，如果超过了这个等待时间，服务器就断开连接。

&nbsp;

ServerTokens Prod

ServerTokens可以用来禁止显示或发送Apache版本号，默认情况下，服务器HTTP响应头会包含apache和php版本号。

假定apache版本为Apache/2.4.29，PHP版本为PHP/7.1.14，那么ServerTokens可选的的赋值还有如下几个：

ServerTokens Prod 会显示“Server: Apache”

ServerTokens Major 会显示 “Server: Apache/2″

ServerTokens Minor 会显示“Server: Apache/2.4″

ServerTokens Min 会显示“Server: Apache/2.4.29″

ServerTokens OS 会显示 “Server: Apache/2.4.29 (Unix)”

ServerTokens Full 会显示 “Server: Apache/2.4.29 (Unix) OpenSSL/1.0.1e-fips PHP/7.1.14″

&nbsp;

ServerSignature Off
如果将此值设置为On的话，那么当打开某个不存在或者受限制的页面时，会在页面的右下角显示正在使用的apache的版本号，这也是非常危险的，因此建议设置为Off关闭版本信息显示。

&nbsp;

HostnameLookups Off
表示以DNS来查询客户端地址，默认情况下是Off关闭状态，务必保持该设置，打开的话非常消耗系统资源。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/800/  

