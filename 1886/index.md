# fluentd收集nginx日志并输出到kafka

<!--more-->
[官方文档](https://docs.fluentd.org/filter/record_transformer)
```
<source>
  @type tail
  path /var/log/nginx/access.log
  pos_file /tmp/nginx.log.pos
  tag nginx.access
  <parse **>
    @type nginx
    expression /^(?<remote>[^ ]*) (?<host>[^ ]*) (?<user>[^ ]*) \[(?<time>[^\]]*)\] "(?<method>\S+)(?: +(?<path>[^\"]*?)(?: +\S*)?)?" (?<code>[^ ]*) (?<size>[^ ]*)(?: "(?<referer>[^\"]*)" "(?<agent>[^\"]*)"(?:\s+(?<http_x_forwarded_for>[^ ]+))?)?$/
  </parse>
</source>

<filter nginx.**>
  @type record_transformer
  <record>
    name "soulchild"
  </record>
</filter>

<match nginx.**>
  @type kafka2
  brokers  10.0.0.190:9092,10.0.0.191:9092,10.0.0.192:9092
  topic_key nginx_tag
  default_topic  nginx.access
  <buffer>
    flush_interval  5s
  </buffer>
  <format>
    @type json
  </format>
</match>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1886/  

