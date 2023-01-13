# fluentd安装入门(一)

<!--more-->
1.安装
<pre class="pure-highlightjs"><code class="null">curl -L https://toolbelt.treasuredata.com/sh/install-redhat-td-agent3.sh | sh</code></pre>
&nbsp;

2.启动
<pre class="pure-highlightjs"><code class="null">systemctl start td-agent.service</code></pre>
&nbsp;

3.默认的配置文件中配置了http接收方式，监听得是8888端口，这里测试一条日志

debug.test：这个是tag，配置文件中的match来匹配这个tag，没有匹配到就不会输出日志

{"json":"message"}：这个是模拟的日志内容
<pre class="pure-highlightjs"><code class="null">curl -X POST -d 'json={"json":"message"}' http://localhost:8888/debug.test
tail /var/log/td-agent/td-agent.log</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1709/  

