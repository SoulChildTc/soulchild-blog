# prometheus-配置文件-scrape_configs、relabel_config等抓取相关配置(二)

<!--more-->
本篇主要介绍抓取指标相关配置：
target: 要抓取的目标`<host>:<port>`
metrics: 指标数据


## 1.static_configs:
```yaml
  # 静态配置
  static_configs:
  # 指定要抓取的目标地址
  - targets: ['localhost:9090', 'localhost:9191']
    # 给抓取出来的所有指标添加指定的标签
    labels:
      my: label
      your: label
```

## 2.file_sd_configs:
基于文件的自动发现,prometheus会定期读取文件中的配置并重新加载，文件可以是yml、yaml和json格式的。
每个target在执行过程中都有一个元标签`__meta_filepath`为文件的路径。
```yaml
  # 文件自动发现
  file_sd_configs:
    - files:
      - foo/*.slow.json
      - foo/*.slow.yml
      - single/file.yml
      # 重新读取文件的间隔,默认5m
      refresh_interval: 10m
    - files:
      - bar/*.yaml
```
json文件的格式：
```json
[
  {
    # 配置抓取目标
    "targets": [
      "http://s1.soulchild.cn",
      "http://s2.soulchild.cn"
    ],
    # 添加标签
    "labels": {
      "env": "test",
      "service": "app"
    }
  },
  {
    "targets": [
      "http://pc.soulchild.cn"
    ],
    "labels": {
      "env": "dev",
      "service": "pc"
    }
  },
  {
    "targets": [
      "https://soulchild.cn"
    ],
    "labels": {
      "project": "soulchild",
      "env": "prod",
      "service": "blog"
    }
  }
]
```
yaml文件的格式：
```yaml
- targets:
  - http://s1.soulchild.cn
  - http://s2.soulchild.cn
  labels:
    env: test
    service: app
- targets:
  - http://pc.soulchild.cn
  labels:
    env: dev
    service: pc
- targets:
  - https://soulchild.cn
  labels:
    project: soulchild
    env: prod
    service: blog
```


## 3.relabel_configs:
relabel是功能强大的工具，可以在target被抓取之前动态重写目标的标签集。每个scrape可以配置多个relabel,对不同的标签进行不同的操作。relable的过程可以分为：relabel之前,relabel期间,relabel之后。relabel_configs不能操作指标中的标签，只能操作relabel之前的标签。即`__`开头的和`job`这些


relabel之前,除了自定义的标签外，还有一些其他的标签：
`job`,这个标签的值是配置文件中`job_name配置的值`

`__address__`这个标签的值是要抓取的地址和端口`<host>:<port>`

`instance`这个标签，在relabel之前是没有的，如果relabel期间也没有设置`instance`标签,默认情况下instance标签的值就是`__address__`的内容

`__scheme__`:http或https
`__metrics_path__`: metrics的路径
`__param_<name>`: http请求参数,`<name>`就是参数名


> 1.以`__`开头的标签会在relabel完成后，从标签集中删除
> 2.如果relabel期间需要临时的标签,可以使用`__tmp`前缀,这个标签不会被prometheus使用，防止冲突

### relabel可以执行的操作：
- replace: 将"target_label"指定的标签的值替换为"replacement"指定的内容
- keep: 删除与正则不匹配的目标
- drop: 删除与正则匹配的目标
- labelmap: 将正则与所有标签的"名称"匹配，然后用"replacement"指定的内容来替换源标签的名称，source_labels不用填写。一般用来去除标签前缀获得一个新的标签名称
- labeldrop: 删除与正则匹配的label,labeldrop只需要写regex字段
- labelkeep: 删除与正则不匹配的label,labelkeep只需要写regex字段
- hashmod: 这个没看懂

下面可以看一下配置的方法：
```yaml
  relabel_configs:
  # 从现有的标签中指定源标签(可以指定多个),不写source_labels代表所有标签
  - source_labels:[__address__, scrape_port]

    # 多个标签的值会使用以下分割符连接起来,正则的时候需要考虑这个分割符.默认";"
    separator: ;

    # 使用正则提取数据.假如源标签的内容是"10.0.0.10:8088;80",就匹配到10.0.0.10、8088、80这三个部分。默认正则:(.*)
    regex: (.*?):(\d+);(\d+)

    # 指定要将结果值写入哪个标签。如果写一个不存在的标签，相当于新增一个标签。
    target_label: __address__

    # 要替换的内容,默认$1
    replacement: $1:$3
    
    # 指定要执行什么操作,默认replace
    action: replace
############################################
  # 直接将abc标签的值给cde标签
  - source_labels: [abc]  # 源标签
    target_label: cde     # 目标标签
   
  # 将static做为abc标签的值，即abc=static
  - replacement: static
    target_label: abc
  # 同上
  - regex:
    replacement: static
    target_label: abc
```

## 4. metric_relabel_configs:
这个配置的操作是在抓取指标之后,存储数据之前，所以你可以在存储数据之前删除指标、删除和重写指标的标签。
配置的方法和上面的`relabel_configs`是一样的。
这里会涉及到一个新的预留标签`__name__`,这个标签的值就是指标名称，所以我们通过修改匹配这个标签就可以对指标进行操作了。


