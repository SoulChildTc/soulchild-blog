# ELK-logstash安装和简介(一)

<!--more-->
### 一、二进制安装
```
# 下载
wget https://artifacts.elastic.co/downloads/logstash/logstash-6.8.9.tar.gz

# 安装
tar xf logstash-6.8.9.tar.gz
mv logstash-6.8.9 /usr/local/

# 启动
/usr/local/logstash-6.8.9/bin/logstash -f logstash.conf

```


### 二、yum安装
```
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
```

```
cat > /etc/yum.repos.d/logstash.repo <<EOF
[logstash-6.x]
name=Elastic repository for 6.x packages
baseurl=https://artifacts.elastic.co/packages/6.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
EOF
```

```
yum install logstash
```


### 三、logstash简介
logstash是一个类似实时流水线的开源数据传输引擎，将数据实时地从一个数据源传输到另一个数据源中。在数据传输过程中可以对数据进行清洗、加工等操作。

logstash数据传输过程分为三个阶段——输入、过滤、输出。在实现上，它们由三种类型的插件实现，即输入插件、过滤器插件、输出插件。除了这三种外还有一个叫编解码器(codec)的插件。编解码器插件用于在数据进入和离开管道时对数据做解码和编码，所以它一般是和输入、输出插件结合在一起使用。


### 四、配置文件的结构
每个部分包含一个或多个插件的配置选项。如果您指定了多个过滤器，它们将按照它们在配置文件中出现的顺序应用。
```
input {
  ...
}

filter {
  ...
}

output {
  ...
}
```
一个插件的配置包括插件名和该插件的设置块。例如，这个input部分配置了两个文件输入:
```
input {
  file {
    path => "/var/log/messages"
    type => "syslog"
  }

  file {
    path => "/var/log/apache/access.log"
    type => "apache"
  }
}
```

配置文件不通数据类型的写法
#### array: `users => [ {id => 1, name => bob}, {id => 2, name => jane} ]`
#### list: `path => [ "/var/log/messages", "/var/log/*.log" ]`
#### boolean: `ssl_enable => true`
#### bytes: 
```
  my_bytes => "1113"   # 1113 bytes
  my_bytes => "10MiB"  # 10485760 bytes
  my_bytes => "100kib" # 102400 bytes
  my_bytes => "180 mb" # 180000000 bytes
```
#### codec: `codec => "json"`
#### hash: hash是键值对的集合，指定格式为"field1" => "value1"。注意，多个键值条目用空格而不是逗号分隔。
```
match => {
  "field1" => "value1"
  "field2" => "value2"
  ...
}
```

条件判断
```
if EXPRESSION {
  ...
} else if EXPRESSION {
  ...
} else {
  ...
}
```
支持下面这些条件操作符
等式: ==, !=, <, >, <=, >=
正则: =~, !~ 
包含: in, not in
逻辑: and, or, nand, xor













---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2286/  

