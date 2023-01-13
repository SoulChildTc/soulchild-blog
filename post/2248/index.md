# ELK-filebeat配置input(三)  

<!--more-->
input即配置从哪里获取日志

## 一、input配置格式
```
filebeat.inputs:
- type: log
  paths:
    - /var/log/system.log
    - /var/log/wifi.log
- type: log
  paths:
    - "/var/log/apache2/*"
  fields:
    apache: true
  fields_under_root: true

```
> 可以同时配置多个input类型，方便学习可以在配置文件中添加`logging.level: debug`

一个事件的json数据
```
{
  "@timestamp": "2021-03-17T11:53:54.324Z",
  "@metadata": {
    "beat": "filebeat",
    "type": "doc",
    "version": "6.8.5"
  },
  "tags": [
    "test",
    "ok"
  ],
  "prospector": {
    "type": "log"
  },
  "input": {
    "type": "log"
  },
  "source": "/var/log/test.log",
  "offset": 555,
  "log": {
    "file": {
      "path": "/var/log/test.log"
    }
  },
  "message": "{\"a\": \"2021-03-17 19:53:52\", \"a1\": \"aaaaa\"}",
  "host": {
    "name": "soulchild-temp"
  },
  "beat": {
    "name": "soulchild-temp",
    "hostname": "soulchild-temp",
    "version": "6.8.5"
  }
}
```


## 二、input类型可以是如下内容
- Log
- Stdin
- Redis
- UDP
- Docker
- TCP
- Syslog
- NetFlow

## 三、不同input类型的配置
#### 公共选项
所有input均支持以下配置选项。

- enable: 启用或禁用一个input。true or false
- tags:  Filebeat包含在每个已发布事件的标签字段中的标签列表。使用tag可以轻松地在Kibana中选择特定事件或在Logstash中应用条件过滤。这些tag会被附加到tags字段中
- fields: 自定义字段,配置如下
```
fields:
  app_id: 1
  app_name: "test"
```
- fields_under_root: 如果为true，自定义字段将会被放置顶层。默认是在fields下
- processors: 定义处理器，以便在事件发送到output之前对其进行处理
- pipeline: 管道由多个处理器和一个队列组成。为该input事件生成管道ID

### 1. log
#### 1.1 配置示例
```
filebeat.inputs:
- type: log 
  paths:
    - /var/log/system.log
    - /var/log/wifi.log
- type: log 
  paths:
    - "/var/log/nginx/*.log"
  fields:
    nginx: true
  fields_under_root: true
```
#### 1.2 配置选项
- paths: 数组类型。配置日志文件路径。可以使用`/log/*.log`,`/log/*/*.log`
- recursive_glob.enabled: 默认启用。支持路径深度扩展写法。比如`/log/**/*.log`，可以代表`/log/*/*.log`,`/log/*/*/*.log`,`/log/*/*/*/*.log`,`/log/*/*/*/*/*.log`...最多能代表8级。

- encoding: 日志文件编码格式。plain, latin1, utf-8, big5, gbk等等
- exclude_lines: 排除日志文件中的某些行。支持正则。
```
filebeat.inputs:
- type: log
  ...
  exclude_lines: ['^DBG', '^INFO']
```
<br>

- include_lines: 只保留日志中的某些行。支持正则，写法同上。include比exclude先执行。
- tail_files: 如果此选项设置为true，Filebeat将在每个文件的末尾而不是开头开始读取新文件。如果将此选项与日志轮换结合使用，则可能会跳过新文件中的第一个日志条目。默认设置为false. 
  - 此选项适用于Filebeat尚未处理过的文件。如果您以前运行了Filebeat，并且文件的状态已经持久化，那么将不适用tail_files。harvester将在最后记录的偏移处继续进行。要将tail_files应用于所有文件，必须停止Filebeat并删除注册表文件。请注意，这样做会删除所有以前的状态。注册表文件路径：/var/lib/filebeat/registry

<br>

- harvester_buffer_size: 每个harvester读取文件时，使用的缓冲区大小。默认是16384(字节)。
- max_bytes: 一条日志的最大字节数。大于此大小的日志会被丢弃。此设置对于多行日志很有用，因为多行日志可能会变大。默认值是10MB(10485760)。
- json: 将日志的每一行作为json来解析。json解码发生在过滤行和多行配置之间，下面是配置示例
```
# 默认情况下，解码后的json对象会放在json字段下,比如日志是{"log": "test"}字段，在kibana中呈现的就是json.log字段，如果启用此设置将会吧json对象放置顶层，呈现为log字段。默认为false。
json.keys_under_root: true

# 如果keys_under_root被启用，那么在key冲突的情况下，解码后的JSON对象将覆盖Filebeat正常的字段。脏数据可能会导致(Cannot index event publisher.Event报错)
json.overwrite_keys: true

# 如果启用此设置将会添加一个字段"error.message"用来描述json解析出错的信息。还会添加另一对KV："error.type: json"，代表错误类型是json
json.add_error_key: true

# message_key：可选配置，指定要应用 行筛选和多行设置的JSON key。如果指定了该key，则该key必须位于JSON对象的顶级，并且与该key关联的值必须是字符串，否则不会进行筛选或多行聚合。
json.message_key: log 

# 可选配置，如果为false会在filebeat日志中打印出json解析报错信息，默认为false
json.ignore_decoding_error: true
```
<br>

- multiline: 控制Filebeat如何处理跨多行日志消息的选项。有关配置多行选项的详细信息，请参阅管理多行消息。https://www.elastic.co/guide/en/beats/filebeat/6.8/multiline-examples.html
- exclude_files: 不收集指定的日志文件，支持正则。例如：exclude_files: ['\.gz$']
- ignore_older: 如果启用此选项，则Filebeat将忽略在指定的 时间跨度 之前修改的任何文件。可以使用2h和5m这样的配置。 比如我设置2m，再我启动filebeat的时候，只会收集2分钟以内被修改过的文件，2分钟之前的不会管。ignore_older必须比close_inactive更大。
- close_inactive:当启用此选项时，如果在指定的持续时间内没有收集到日志，则Filebeat将关闭文件句柄。
- close_*: 这个选项用于在特定条件或时间过后关闭harvester。关闭harvester意味着关闭文件处理程序。如果在关闭harvester之后更新文件，则在scan_frequency过去之后将再次拾取该文件。但是，如果在harvester关闭时移动或删除文件，Filebeat将无法再次拾取该文件，并且harvester尚未读取的任何数据都将丢失。
- scan_frequency: Filebeat多久检查一次收集的路径中的新日志文件。例如，如果您指定/var/log/*.log，则使用scan_frequency指定的频率在目录中扫描文件。不建议将此值设置为<1s。

















---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2248/  

