# ELK-filebeat配置output(七)

<!--more-->
filebeat支持的output有很多种,这里介绍三种配置。`es`,`logstash`,`kafka`。
- Elasticsearch
- Logstash
- Kafka
- Redis
- File
- Console
- Cloud


### 一、Elasticsearch
示例
```
output.elasticsearch:
  hosts: ["https://localhost:9200"]
  index: "filebeat-%{[beat.version]}-%{+yyyy.MM.dd}"
  ssl.certificate_authorities: ["/etc/pki/root/ca.pem"]
  ssl.certificate: "/etc/pki/client/cert.pem"
  ssl.key: "/etc/pki/client/cert.key"
```
> 使用`%{[]}`可以引用事件中的属性。

配置参数
- enable: 是否启用这个output配置
- hosts: 指定es主机列表。eg:`hosts: ["10.45.3.2:9220", "10.45.3.1:9230"]`
- compression_level: gzip压缩级别。默认为0禁用压缩。压缩级别必须在1（最佳速度）到9（最佳压缩）的范围内。增加压缩级别会减少网络使用，但会增加cpu使用。
- escape_html: 是否将字符串中的html转义，默认true。
- worker: 为每个es节点的开启的工作线程数量
- username: 用户名
- password: 密码
- parameters: http url参数字典
- protocol: http或https协议
- path: es的url访问路径。
- headers: 自定义请求头
- index: 索引名称。默认是`filebeat-%{[beat.version]}-%{+yyyy.MM.dd}`,如果要修改索引名必须配置下面的选项。
setup.template.name 和 setup.template.pattern
```
output.elasticsearch:
  hosts: ["es01:9200", "es02:9200", "es03:9200"]
  index: soulchild-%{+yyyy.MM.dd}

setup.template.name: "soulchild"
setup.template.pattern: "soulchild-*"
```

- indices: 这个参数可以根据一些条件，来写入不同的索引
  - index: 索引名称
  - mappings: 这里是一个字典，会与index的值做匹配，匹配的值就是最后的索引名
  - default: 默认值
  - when: 条件
下面举一些例子：
eg1:
```
output.elasticsearch:
  hosts: ["http://localhost:9200"]
  indices:
    - index: "warning-%{[beat.version]}-%{+yyyy.MM.dd}"
      when.contains:  # 如果一个事件中的message字段包含"WARN" ，索引名称就是"warning-%{[beat.version]}-%{+yyyy.MM.dd}"
        message: "WARN"
    - index: "error-%{[beat.version]}-%{+yyyy.MM.dd}"
      when.contains: # 如果一个事件中的message字段包含"ERR" ，索引名称就是"error-%{[beat.version]}-%
        message: "ERR"
```
eg2:
```
output.elasticsearch:
  hosts: ["http://localhost:9200"]
  indices:
    - index: "%{[fields.log_type]}" # 如果事件中"fields.log_type"字段的值是critical，那么索引就是sev1，如果是normal那么索引名就是sev2，没有匹配的项索引名就是sev3
      mappings:
        critical: "sev1"
        normal: "sev2"
      default: "sev3"
```

- bulk_max_size: 单个es处理的最大事件数。默认值为50
- backoff.init: 连接es失败时，等待多少秒进行第一次重连。每重连一次按照指数的方式增加尝试连接的时间间隔，直到backoff.max秒
- backoff.max: 网络错误后，在尝试连接到es之前等待的最大秒数。缺省值为60秒。
- timeout: http请求的超时时间
- ssl: ssl相关配置.https://www.elastic.co/guide/en/beats/filebeat/6.8/configuration-ssl.html
```
output.elasticsearch.hosts: ["https://192.168.1.42:9200"]
output.elasticsearch.ssl.certificate_authorities: ["/etc/pki/root/ca.pem"]
output.elasticsearch.ssl.certificate: "/etc/pki/client/cert.pem"
output.elasticsearch.ssl.key: "/etc/pki/client/cert.key"
```

### 二、Logstash
示例
```
output.logstash:
  hosts: ["127.0.0.1:5044"]
```
**每个事件都包含如下字段**
```
{
    ...
    "@metadata": { 
      "beat": "filebeat", 
      "version": "6.8.14" 
      "type": "doc" 
    }
}
```

