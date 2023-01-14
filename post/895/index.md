# apache动态添加SSL编译模块，报错解决

<!--more-->
<span style="color: #ff0000; font-size: 14pt;"><strong>添加ssl模块举例</strong></span>

apxs参数说明：

-i 安装

-a 激活模块(向httpd.conf添加 LoadModule指令)

-c 编译指定模块

&nbsp;
<pre class="line-numbers" data-start="1"><code class="language-bash">#进入源码包目录
cd /server/httpd-2.4.39/

#安装模块
/usr/local/apache2/bin/apxs -i -a -c modules/ssl/mod_ssl.c
</code></pre>
报错：

<img src="images/eee3ed7c430ed3d9e935c8e8cc998b96.png "eee3ed7c430ed3d9e935c8e8cc998b96"" />

&nbsp;

解决：
<pre class="line-numbers" data-start="1"><code class="language-bash">#安装openssl
yum install -y openssl openssl-devel

#再次执行
/usr/local/apache2/bin/apxs -i -a -c modules/ssl/mod_ssl.c
</code></pre>
&nbsp;

报错：

<img src="images/85f9f8ac7dccffa30f228cdf51e527fd.png "85f9f8ac7dccffa30f228cdf51e527fd"" />

&nbsp;

google到的一个解决方法：
<pre class="line-numbers" data-start="1"><code class="language-bash">#把apache源码包里的modules/md文件夹中的所有文件复制到/usr/inlude文件夹下面
cp modules/md/* /usr/include/

#执行
cd /server/httpd-2.4.39/
/usr/local/apache2/bin/apxs -a -i -DHAVE_OPENSSL=1 -I/usr/include/openssl -L/usr/lib64/openssl -c modules/ssl/*.c -lcrypto -lssl -ldl

#检查配置文件
apachectl -t
#重启apache 
aapachectl graceful
</code></pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/895/  

