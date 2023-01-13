# kibana安装配置

<!--more-->
下载安装：
<pre class="pure-highlightjs"><code class="null">wget https://artifacts.elastic.co/downloads/kibana/kibana-6.8.9-linux-x86_64.tar.gz
tar xf kibana-6.8.9-linux-x86_64.tar.gz
mv kibana-6.8.9-linux-x86_64 /usr/local/kibana
cd /usr/local/kibana/</code></pre>
修改配置：

vim config/kibana.yml
<pre class="pure-highlightjs"><code class="null">server.port: 5601
server.host: "0.0.0.0"
elasticsearch.hosts: ["http://localhost:9200"]
kibana.index: ".kibana"
</code></pre>
&nbsp;

启动服务：
<pre class="pure-highlightjs"><code class="null">nohup bin/kibana &amp;</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1703/  

