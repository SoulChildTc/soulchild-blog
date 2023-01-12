# centos7下访问不到tmp目录下文件的问题

<!--more-->
<div></div>
<div>[root@localhost ]# vim /usr/lib/systemd/system/httpd.service</div>
<div>
<pre class="line-numbers" data-start="1"><code class="language-bash">[Unit]
Description=apache
After=network.target[Service]
Type=forking
ExecStart=/usr/local/apache/bin/apachectl start
ExecReload=/usr/local/apache/bin/apachectl restart
ExecStop=/usr/local/apache/bin/apachectl stop
PrivateTmp=true
[Install]
WantedBy=multi-user.target</code></pre>
&nbsp;

</div>
<div>

============================================================================

如果把PrivateTmp的值设置成true ，服务启动时会在/tmp目录下生成类似systemd-private-433ef27ba3d46d8aac286aeb1390e1b-apache.service-RedVyu的文件夹，用于存放apache的临时文件。
但有时候这相反而不方便，如：启动mysql服务，/tmp/mysql.sock文件的存放就会放到私有文件夹中，这时需要将PrivateTmp的值设置成false：

包括php访问/tmp目录下的文件提示找不到的时候可以修改为false

&nbsp;

<span style="font-size: 14pt;"><strong>结论：</strong></span>

<strong><span style="color: #ff0000;">PrivateTmp=true</span></strong>

</div>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/923/  

