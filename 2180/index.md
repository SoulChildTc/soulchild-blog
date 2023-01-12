# prometheus监控kubernetes集群配置详解(七)

<!--more-->
`kubernetes_sd_config`通过发现k8s中各种对象的IP地址端口等信息,作为target来抓取。

可以配置以下角色类型来获取不同对象的ip和port等信息:
## 一、角色类型
### 1. node
`node`角色可以发现集群中每个node节点的地址端口，默认为Kubelet的HTTP端口。目标地址默认为Kubernetes节点对象的第一个现有地址，地址类型顺序为NodeInternalIP、NodeExternalIP、NodeLegacyHostIP和NodeHostName。

#### 可用标签
- `__meta_kubernetes_node_name`: node节点的名称
- `__meta_kubernetes_node_label_<labelname>`: k8s中node节点的标签.`<labelname>`代表标签名称
- `__meta_kubernetes_node_labelpresent_<labelname>`: 标签存在则为true.`<labelname>`代表标签名称
- `__meta_kubernetes_node_annotation_<annotationname>`: k8s中node节点的注解.`<annotationname>`代表注解名称
- `__meta_kubernetes_node_annotationpresent_<annotationname>`: 注解存在则为true.`<annotationname>`代表注解名称
- `__meta_kubernetes_node_address_<address_type>`: 不同类型的node节点地址,例如: 
  - `_meta_kubernetes_node_address_Hostname="test-k8s-node1"`
  - `_meta_kubernetes_node_address_InternalIP="10.0.0.11"`
- `instance`: 从apiserver获取到的节点名称
---
### 2. service
`service`角色可以发现每个service的ip和port,将其作为target。这对于黑盒监控(blackbox)很有用

#### 可用标签
- `__meta_kubernetes_namespace`: service所在的命名空间
- `__meta_kubernetes_service_annotation_<annotationname>`: k8s中service的注解
- `__meta_kubernetes_service_annotationpresent_<annotationname>`: 注解存在则为true
- `__meta_kubernetes_service_cluster_ip`: k8s中service的clusterIP
- `__meta_kubernetes_service_external_name`: k8s中service的external_name
- `__meta_kubernetes_service_label_<labelname>`: k8s中service的标签
- `__meta_kubernetes_service_labelpresent_<labelname>`: 标签存在则为true
- `__meta_kubernetes_service_name`: k8s中service的名称
- `__meta_kubernetes_service_port_name`: k8s中service的端口
- `__meta_kubernetes_service_port_protocol`: k8s中service的端口协议
- `__meta_kubernetes_service_type`: k8s中service的类型

---


### 3. pod
`pod`角色可以发现所有pod并将其中的pod ip作为target。如果有多个端口或者多个容器，将生成多个target(例如:80,443这两个端口,pod ip为10.0.244.22,则将10.0.244.22:80,10.0.244.22:443分别作为抓取的target)。
如果容器没有指定的端口，则会为每个容器创建一个无端口target，以便通过relabel手动添加端口。

- `__meta_kubernetes_namespace`: pod所在的命名空间
- `__meta_kubernetes_pod_name`: pod的名称
- `__meta_kubernetes_pod_ip`: pod的ip
- `__meta_kubernetes_pod_label_<labelname>`: pod的标签
- `__meta_kubernetes_pod_labelpresent_<labelname>`: 标签存在则为true
- `__meta_kubernetes_pod_annotation_<annotationname>`: pod的注解
- `__meta_kubernetes_pod_annotationpresent_<annotationname>`: 注解存在则为true
- `__meta_kubernetes_pod_container_init`: 如果容器是InitContainer，则为true
- `__meta_kubernetes_pod_container_name`: 容器的名称
- `__meta_kubernetes_pod_container_port_name`: 容器的端口名称
- `__meta_kubernetes_pod_container_port_number`: 容器的端口号
- `__meta_kubernetes_pod_container_port_protocol`: 容器的端口协议
- `__meta_kubernetes_pod_ready`: pod的就绪状态，true或false。
- `__meta_kubernetes_pod_phase`: pod的生命周期状态.`Pending`, `Running`, `Succeeded`, `Failed` or `Unknown`
- `__meta_kubernetes_pod_node_name`: pod所在node节点名称
- `__meta_kubernetes_pod_host_ip`: pod所在node节点ip
- `__meta_kubernetes_pod_uid`: pod的uid
- `__meta_kubernetes_pod_controller_kind`: pod控制器的类型`ReplicaSet `,`DaemonSet`,`Job`,`StatefulSet`...
- `__meta_kubernetes_pod_controller_name`: pod控制器的名称

---


### 4. endpoints
`endpoints`角色可以从ep列表中发现target。对于每个ep地址和端口都会发现target。如果端点由Pod支持，则该Pod的所有其他容器端口（未绑定到端点端口）也将作为目标。

#### 可用标签
- `__meta_kubernetes_namespace `: ep对象所在的命名空间
- `__meta_kubernetes_endpoints_name `: ep的名称

- 直接从ep对象的列表中获取的所有target，下面的标签将会被附加上
  - `__meta_kubernetes_endpoint_hostname`:  ep的主机名
  - `__meta_kubernetes_endpoint_node_name`: ep的node节点名
  - `__meta_kubernetes_endpoint_ready`: ep的就绪状态，true或false。
  - `__meta_kubernetes_endpoint_port_name`: ep的端口名称
  - `__meta_kubernetes_endpoint_port_protocol`: ep的端口协议
  - `__meta_kubernetes_endpoint_address_target_kind`: ep对象的目标类型，比如Pod
  - `__meta_kubernetes_endpoint_address_target_name`: ep对象的目标名称，比如pod名称