## 5.下面结合上面说到的做一些配置示例：
### 5.1. 这部分包含了大部分的基础配置
```yaml
# 抓取部分的配置
scrape_configs:
# job_name的值默认会做为job标签的值,job_name可以配置多个
- job_name: prometheus

  # 每个抓取请求上添加"Authorization"请求头,下面两个二选一
  bearer_token: xxxxxxxxxxxxxxxx
  bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

  # 使用http还是https
  scheme: http

  # metrics路径
  metrics_path: metrics

  # 防止prometheus附加的标签、手动配置的标签以及服务发现生成的标签，和抓取数据中的标签冲突.
  # 默认是false,将抓取的数据中的冲突标签重命名为"exported_<original-label>".如果设置为true,则保留抓取数据中的标签
  honor_labels: true

  # 当Prometheus联合(联邦)另一个监控系统时，可能是该监控系统暴露了时间戳。对于带有时间戳的联合(联邦)，如果时间戳消失，则Prometheus不会将指标数据标记为"stale"状态,相反它将出现在query.loopback值之前https://github.com/prometheus/prometheus/issues/5302
  # 默认true,则将使用target公开的指标数据的时间戳.如果设置为"false",则target的指标数据的时间戳将被忽略。
  honor_timestamps: true

  # 抓取数据的间隔(不写继承global)
  scrape_interval: 30s

  # 抓取数据的超时时间(不写继承global)
  scrape_timeout: 10s

  # 存储的数据标签个数限制，如果超过限制，该数据将被忽略，不入存储；默认值为0，表示没有限制
  sample_limit: 0
  
  # 文件自动发现配置,target的配置从下面指定的文件中读取
  file_sd_configs:
    - files:
      - foo/*.slow.json
      - foo/*.slow.yml
      - single/file.yml
      refresh_interval: 10m
    - files:
      - bar/*.yaml

  # target静态配置,从下面指定的目标中抓取数据
  static_configs:
  - targets: ['localhost:9090', 'localhost:9191']
    # 添加额外的标签
    labels:
      my:   label
      your: label

  # 重新标签
  relabel_configs:
  # 整段含义是使用"(.*)some-[regex]"匹配源标签中的内容，并将job这个标签的值=foo-${1},$1就是匹配到的内容
  - source_labels: [job, __meta_dns_name]
    regex:         (.*)some-[regex]
    target_label:  job
    replacement:   foo-${1}
    

  # 直接将abc标签的值给cde标签
  - source_labels: [abc]  # 源标签
    target_label: cde     # 目标标签
   
  # 将static做为abc标签的值，即abc=static
  - replacement: static
    target_label: abc
  # 同上
  - regex:
    replacement: static
    target_label: abc
```
### 5.2 当抓取的http请求需要参数和basic认证时
```yaml
- job_name: 'param_test'
  # 如果抓取指标的url需要basic认证则使用下面的方式配置
  basic_auth:
    username: admin_name
    password: "multiline\nmysecret\ntest"
  # 这里指定抓取路径
  metrics_path: /probe
  # 指定http请求参数,相当于http://192.168.0.200:9115/probe?target=https://soulchild.cn&module=http_2xx
  params:
    target: ["https://soulchild.cn"]
    module: [http_2xx]
  # 抓取目标和重新标签。。。。。
  static_configs:
    - targets: ["192.168.0.200:9115"]
  relabel_configs:
    - source_labels: [__param_target]
      target_label: instance
```

### 5.3 基于consul自动发现配置
```yaml
- job_name: service-y
  consul_sd_configs:
  - server: 'localhost:1234'
    token: mysecret
    services: ['nginx', 'cache', 'mysql']
    tags: ["canary", "v1"]
    node_meta:
      rack: "123"
    allow_stale: true
    scheme: https
    tls_config:
      ca_file: valid_ca_file
      cert_file: valid_cert_file
      key_file:  valid_key_file
      insecure_skip_verify: false

  relabel_configs:
  - source_labels: [__meta_sd_consul_tags]
    separator:     ','
    regex:         label:([^=]+)=([^,]+)
    target_label:  ${1}
    replacement:   ${2}
```

### 5.4 删除不需要的指标
```yaml
- job_name: node_exporter
  static_configs:
  - targets: ['10.0.0.2:9100']
    labels:
      instance: "db01"
  # 删除node_netstat_Icmp6_InErrors和node_netstat_Icmp6_InMsgs指标
  metric_relabel_configs:
  - source_labels: [__name__]
    regex: "(node_netstat_Icmp6_InErrors|node_netstat_Icmp6_InMsgs)"
    action:  drop
```
### 5.5 替换标签的值
container_id = docker://8bfaa038763215a732dea54ebe8bd8eeb48e2bed88c05f0ec52c00b27214e3c4

将`kube_pod_container_info`这个指标的`container_id`标签中id的前8位取出来，并替换至`container_id`标签
```yaml
- job_name: kubernetes-service-endpoints
  kubernetes_sd_configs:
  - role: endpoints
  metric_relabel_configs:
  - source_labels: [__name__, container_id]
    separator: ;
    regex: kube_pod_container_info;docker://([a-z0-9]{8})
    target_label: container_id
    replacement: $1
    action: replace
```

### 5.6 删除不需要的标签
删除`kernelVersion`这个标签.labeldrop只需要写regex字段
```yaml
- job_name: kubernetes-cadvisor
  kubernetes_sd_configs:
  - role: node
  bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
  tls_config:
    ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    insecure_skip_verify: true
  metric_relabel_configs:
  - regex: kernelVersion
    action: labeldrop
```











---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1965/  

