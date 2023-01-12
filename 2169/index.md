# alertmanager-webhook发送告警&amp;恢复信息的请求体

<!--more-->
### 告警
```json
{
    "receiver":"ops",
    "status":"firing",
    "alerts":[
        {
            "status":"firing",
            "labels":{
                "alertname":"load5负载高于5",
                "beta_kubernetes_io_arch":"amd64",
                "beta_kubernetes_io_fluentd_ds_ready":"true",
                "beta_kubernetes_io_os":"linux",
                "instance":"test-k8s-master",
                "job":"node_exporter",
                "kubernetes_io_arch":"amd64",
                "kubernetes_io_hostname":"test-k8s-master",
                "kubernetes_io_os":"linux",
                "severity":"critical",
                "team":"ops"
            },
            "annotations":{
                "description":"test-k8s-master 高于5,当前值:0.56",
                "summary":"load5负载高于5"
            },
            "startsAt":"2020-12-30T05:04:49.455639638Z",
            "endsAt":"0001-01-01T00:00:00Z",
            "generatorURL":"http://xxx.com/graph?g0.expr=node_load5+%3E+0&amp;g0.tab=1"
        },
        {
            "status":"firing",
            "labels":{
                "alertname":"load5负载高于5",
                "beta_kubernetes_io_arch":"amd64",
                "beta_kubernetes_io_fluentd_ds_ready":"true",
                "beta_kubernetes_io_os":"linux",
                "instance":"test-k8s-node1",
                "job":"node_exporter",
                "kubernetes_io_arch":"amd64",
                "kubernetes_io_hostname":"test-k8s-node1",
                "kubernetes_io_os":"linux",
                "severity":"critical",
                "team":"ops"
            },
            "annotations":{
                "description":"test-k8s-node1 高于5,当前值:1.42",
                "summary":"load5负载高于5"
            },
            "startsAt":"2020-12-30T05:04:49.455639638Z",
            "endsAt":"0001-01-01T00:00:00Z",
            "generatorURL":"http://xxx.com/graph?g0.expr=node_load5+%3E+0&amp;g0.tab=1"
        },
        {
            "status":"firing",
            "labels":{
                "alertname":"load5负载高于5",
                "beta_kubernetes_io_arch":"amd64",
                "beta_kubernetes_io_fluentd_ds_ready":"true",
                "beta_kubernetes_io_os":"linux",
                "instance":"test-k8s-node2",
                "job":"node_exporter",
                "kubernetes_io_arch":"amd64",
                "kubernetes_io_hostname":"test-k8s-node2",
                "kubernetes_io_os":"linux",
                "severity":"critical",
                "team":"ops"
            },
            "annotations":{
                "description":"test-k8s-node2 高于5,当前值:0.16",
                "summary":"load5负载高于5"
            },
            "startsAt":"2020-12-30T05:04:49.455639638Z",
            "endsAt":"0001-01-01T00:00:00Z",
            "generatorURL":"http://xxx.com/graph?g0.expr=node_load5+%3E+0&amp;g0.tab=1"
        }
    ],
    "groupLabels":{
        "alertname":"load5负载高于5"
    },
    "commonLabels":{
        "alertname":"load5负载高于5",
        "severity":"critical",
        "team":"ops"
    },
    "commonAnnotations":{
        "summary":"load5负载高于5"
    },
    "externalURL":"http://alertmanager-57fffcb99c-kjhcj:9093",
    "version":"4",
    "groupKey":"{}/{severity=\"critical\"}:{alertname=\"load5负载高于5\"}"
}
```

### 恢复
```json
{
    "receiver":"ops",
    "status":"resolved",
    "alerts":[
        {
            "status":"resolved",
            "labels":{
                "alertname":"load5负载高于5",
                "beta_kubernetes_io_arch":"amd64",
                "beta_kubernetes_io_fluentd_ds_ready":"true",
                "beta_kubernetes_io_os":"linux",
                "instance":"test-k8s-master",
                "job":"node_exporter",
                "kubernetes_io_arch":"amd64",
                "kubernetes_io_hostname":"test-k8s-master",
                "kubernetes_io_os":"linux",
                "severity":"critical",
                "team":"ops"
            },
            "annotations":{
                "description":"test-k8s-master 高于5,当前值:0.09",
                "summary":"load5负载高于5"
            },
            "startsAt":"2020-12-30T05:04:49.455639638Z",
            "endsAt":"2020-12-30T06:07:49.455639638Z",
            "generatorURL":"http://119.3.44.21:30002/graph?g0.expr=node_load5+%3E+5&amp;g0.tab=1"
        },
        {
            "status":"resolved",
            "labels":{
                "alertname":"load5负载高于5",
                "beta_kubernetes_io_arch":"amd64",
                "beta_kubernetes_io_fluentd_ds_ready":"true",
                "beta_kubernetes_io_os":"linux",
                "instance":"test-k8s-node1",
                "job":"node_exporter",
                "kubernetes_io_arch":"amd64",
                "kubernetes_io_hostname":"test-k8s-node1",
                "kubernetes_io_os":"linux",
                "severity":"critical",
                "team":"ops"
            },
            "annotations":{
                "description":"test-k8s-node1 高于5,当前值:0.61",
                "summary":"load5负载高于5"
            },
            "startsAt":"2020-12-30T05:04:49.455639638Z",
            "endsAt":"2020-12-30T06:07:49.455639638Z",
            "generatorURL":"http://119.3.44.21:30002/graph?g0.expr=node_load5+%3E+5&amp;g0.tab=1"
        },
        {
            "status":"resolved",
            "labels":{
                "alertname":"load5负载高于5",
                "beta_kubernetes_io_arch":"amd64",
                "beta_kubernetes_io_fluentd_ds_ready":"true",
                "beta_kubernetes_io_os":"linux",
                "instance":"test-k8s-node2",
                "job":"node_exporter",
                "kubernetes_io_arch":"amd64",
                "kubernetes_io_hostname":"test-k8s-node2",
                "kubernetes_io_os":"linux",
                "severity":"critical",
                "team":"ops"
            },
            "annotations":{
                "description":"test-k8s-node2 高于5,当前值:0.4",
                "summary":"load5负载高于5"
            },
            "startsAt":"2020-12-30T05:04:49.455639638Z",
            "endsAt":"2020-12-30T06:07:49.455639638Z",
            "generatorURL":"http://119.3.44.21:30002/graph?g0.expr=node_load5+%3E+5&amp;g0.tab=1"
        }
    ],
    "groupLabels":{
        "alertname":"load5负载高于5"
    },
    "commonLabels":{
        "alertname":"load5负载高于5",
        "severity":"critical",
        "team":"ops"
    },
    "commonAnnotations":{
        "summary":"load5负载高于5"
    },
    "externalURL":"http://alertmanager-57fffcb99c-kjhcj:9093",
    "version":"4",
    "groupKey":"{}/{severity=\"critical\"}:{alertname=\"load5负载高于5\"}"
}

```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2169/  

