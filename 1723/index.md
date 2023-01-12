# fluentd数据解析Parse（四）

<!--more-->
官方文档：https://docs.fluentd.org/configuration/parse-section

&nbsp;

Parse区块来指定如何解析原始数据。Parse可以在<source>,<match>,<filter>区块使用。为他们提供解析的功能。
```
<source>
  @type tail
  # parameters for input plugin
  <parse>
    # parse section parameters
  </parse>
</source>
```
下面是一些内置的解析器类型：
- regexp
- apache2
- apache_error
- nginx
- syslog
- csv
- tsv
- ltsv
- json
- multiline
- none


通过@type参数来指定解析器插件的类型
```
<parse>
  @type apache2
</parse>
```

### 解析器的参数(可选)：

types(hash类型-kv)：用于将字段转换为其他类型

默认：无
> 
字符串转换：`field1:type, field2:type, field3:type:option, field4:type:option`
json转换：`{"field1":"type", "field2":"type", "field3":"type:option", "field4":"type:option"}`

示例：`types user_id:integer,paid:bool,paid_usd_amount:float`

支持的字段类型：`string、bool、integer、float、time、array`

#### time_key(字符串类型)：从事件的什么字段中获取时间，如果该字段不存在，则取当前时间

#### null_empty_string：将空值替换为nil，默认为false

#### estimate_current_event(布尔型)：是否以当前时间作为time_key的值，默认false

#### keep_time_key(布尔型)：是否保留事件中的时间字段

#### timeout：检测错误的正则表达式匹配超时时间。


下面是一个解析nginx访问日志的简单示例
```
<source>
  @type tail
  path /path/to/input/file
  <parse>
    @type nginx
    keep_time_key true
  </parse>
</source>
```

###时间参数：

#### time_type：enum
可选值：float：UNIX时间.纳秒、unixtime： UNIX时间（秒）、string：根据后面几个参数决定具体格式

#### time_format：string
参考Ruby API：<a href="https://docs.ruby-lang.org/en/2.4.0/Time.html#method-i-strftime">时间格式化</a>、<a href="https://docs.ruby-lang.org/en/2.4.0/Time.html#method-c-strptime">时间解析</a>，除了遵循Ruby的时间格式化，还可以取值%iso8601

#### localtime：bool
是否使用本地时间而非UTC，默认true

#### utc：bool
是否使用UTC而非本地时间，默认false

#### timezone：string
指定时区，例如+09:00、+0900、+09、Asia/Shanghai





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1723/  

