# logstash6.8.9安装和常用插件说明

<!--more-->
安装：
<pre class="pure-highlightjs"><code class="null">wget https://artifacts.elastic.co/downloads/logstash/logstash-6.8.9.tar.gz
tar xf logstash-6.8.9.tar.gz
mv logstash-6.8.9 /usr/local/logstash</code></pre>
&nbsp;

常用的input插件：

官方链接：https://www.elastic.co/guide/en/logstash/6.8/input-plugins.html

file：读取一个文件，类似tail命令一行一行实时读取。

syslog：监听系统514端口的syslog messages。

redis：从redis读取数据。

kafka：从kafka中消费数据，一般用于数据量较大的业务场景。

filebeat：从filebeat中接收数据

&nbsp;

常用的filter插件：

grok：grok 是 logstash 最重要的插件,可以解析并结构化任意数据。支持正则，并提供了很多内置的规则和模板。

mutate：基础类型数据处理，包括类型转换、字符串处理、字段处理

date：转换日志中的时间格式

GeoIP：识别IP地址的地域信息、经纬度等。

&nbsp;

常用的output插件：

elasticsearch：输出到es中

file：输出到问价中

redis：输出到redis中

kafka：输出到kafka中

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1689/  

