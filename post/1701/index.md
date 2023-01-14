# filebeat+kafka+logstash收集日志到es使用kibana展示

<!--more-->
实现逻辑

filebeat    ==&gt;&gt;    kafka    &lt;&lt;==    logstash    ==&gt;&gt;    elastsearch   &lt;==    kibana

&nbsp;

1. filebeat配置
<pre class="pure-highlightjs"><code class="null">filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/messages
  fields:
    log_topic: test_kafka
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.template.settings:
  index.number_of_shards: 3
output.kafka:
  enable: true
  hosts: ["log1:9092"]
  version: "2.0.0"
  topic: '%{[fields.log_topic]}'
  partition.round_robin:
    reachable_only: true
  worker: 1
  required_acks: 1
  compression: gzip
  compression_level: 4
  max_message_bytes: 10000000
processors:
  - drop_fields:
     fields:
     - beat
     - host
     - input
     - source
     - offset
     - prospector</code></pre>
启动服务

&nbsp;

2. logstash配置：
<pre class="pure-highlightjs"><code class="null">input {
  kafka{
    bootstrap_servers =&gt; "log1:9092"
    topics =&gt; ["test_kafka"]
    codec =&gt; "json"
  }
}

output {
  elasticsearch {
    hosts =&gt; "log1:9200"
    index =&gt; "test_kafka-%{+YYYY.MM.dd}"
  }
}</code></pre>
启动服务
<pre class="pure-highlightjs"><code class="null">nohup ./logstash -f es.conf &amp;</code></pre>
&nbsp;

3.使用kibana验证

可以手动模拟生成日志：
<pre>echo "手动echo测试" &gt;&gt; /var/log/messages</pre>
<img src="images/83f81917c06bb350c01218aa6b363462.png "83f81917c06bb350c01218aa6b363462"" />

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1701/  

