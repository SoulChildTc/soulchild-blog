# fluentd使用es插件作为输出

<!--more-->
##参数
- @type (必须)
指定插件
- host (可选)
es主机地址，默认localhost
- port (可选)
es端口，默认9200
- hosts (可选)
如果是集群，指定多个地址和端口，如果使用此选项，则忽略`host`和`port`选项。配置格式如下：
```xml
hosts host1:port1,host2:port2,host3:port3
# or
hosts https://customhost.com:443/path,https://username:password@host-failover.com:443
```
- user, password (可选)
es的登陆凭证
```xml
user fluent
password mysecret
```
- scheme (可选)
指定协议，默认http
- path (可选)
restapi用于发出写请求的路径(默认值: nil)
- index_name (可选)
es索引名称，默认fluentd
```xml
# 支持使用占位符
index_name fluentd.${tag}

# 可以使用动态的时间占位符
ndex_name fluentd.${tag}.%Y%m%d

# 要使用占位符需要在区块键中设置tag和time键。还需要为缓冲块的时间片指定timekey
<buffer tag, time>
  timekey 1h # chunks per hours ("3600" also available)
</buffer>
```
- logstash_format (可选)
设置为true后，Fluentd使用传统的索引名格式`logstash-%Y.%m.%d`(默认值: false)。 此选项取代`index_name`选项。
- @log_leve (可选)
日志级别，支持fatal,error,warn,info,debug,trace.
- logstash_prefix (optional)
索引的前缀，默认logstash

## 配置文件
```xml
  <source>
    @type http
    port 8888
  </source>
  <match **>
    @type elasticsearch
    host "localhost"
    port 9200
    index_name "fluentd.${tag}.%Y%m%d"
    <buffer tag,time>
      timekey 60s
      flush_mode interval
      flush_interval 10
    </buffer>
  </match>
```

启动服务`td-agent -c demo3.conf`

发送日志测试：`curl localhost:8888/test1 -d 'json={"aaa":"bbb"}'`
等待10秒后，索引已经被创建了
![71568-kvzlvbpuwh.png](images/3625094780.png "3625094780")






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1762/  

