# filebeat+logstash收集nginx日志

<!--more-->
### 一、nginx日志改造
1. 定义json日志格式
```nginx
    log_format json   '{ "@timestamp": "$time_iso8601", '
                         '"remote_addr": "$remote_addr", '
                         '"remote_user": "$remote_user", '
                         '"body_bytes_sent": "$body_bytes_sent", '
                         '"request_time": "$request_time", '
                         '"status": "$status", '
                         '"request_host": "$host", '
                         '"request_method": "$request_method", '
                         '"request_uri": "$request_uri", '
                         '"uri": "$uri", '
                         '"http_referrer": "$http_referer", '
                         '"body_bytes_sent":"$body_bytes_sent", '
                         '"http_x_forwarded_for": "$http_x_forwarded_for", '
                         '"http_user_agent": "$http_user_agent" '
                    '}';
```

2.替换main为json格式
`cd /usr/local/nginx/conf/conf.d/;ls | xargs -l sed -i 's#main;#json;# `


### 二、配置filebeat
```yaml
filebeat.inputs:
- type: log
  paths:
  - /usr/local/nginx/logs/*_access.log
  fields_under_root: true
  fields:
    log_type: nginx_access
    env: test
  json:
    keys_under_root: true
    overwrite_keys: true
- type: log
  paths:
  - /usr/local/nginx/logs/*_error.log
  fields_under_root: true
  fields:
    log_type: nginx_error
    env: test

processors:
- add_host_metadata:
    netinfo.enabled: true
- drop_fields:
    fields:
    - input
    - agent
    - ecs
    - beat
    - prospector
    - name
    - host.architecture
    - host.os
    - host.id
    - host.containerized
    - host.mac
    - host.name

output.redis:
  hosts: ["1.1.1.1"]
  datatype: "list"
  db: 0
  key: "nginx_test"
```


### 三、配置logstash
1.input-from-redis.config
```json
input {
  redis {
    data_type => "list"
    db => 0
    host => "1.1.1.1"
    key => "nginx_test"
  }
}
```
2.filter.config
```
filter {
  mutate {
    add_field => {
      "handler" => "${HOSTNAME:logstash-01}"
    }
  }
}
```

3.output-into-es.config
```json
output{
    if [log_type] == "blade_java" or [log_type] == "springboot_java" {
        elasticsearch {
          hosts => ["2.2.2.1:9200", "2.2.2.2:9200", "2.2.2.3:9200"]
          index => "%{project}-%{env}-%{app}-%{+yyyy.MM.dd}"
          user => "log_agent"
          password => "loados-log"
        }
    }

    if [log_type] in ["nginx_access", "nginx_error"] {
        elasticsearch {
          hosts => ["2.2.2.1:9200", "2.2.2.2:9200", "2.2.2.3:9200"]
          index => "%{log_type}-%{env}-%{+yyyy.MM.dd}"
          user => "log_agent"
          password => "loados-log"
        }
    }

}
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2309/  

