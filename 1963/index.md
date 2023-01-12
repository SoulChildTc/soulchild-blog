# prometheus-配置文件-global、rule_files、remote_read|write(一)

<!--more-->
## 一、global(全局配置)
```yaml
global:
  # 抓取指标的间隔,默认1m
  scrape_interval: 15s

  # 抓取指标的超时时间,默认10s
  scrape_timeout: 10s

  # 指定Prometheus评估规则的频率[记录规则(record)和告警规则(alert)],默认1m.
  # 可以理解为执行规则的时间间隔
  evaluation_interval: 30s

  # 用于区分不同的prometheus
  external_labels:
    prometheus: test

  # PromQL查询记录日志文件。重新加载配置会重新打开文件。
  query_log_file: /tmp/query.log
```

## 二、rule_files(规则配置)
这里介绍一下prometheus支持的两种规则：
- 记录规则(recording rules):允许预先计算使用频繁且开销大的表达式，并将结果保存为一个新的时间序列数据，然后查询的时候就不会耗费太多的系统资源和加快查询速度。
- 警报规则(alerting rules): 这个就是自定义告警规则的
```yaml
# 加载指定的规则文件
rule_files:
  - "first.rules"
  - "my/*.rules"
```

## 三、remote_read、remote_write（远程读写配置）
```yaml
remote_write:
  # 指定写入数据的url
  - url: http://remote1/push
    # 远程写配置的名称，如果指定，则在远程写配置中必须是唯一的。该名称将用于度量标准和日志记录中，代替生成的值，以帮助用户区分远程写入配置。
    name: drop_expensive
    # 远程写重新打标签配置
    write_relabel_configs:
    - source_labels: [__name__]
      regex:         expensive.*
      action:        drop
  # 指定写入数据的第二个url
  - url: http://remote2/push
    name: rw_tls
    # tls连接配置
    tls_config:
      cert_file: valid_cert_file
      key_file: valid_key_file

remote_read:
  # 指定读取数据的url
  - url: http://remote1/read
    # 表示近期数据也要从远程存储读取，因为Prometheus近期数据无论如何都是要读本地存储的。设置为true时，Prometheus会把本地和远程的数据进行Merge。默认是false，即从本地缓存查询近期数据.
    read_recent: true
    name: default
  # 指定读取数据的第二个url
  - url: http://remote3/read
    # 从本地缓存查询近期数据
    read_recent: false
    name: read_special
    # 可选的匹配器列表，必须存在于选择器中以查询远程读取端点。
    required_matchers:
      job: special
    tls_config:
      cert_file: valid_cert_file
      key_file: valid_key_file
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1963/  

