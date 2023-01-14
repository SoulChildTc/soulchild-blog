# zabbix之使用grafana展示图形

<!--more-->
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">下载安装：</span></strong></span></h3>
<pre class="pure-highlightjs"><code class="bash">wget https://dl.grafana.com/oss/release/grafana-6.2.2-1.x86_64.rpm 
yum localinstall grafana-6.2.2-1.x86_64.rpm 
systemctl start grafana-server</code></pre>
&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">打开web：</span></strong></span></h3>
http://10.0.0.62:3000/

默认用户名密码：admin

首次登陆需要修改
<h3><span style="color: #ff0000; font-size: 12pt;"><strong>安装zabbix插件：</strong></span></h3>
安装插件更多内容可参考官方文档：

https://grafana.com/docs/plugins/installation/

安装：
<pre class="pure-highlightjs"><code class="bash">grafana-cli plugins install alexanderzobnin-zabbix-app
service grafana-server restart</code></pre>
启用插件：进入之后点击enable

<img src="images/916b8643b2c523b0e34705eb3b894055.png "916b8643b2c523b0e34705eb3b894055"" />

&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">添加数据源：</span></strong></span></h3>
点击add后选择zabbix

<img src="images/21a6319ed250be29281cc0f1e44924ee.png "21a6319ed250be29281cc0f1e44924ee"" />

&nbsp;

http://10.0.0.62/zabbix/api_jsonrpc.php

填写完成后，点击Save &amp; Test

<img src="images/6205656dced0c6865795c617a0298724.png "6205656dced0c6865795c617a0298724"" />

&nbsp;

保存后，点击Dashboards，导入图形模板

&nbsp;

<img src="images/f77cb519326831ea85f8f0cdd544798a.png "f77cb519326831ea85f8f0cdd544798a"" />

&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">展示图形：</span></strong></span></h3>
<img src="images/8c1506377fe1ee7c8e158dd17ca49984.png "8c1506377fe1ee7c8e158dd17ca49984"" />

&nbsp;

展示后，可以选择相应的服务器进行查看

<img src="images/8a6340b1f3713d9ac349b8c3b69356ac.png "8a6340b1f3713d9ac349b8c3b69356ac"" />

<img src="images/4bc3e768bed39332b3f0b37b103e4319.png "4bc3e768bed39332b3f0b37b103e4319"" />

&nbsp;

更深入请参考其他文章：

https://www.cnblogs.com/kevingrace/p/7108060.html


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/442/  

