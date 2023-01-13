# ELK-logstash配置fileter插件之date简单介绍(五)

<!--more-->
date过滤器用于解析字段中的日期，然后使用该日期或时间戳作为日志存储时间(@timestamp).也可以通过target选项自定义


例如syslog的时间格式:`Apr 17 09:32:01`,可以使用`MMM dd HH:mm:ss`来解析


## 示例:
将按照指定的格式，解析事件中date字段。将解析出来的内容替换到@timestamp
```
    filter {
      date {
        # 时间：2021-04-01 15:29:43.607
        match => [ "date", "yyyy-MM-dd HH:mm:ss.SSS" ]
      }
    }
```


## 日期语法简介
完整: https://www.elastic.co/guide/en/logstash/7.8/plugins-filters-date.html:
### 年
- #### yyyy: 完整的年份，例如2015
- #### yy: 两位数的年份. 例如: 2015年的15


### 月
- #### M: 一位数的月。例如: 1表示1月,12表示12月
- #### MM: 两位数的月份。例如: 01表示1月,12表示12月
- #### MMM: 简写英文。例如: Jan表示1月,Dec表示12月. 注意:使用的语言取决于您的地区。`locale`配置
- #### MMMM: 完整英文。例如: January表示1月. 注意:使用的语言取决于您的地区。`locale`配置

### 日
- #### d: 一位数的日。例如: 3号
- #### dd: 两位数的日。例如: 03号

### 时
- #### H: 一位数的小时。例如: 1点
- #### HH: 两位数的小时。例如: 01点

### 分
- #### m: 一位数的分。例如: 6分
- #### mm: 两位数的分。例如: 06分

### 秒
- #### s: 一位数的秒
- #### ss: 两位数的秒

### 更大精度的秒
- #### S: 十分之一秒
- #### SS: 百分之一秒
- #### SSS: 千分之一秒

### 时区偏移量或标识
- #### Z: 格式`HHmm`,例如`-0700`。减7小时
- #### ZZ: 格式`HH:mm`,例如`-07:00`。减7小时
- #### ZZZ: 例如`Asia/Shanghai`





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2300/  

