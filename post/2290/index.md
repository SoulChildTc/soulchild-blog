# ELK-logstash配置文件(二)

<!--more-->
### logstash.yml
logstash全局属性、启动、执行相关配置
- node.name: 节点的描述名称，默认是主机名
- path.data: Logstash插件及用于持久化的目录,默认`LOGSTASH_HOME/data`
- pipeline.id: pipeline的id，默认main
- pipeline.java_execution: 使用java执行引擎，默认false
- path.logs: 日志存放路径，默认LOGSTASH_HOME/logs
- log.level: 日志级别，fatal，error，warn，info，debug，trace，默认info
- config.debug: 是否为调试模式，默认false
- path.config: logstash管道配置文件路径
- pipeline.workers: 执行管道的过滤器和输出阶段的工作线程数量。默认CPU核心数
- pipeline.batch.size: 一个工作线程可以执行的最大事件数
其他参数: https://www.elastic.co/guide/en/logstash/6.8/logstash-settings-file.html


### pipelines.yml
在单个Logstash实例中运行多个管道的相关配置.
例如下面的配置定义了管道id，这个管道使用的队列类型，这个管道从哪里读取配置文件
```
- pipeline.id: another_test
  queue.type: persisted
  path.config: "/tmp/logstash/*.config"
```

### jvm.options
配置logstash的jvm参数



### log4j2.properties
log4j2的相关配置



### startup.options (Linux)
修改此配置，在使用bin/system-install，可以使二进制安装的logstash，也支持systemd管理
例如:
`./system-install  /usr/local/logstash-6.8.9/config/startup.options systemd`










---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2290/  

