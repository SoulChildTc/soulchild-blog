# ELK-logstash配置管道input(三)

<!--more-->
所有input插件均支持的参数
- add_field: 在事件中添加属性。格式`{"name" => "zhangsan" "age" => "11"}`
- codec: 指定编解码器，默认plain
- enable_metric: 是否启用指标日志，默认true
- id: 配置插件ID。如果没有指定ID, Logstash将生成一个。强烈建议在您的配置中设置此ID。当你有两个或两个以上相同类型的插件时，这是特别有用的。例如，如果你有两个kafka input配置。在这种情况下，添加ID将有助于在使用monitoring APIs时 监控Logstash。
- tags: 添加标签。格式`["test", "ok"]`
- type: 向事件中添加type字段，值是string

这里介绍两种input类型的插件，分别是kafka和redis

### 1. kafka
使用kafka作为input，需要安装kafka插件```bin/logstash-plugin install logstash-input-kafka```。

kafka可以插件从Kafka topic中读取事件。

#### 配置参数
- bootstrap_servers: kafka实例的地址列表
- topics: topic列表。默认["logstash"]
- topics_pattern: 使用正则表达式匹配topic
- connections_max_idle_ms: 在指定的毫秒数之后关闭空闲连接。
- consumer_threads: 线程数量，最好与kafka分片数量想同
- decorate_events: 是否在事件中添加kafka元数据。可以提供给过滤器使用。元数据包括topic、consumer_group、partition、offset、key
- 其他参数: https://www.elastic.co/guide/en/logstash/6.8/plugins-inputs-kafka.html#plugins-inputs-kafka-options

配置示例:
```bash
input {
  kafka {
    add_field => { "service" => "gateway" "env" => "test" }
    tags => ["test","ok"]
    bootstrap_servers => ["localhost:9092"]
    topics => ["soulchild-test"]
    codec => json
    consumer_threads => 2
  }
}


output {
  elasticsearch {
    hosts => ["http://es-01:9200", "http://es-02:9200", "http://es-03:9200"]
    index => "kafka-test-%{+YYYY.MM.dd}"
  }
}
```


### 2.redis
使用redis作为input，需要安装redis插件`bin/logstash-plugin install logstash-input-redis`

配置参数
- batch_count: EVAL命令返回的事件数,默认125，每次从redis获取125个事件
- data_type: list,channel,pattern_channel
- db: redis db编号
- host: redis连接主机
- path: redis socket路径
- key: redis订阅通道名称或者list的key名称
- password: redis密码
- port: redis端口号
- ssl: 启用ssl
- threads: 线程数，默认1
- timeout: 初始连接超时(秒)
- command_map: 如果redis命令被重命名，这里可以配置redis原始命令的映射，例如：
```bash
command_map => {
  "lpush" => "newlpush"
}
```

配置示例:
```bash
input {
  redis {
    data_type => "list"
    db => 0
    host => "1.1.1.1"
    key => "test-log"
  }

}


output {
  elasticsearch {
    hosts => ["http://es-01:9200", "http://es-02:9200", "http://es-03:9200"]
    index => "redis-test-%{+YYYY.MM.dd}"
  }
}
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2288/  