- 如果ep是属于service的话,则会附加`service`角色的所有标签
- 对于ep的后端节点是pod，则会附加`pod`角色的所有标签(即上边介绍的pod角色可用标签)
比如我么手动创建一个ep，这个ep关联到一个pod，则prometheus的标签中会包含这个`pod`角色的所有标签
```
apiVersion: v1
kind: Endpoints
metadata:
  name: ep-test
subsets:
  - addresses:
    - ip: 10.244.3.18
      nodeName: test-k8s-node3
      targetRef:
        kind: Pod
        name: mysql-hcrr6
        namespace: default
    ports:
    - name: mysql
      port: 3306
```

---

### 5. ingress
`ingress`角色发现ingress的每个路径的target。这通常对黑盒监控很有用。该地址将设置为ingress中指定的host。

#### 可用标签
- `__meta_kubernetes_namespace`: ingress所在的命名空间
- `__meta_kubernetes_ingress_name`: ingress的名称
- `__meta_kubernetes_ingress_label_<labelname>`: ingress的标签
- `__meta_kubernetes_ingress_labelpresent_<labelname>`: 标签存在则为true
- `__meta_kubernetes_ingress_annotation_<annotationname>`: ingress的注解
- `__meta_kubernetes_ingress_annotationpresent_<annotationname>`: 注解存在则为true
- `__meta_kubernetes_ingress_scheme`: ingress的协议，如果设置了tls则是https,默认http
- `__meta_kubernetes_ingress_path`: ingress中指定的的路径。默认为/

---

## 二、配置文件:
```
# 抓取指标配置
# 抓取配置
scrape_configs:
  # 任务名称
  - job_name: node_exporter
    kubernetes_sd_configs:
    # 通过node角色发现目标ip端口
    - role: node
    # 重写标签
    relabel_configs:
    # 将目标地址的端口改为node_exporter的端口
    - source_labels: [__address__]
      regex: "(.*):10250"
      target_label: __address__
      replacement: "${1}:9100"
    # 将正则匹配的标签名称，替换原标签名称.(replacement默认是$1),下面的内容就相当于将`__meta_kubernetes_node_label_xxxx`替换为xxxx
    - action: labelmap
      regex: "__meta_kubernetes_node_label_(.*)"

  # 任务名称，这里抓取的是kubelet的指标(默认10250端口)，可以通过curl获取: curl -k 'https://localhost:10250/metrics' --header 'Authorization: Bearer xxxxx'
  - job_name: 'kubernetes-kubelet'
    # 指定通过https还是http抓取指标，默认http
    scheme: https
    tls_config:
      # 用于验证API服务器证书的CA证书。
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      # 如果证书是自签名的,则需要跳过校验
      insecure_skip_verify: true
    # 访问metric api的token，这里对应的就是k8s的serviceaccount，权限可自行配置
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    kubernetes_sd_configs:
    - role: node
    relabel_configs:
    - action: labelmap
      regex: __meta_kubernetes_node_label_(.+)


 # 这里抓取的是cadvisor指标，提供容器相关的指标
  - job_name: 'kubernetes-cadvisor'
    kubernetes_sd_configs:
    - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      insecure_skip_verify: true
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
    - action: labelmap
      regex: __meta_kubernetes_node_label_(.+)
      # 修改__metrics_path__标签，会改变metrics的抓取路径。也可以使用kubelet-ip:10250/metrics/cadvisor来抓取
    - action: replace
      source_labels: [__meta_kubernetes_node_name]
      regex: (.*)
      target_label: __metrics_path__
      replacement: /api/v1/nodes/${1}/proxy/metrics/cadvisor
    - action: replace
      source_labels: [__address__]
      target_label: __address__
      replacement: kubernetes.default.svc:443
    metric_relabel_configs:
    - regex: kernelVersion
      action: labeldrop

  # 监控api-server
  - job_name: 'kubernetes-api-services'
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    kubernetes_sd_configs:
    - role: endpoints
    relabel_configs:
    - action: replace
      source_labels: [__address__]
      target_label: __address__
      replacement: kubernetes.default:443
    - action: keep
      source_labels: [__meta_kubernetes_namespace,__meta_kubernetes_endpoint_port_name,__meta_kubernetes_service_name]
      regex: default;https;kubernetes
    - action: labelmap
      regex: __meta_kubernetes_(.+)

  # 获取kube-state-metrics提供的指标
  - job_name: 'kubernetes-service-endpoints'
    kubernetes_sd_configs:
    - role: endpoints
    relabel_configs:
    # 保留__meta_kubernetes_service_annotation_prometheus_io_scrape=true的标签
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    # 将__address__的端口替换为注解中指定的端口
    - action: replace
      source_labels: [__address__,__meta_kubernetes_service_annotation_prometheus_io_port]
      target_label: __address__
      regex: (.*?):(\d+);(\d+)
      replacement: ${1}:${3}
    # 获取scheme,并将匹配的结果写入__scheme__标签中
    - action: replace
      source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
      target_label: __scheme__
      regex: (https?)
    # 将__metrics_path__的结果替换为注解中的metrics指定的路径
    - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
    - action: labelmap
      regex: __meta_kubernetes_service_label_(.+)
    - source_labels: [__meta_kubernetes_namespace]
      action: replace
      target_label: kubernetes_namespace
    - source_labels: [__meta_kubernetes_service_name]
      action: replace
      target_label: kubernetes_name

  # 抓取nginx-ingress的metrics
  - job_name: 'ingress-nginx'
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    kubernetes_sd_configs:
    - role: service
      namespaces:
        names:
          - ingress-nginx
    relabel_configs:
      - source_labels: [__address__]
        regex: (.*)10254
        action: keep
```

官方示例Prometheus配置文件：https://github.com/prometheus/prometheus/blob/release-2.23/documentation/examples/prometheus-kubernetes.yml


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2180/  

