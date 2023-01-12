# ELK-filebeat配置处理器(八)

<!--more-->
您可以在配置中定义processors,以便在事件发送到配置的output之前对其进行处理,比如删除，添加字段等等。

### 一、定义处理器
处理器可以定义在全局或者一些input中,还可以使用一些条件判断作出不同选择

```
processors:
- <processor_name>:
    when:
      <condition>
    <parameters>

- <processor_name>:
    when:
      <condition>
    <parameters>
```

下面是支持的处理器(具体用法：https://www.elastic.co/guide/en/beats/filebeat/6.8/defining-processors.html#processors)
- add_cloud_metadata
- add_locale
- decode_json_fields
- drop_event
- drop_fields
- include_fields
- rename
- add_kubernetes_metadata
- add_docker_metadata
- add_host_metadata
- dissect
- dns
- add_process_metadata
> 注意：高版本的filebeat支持更多的类型

支持的条件类型(具体用法：https://www.elastic.co/guide/en/beats/filebeat/6.8/defining-processors.html#conditions)
- equals
- contains
- regexp
- range
- has_fields
- or
- and
- not


### 二、简单介绍几个常用的处理器
#### 1.drop_event：删除事件，必须指定条件
```
# 将事件中level属性等于debug的事件删除
processors:
  - drop_event:
      when.equals:
        level: "debug"        
```



#### 2.drop_fields: 删除事件中的属性(字段)，可以没有条件
```
# 删除fields中指定的所有字段
processors:
  - drop_fields:
     fields:
     - beat
     - host
     - input
     - source
```

#### 3.include_fields: 指定哪些属性(字段)不删除，其他的都会被删除
```
# 除了message属性，其他属性全部删除
processors:
  - include_fields:
      fields: ["message"]

```

#### 4.rename: 修改属性(字段)的名称。
配置参数:
- fields: 
  - from: 属性(字段)的原始名称
  - to: 属性(字段)的新名称
- ignore_missing: 如果缺少重命名的属性(字段)，则不记录任何错误。默认false
- fail_on_error: 重命名失败是否报错，默认true

```
# 将log下的file字段名称改为aaa
processors:
  - rename:
      fields:
        - from: "log.file"
        - to: "log.aaa"
```

#### 5.dissect: 将字段按照指定表达式来解析，将解析出来的内容添加到事件的属性中。
- tokenizer: 指定表达式
- field: 表达式匹配哪个字段
- target_prefix: 添加到哪个属性下
```
# 使用空格分割message字段的内容%{xxx}代表新的key的名称,需要自定义。将key1和key2添加到事件的属性中
processors:
- dissect:
    tokenizer: "%{key1} %{key2}"
    field: "message"
    target_prefix: ""
```
> 如果解析出错，会在log.flags中添加[dissect_parsing_error]。





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2272/  