配置参数
- enabled: 是否启用配置
- hosts: 指定logstash主机列表。禁用负载均衡后，如果配置了多台主机，则随机选择一台主机(无优先级)。如果一个主机变得不可达，另一个主机被随机选择。
- compression_level: gzip压缩级别。默认为0禁用压缩。压缩级别必须在1（最佳速度）到9（最佳压缩）的范围内。增加压缩级别会减少网络使用，但会增加cpu使用。
- escape_html: 是否将字符串中的html转义，默认true。
- worker: 为每个logstash节点开启的工作线程数量。
- loadbalance: 是否启用负载均衡
- ttl: 与logstash建立连接的存活时间
- bulk_max_size: 单个logstash处理的最大事件数。默认值为50
- backoff.init: 连接logstash失败时,等待多少秒进行第一次重连。每重连一次按照指数的方式增加尝试连接的时间间隔，直到backoff.max秒
- backoff.max: 网络错误后，在尝试连接到logstash之前等待的最大秒数。缺省值为60秒。


### 三、Kafka
示例
```
output.kafka:
  hosts: ["kafka1:9092", "kafka2:9092", "kafka3:9092"]

  # 指定主题
  topic: '%{[fields.log_topic]}'
  partition.round_robin:
    reachable_only: false

  required_acks: 1
  compression: gzip
  max_message_bytes: 1000000
```

这个output适用于0.11到2.0.0之间的所有Kafka版本。旧版本也可以工作，但不在维护。

配置参数
- enable: 是否启用配置
- hosts: kafka broker节点地址列表
- version: kafka的版本号。0.8.2.0 ~ 2.0.0。默认1.0.0
- worker: 为每个kafka节点开启的工作线程数量。
- username: kafka用户名
- password: kafka密码
- topic: 指定主题
- topics: 这个和上面es中的indices类似
  - topic: 主题名称
  - mappings: 这里是一个字典，会与topic的值做匹配，匹配的值就是最后的索引名
  - default: 默认值
  - when: 条件
- key: 事件的key，用于计算hash值
- partition: 指定输出kafka分区策略，三个选项random,round_robin,hash. 默认hash
  - random.group_events: 向一个分区写入事件的数量，达到数量后会随机选择一个新分区。默认值是1，即在每个事件之后随机选择一个新分区。
  - round_robin.group_events: 向一个分区写入事件的数量，达到数量后会选择下一个分区。默认值是1，即在每个事件之后选择下一个分区。
  - hash.hash: 用于计算分区hash值的属性列表，没有定义则使用`key`设置的值
  - hash.random: 如果无法计算hash或key，则随机分发事件。
  - random|round_robin|hash.reachable_only: 默认情况下，所有分区策略将尝试向所有分区发布事件。如果filebeat无法访问分区的leader，output可能会阻塞。如果reachable_only设置为true，事件将只发布到可用分区。

- codec: 输出编码格式，默认json
- metadata: Kafka元数据更新相关设置。metadata信息brokers, topics, partition, 和活动的leaders等信息
  - refresh_frequency: 元数据刷新间隔。默认为10分钟。
  - retry.max: 集群在leader选举时重试读取元数据次数。缺省值是3。
  - retry.backoff: 重试时间间隔。
- bulk_max_size: 单个kafka处理的最大事件数。默认值为50
- timeout: 等待kafka brokers的响应时间。默认30s
- broker_timeout: 
- channel_buffer_size: 每个Kafka broker输出管道中缓冲的消息数。缺省值是256。
- keep_alive: 连接的存活时间，默认为0，禁用保持活动连接状态
- compression: 压缩类型，none、snappy、lz4、gzip。默认gzip
- compression_level: gzip压缩级别。设置为0禁用压缩。压缩级别必须在1（最佳速度）到9（最佳压缩）的范围内。增加压缩级别会减少网络使用，但会增加cpu使用。默认4
- max_message_bytes: JSON消息的最大允许大小。超出的消息将被删除。缺省值是1000000(字节)。此值应小于kafka配置中broker的`message.max.bytes`参数
- required_acks: kafka的响应返回值，0位无等待响应返回，继续发送下一条消息；1表示等待本地提交（leader broker已经成功写入，但follower未写入），-1表示等待所有副本的提交，默认为1
- ssl: ssl相关配置.https://www.elastic.co/guide/en/beats/filebeat/6.8/configuration-ssl.html






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2269/  

