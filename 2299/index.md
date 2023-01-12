# ELK-logstash配置fileter插件之grok(四)

<!--more-->
grok插件可以使用正则将非结构化的日志，解析成结构化日志。并且还可以使用内部预定义的正则。

预定义的正则: https://github.com/logstash-plugins/logstash-patterns-core/tree/master/patterns
在线调试工具: https://grokdebug.herokuapp.com/

## 一、基本使用
### 1.使用内置正则格式:
`%{NUMBER:duration} %{IP:client}`
> NUMBER代表正则,duration代表正则解析出来内容，使用的字段名称

### 举例:
#### 日志内置正则格式`55.3.244.1 GET /index.html 15824 0.043`

logstash配置
```
    input {
      file {
        path => "/var/log/http.log"
      }
    }
    filter {
      grok {
        # 对message字段进行匹配
        match => { "message" => "%{IP:client} %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes} %{NUMBER:duration}" }
      }
    }
```
经过grok过滤后，事件会添加如下字段
- `client: 55.3.244.1`
- `method: GET`
- `request: /index.html`
- `bytes: 15824`
- `duration: 0.043`

### 2.使用自定义正则格式
`(?<field_name>the pattern here)`
> field_name代表正则解析出来内容，使用的字段名称，the pattern here代表正则表达式
> 例如: `(?<bytes>[0-9]+)`

## 二、配置选项
### keep_empty_captures
- 类型: boolean
- 默认值: false
- 描述: 如果捕获的值是空值，是否保留字段，例如

正则: `\|IP=(?<clientip>.*)\|`,这个正则可能会匹配到空的内容
日志内容: `|IP=|`,这个内容会被上面的正则成功匹配，但是匹配的内容是空的，默认情况下事件中不会有clientip字段，如下所示，如果要保留clientip字段，需要将参数的值改为true
结果: 
```
{
    "@timestamp" => 2021-04-01T01:59:39.908Z,
       "message" => "|IP=|",
          "host" => "logstash01",
      "@version" => "1"
}
```

### match
- 类型: hash
- 默认值: {}
- 描述: 定义与日志匹配的正则，字段名称
例如：
```
filter {
  grok { 
    match => { "message" => "Duration: %{NUMBER:duration}" } }
}
```


也可以使用多组正则表达式,如下：
```
filter{
  grok{
    match=>{
      "message"=>[
        "Duration: %{NUMBER:duration} Data: %{DATA:data}\|",
        "Speed: %{NUMBER:speed} Data: %{DATA:data}\|"
      ]
    }
  }
}
```

### break_on_match
- 类型: boolean
- 默认值: true
- 描述: 如果有多组正则的话，成功匹配一组正则就会停止匹配。如果设置为false,将会把每组的正则进行匹配。例如

正则: `["Duration: %{NUMBER:duration} Data: %{DATA:data}\|","Duration: %{NUMBER:sudu} Data: %{DATA:data}\|"]`
日志: `Duration: 120 Data: asdasd|`
结果:
```
{
          "sudu" => "120",
    "@timestamp" => 2021-04-01T02:53:43.651Z,
      "duration" => "120",
          "data" => [
        [0] "asdasd",
        [1] "asdasd"
    ],
       "message" => "Duration: 120 Data: asdasd|",
          "host" => "ops-elk-es01",
      "@version" => "1"
}
```


### named_captures_only
- 类型: boolean
- 默认值: true
- 描述: 如果设置为true,正则匹配如果没有指定字段名称，则匹配到的内容不会添加到事件中。设置为false，如果使用的是预定义正则，正则名称将作为字段名

### overwrite
- 类型: array
- 默认值: []
- 描述: 指定要覆盖的字段名称。如果不指定，在字段名冲突的情况下，匹配内容将会作为数组的一个元素加入到字段中。
例如:
日志内容: `May 29 16:37:11 sadness logger: hello world`
```
filter {
  grok {
    match => { "message" => "%{SYSLOGBASE} %{DATA:message}" }
    overwrite => [ "message" ]
  }
}
```
最后的结果中事件的message字段的内容是`hello world`

### pattern_definitions
- 类型: hash
- 默认值: {}
- 描述: 定义正则

例如: `pattern_definitions => {"mypattern" => "\d+|%{DATA:data}"}`

### patterns_dir
- 类型: array
- 默认值: []
- 描述: 指定预定义正则的路径，将从这个路径下的文件中寻找预定义正则

例如: `patterns_dir => ["/opt/logstash/patterns", "/opt/logstash/extra_patterns"]`
预定义正则的格式:`NAME PATTERN`。例如:`NUMBER \d+`


### patterns_files_glob
- 类型: string
- 默认值: *
- 描述: 指定`patterns_dir`配置的目录中哪些文件是可以使用的

### tag_on_failure
- 类型: array
- 默认值: ["_grokparsefailure"]
- 描述: 正则匹配失败时,会在tags字段中追加一个标签，这里配置的是标签名称

### tag_on_timeout
- 类型: string
- 默认值: "_groktimeout"
- 描述: 如果正则匹配超时，则应用标记

### target
- 类型: string
- 默认值: 无
- 描述: 定义用于放置匹配项的namespace

### timeout_millis
- 类型: number
- 默认值: 30000
- 描述: 匹配的超时时间。针对单组正则。


## 三、公共选项
### add_field
- 类型: hash
- 默认值: {}
- 描述: 在事件中添加字段
```
    filter {
      grok {
        add_field => {
          "foo_%{somefield}" => "Hello world, from %{host}"
          "new_field" => "new_static_value"
        }
      }
    }
```


### add_tag
- 类型: array
- 默认值: []
- 描述: 在事件中添加tag
```
    filter {
      grok {
        add_tag => [ "foo_%{somefield}", "taggedy_tag"]
      }
    }
```

### enable_metric
- 类型: boolean
- 默认值: true
- 描述: 是否启用当前插件的metric

### id
- 类型: string
- 默认值: 无
- 描述: 向插件配置添加唯一的ID。如果未指定ID，Logstash将生成一个。强烈建议在配置中设置此ID。当您有两个或更多相同类型的插件时（例如，如果您有两个grok过滤器），这一点特别有用。在这种情况下，添加一个命名ID将有助于在使用monitor api时监视logstash。


### periodic_flush
- 类型: boolean
- 默认值: false
- 描述: 定期调用filter flush方法。

### remove_field
- 类型: array
- 默认值: []
- 描述: 删除字段
```
    filter {
      grok {
        remove_field => [ "foo_%{somefield}", "my_extraneous_field" ]
      }
    }
```
### remove_tag
- 类型: array
- 默认值: []
- 描述: 删除tag
```
    filter {
      grok {
        remove_tag => [ "foo_%{somefield}", "sad_unwanted_tag"]
      }
    }
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2299/  

