# fluentd格式化format（六）

<!--more-->
format部分可以位于<match>或<filter>部分中。

## 插件类型
format部分需要@type参数来指定格式化程序插件的类型。 fluentd内置了一些有用的格式化程序插件。安装第三方插件时也可以使用
```xml
<format>
  @type json
</format>
```

下面是一些内置的格式化插件：
- [out_file](https://docs.fluentd.org/formatter/json])
- [json](https://docs.fluentd.org/formatter/json)
- [ltsv](https://docs.fluentd.org/formatter/ltsv)
- [csv](https://docs.fluentd.org/formatter/csv)
- [msgpack](https://docs.fluentd.org/formatter/msgpack)
- [hash](https://docs.fluentd.org/formatter/hash)
- [single_value](https://docs.fluentd.org/formatter/single_value)


## 参数：
- @type：指定插件类型

## 时间参数
- time_type：时间类型
  - 默认值：float
  - 可选值：float, unixtime, string
    - float: 纪元+纳秒(例如:1510544836.154709804)
    - unixtime: 纪元(例如:1510544815)
    - string: 使用由`time_format`、本地时间或时区指定的格式

- time_format：时间格式
  - 默认值：nil

- localtime：如果为真，使用本地时间。否则，使用 UTC
  - 默认值：true

- utc：如果为真，使用UTC。否则，使用本地时间
  - 默认值：false

- timezone：指定时区
  - 默认值：nil
  - 可用的时区格式：
    1. [+-]HH:MM(例如:+09:00)
    2. [+-]HHMM(例如:+0900)
    3. [+-]HH(例如:+09)
    4. Region/Zone(例如:Asia/Tokyo)
    5. Region/Zone/Zone(例如:America/Argentina/Buenos_Aires)


## json插件举例：

json格式化插件将事件转换为json。默认情况下，json格式化程序结果不包含标签和时间字段。


可用参数：
- [通用参数](https://soulchild.cn/1717.html)
- [format参数](#参数)
- add_newline: 在结果中添加\\n
  - 默认值：true

下面的配置是从/var/log/test.log文件中读取内容，并通过stdout插件打印到屏幕中

我们先来看一下不使用format的显示结果
```xml
<source>
    @type tail
    tag   test.aa
    path  /var/log/test.log
    pos_file /tmp/test.log.pos
    <parse **>
      @type none
    </parse>
</source>

<match **>
  @type stdout
 # <format>
 #   @type json
 #   add_newline false
 # </format>
</match>
```

模拟生成日志：```echo 'test line 1' >> /var/log/test.log```

![19451-utsp60u6qw.png](images/1455327543.png "1455327543")

```xml
<source>
    @type tail
    tag   test.aa
    path  /var/log/test.log
    pos_file /tmp/test.log.pos
    <parse **>
      @type none
    </parse>
</source>

<match test.**>
  @type stdout
  <format>
    @type json
    add_newline false
  </format>
</match>

```
启动服务`td-agent -c demo2.conf`


模拟生成日志：```echo 'test line 1' >> /var/log/test.log```,可以看到日志只保留了json格式的部分

![72820-tetd7qoj5d.png](images/2392191246.png "2392191246")


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1752/  

