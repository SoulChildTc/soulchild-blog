# Filebeat自动发现配置


<!--more-->

### 自动发现

通过调用 docker 或 k8s api 发现容器或 pod, 根据获取到的信息配置如何收集日志

在 filebeat.yml 配置文件的 filebeat.autodiscover 部分中定义自动发现配置.要使用自动发现, 您需要指定 Provider .

### Provider

自动发现支持多个 Provider, 目前有 Kubernetes , Docker , Jolokia 提供商实现了在特定平台上监视事件的方式。一旦有事件发生, Provider 会发布一个自动发现事件，其中包含您可能需要的信息, 比如容器名等信息

#### Docker

- `host` (可选项) Docker socket(UNIX 或 TCP socket)。默认 `unix:///var/run/docker.sock`

- `ssl` (可选项) 连接到 Docker socket 时使用的 SSL 配置

- `cleanup_timeout` (可选项) 一个容器在无活动状态多长时间后停止运行自动发现配置, 以节省资源并避免不必要的监视。默认为 60 秒。

- `labels.dedot` 默认为 false。如果设置为 true，则将标签中的 `.` 替换为 `_`。

收集到的信息中会在`docker`字段中附加如下额外信息:

- host
- port
- docker.container.id
- docker.container.image
- docker.container.name
- docker.container.labels

##### 配置模板 - templates

```yaml
filebeat.autodiscover:
  providers:
    - type: docker
      templates: # 当指定的条件符合时, 要如何采集日志
        - condition:
            contains:
              docker.container.image: redis # 
          config:
            - type: container
              paths:
                - /var/lib/docker/containers/${data.docker.container.id}/*.log
              exclude_lines: ["^\\s+[\\-`('.|_]"]  # drop asciiart lines
```

> templates 可以理解配置 filebeat input 模板, 模板可以有多个, 当 filebeat 获取到容器信息后, 会对每个容器进行条件判断, 如果符合条件就应用 config 中的配置

> 上面的例子: 如果容器的镜像为 redis, 就会应用 config 中的配置, config 中的配置可以是普通的 input , 也可以是 module .

> 在配置模板中可以使用自动发现事件的变量。可以在 data 命名空间下访问它们。例如，${data.port} 将会获取容器的端口号

module 示例

```yaml
filebeat.autodiscover:
  providers:
    - type: docker
      templates:
        - condition:
            contains:
              docker.container.image: redis
          config:
            - module: redis
              log:
                input:
                  type: container
                  paths:
                    - /var/lib/docker/containers/${data.docker.container.id}/*.log
```

#### Kubernetes

Kubernetes 自动发现提供程序监视 Kubernetes node、pod、service 的创建、更新和删除

- `node` (可选项) 我理解为当前配置对哪个 k8s 节点生效。可以设置为 ${NODE_NAME} , 他会读取环境变量, 因为部署 ds 的时候已经配置的这个变量, 所以每个节点的 NODE_NAME 都是他自己, 这样就做到了所有节点都生效这个配置

- `namespace` (可选项) 配置可以发现哪些名称空间下的资源, 如何明确只收集某一个 namespace 的日志, 指定它可以减少 apiserver 的压力

- `cleanup_timeout` (可选项) 一个容器在无活动状态多长时间后停止运行自动发现配置, 以节省资源并避免不必要的监视。默认为 60 秒。

- `kube_config` (可选项) 指定 kubeconfig 配置文件路径, 如果没配置则会读取 KUBECONFIG 环境变量, 如果环境变量不存在就会采用 incluster 的方式连接 apiserver

- `kube_client_options` 限制请求 apiserver 的并发, [官方文档](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-autodiscover.html#_kubernetes)

- `resource` (可选项) 选择要进行发现的资源。目前支持的 Kubernetes 资源有 pod、service 和 node。如果没有配置，资源默认为 pod. 现在还不确定 node 和 service 的使用场景. 如果要使用 service 自动发现, scope 要为 cluster 。service 必须要有 ClusterIP, 没有 ClusterIP 的 service 会被忽略

- `scope` (可选项) node 或 cluster。 节点范围允许发现当前节点中的资源(pod, node)。集群范围允许集群范围内的发现(service)。

- `include_annotations` 对发现的资源进行管理元数据(比如Pod), 指定要包含的注解, 最终会保存在事件中kubernetes.annotations字段中

- `include_labels` 对发现的资源进行管理元数据(比如Pod), 指定要包含的标签, 最终会保存在事件中kubernetes.labels字段中

- `exclude_labels` 对发现的资源进行管理元数据(比如Pod), 指定要排除的标签

- `labels.dedot` 默认true, 将标签中的 `.` 替换为 `_` 保存在事件中。对于匹配条件请继续使用 `.` 而不是 `_`

- `annotations.dedot` 默认true, 同上

- `add_resource_metadata` 管理额外添加的 k8s 元数据

  - `node` or `namespace` 对于 node 和 namespace 资源, 默认情况下, 包含label，但不包含annotation。可以定义 `include_labels`, `exclude_labels` 和 `include_annotations` 添加删除你想要的元数据。 也可以通过 `enabled: false` 来禁用额外的元数据

  - `deployment` 如果发现的资源是 pod 并且它是从 deployment 创建的，默认情况下会添加 deployment 名称，可以通过 `deployment: false` 禁用。老版本应该不会添加 deployment 名称, 请自行查阅官方文档

  - `cronjob` 同上, 禁用参数 `cronjob: false`

配置示例

```yaml
      add_resource_metadata:
        namespace:
          # enabled: false
          include_labels: ["namespacelabel1"]
        node:
          # enabled: false
          include_labels: ["nodelabel2"]
          include_annotations: ["nodeannotation1"]
        deployment: false
        cronjob: false
```

- `unique` (可选项) 默认为 false。只有获得 `leader_lease` 时才启用所提供的 templates 配置。此设置只能与 `scope: cluster` 结合使用。当启用 unique 时，不会考虑 resource 和 add_resource_metadata 参数的设置。

- `leader_lease` 租约锁的名称

##### 配置模板

和 Docker 部分一样

### 基于 Hints 的自动发现配置

Filebeat 支持根据 provider 的 Hints 进行自动发现配置。Hints 是啥意思啊？ 在 k8s 中是 annotations , 在 docker 中是拥有 `co.elastic.logs` 前缀的 label

支持的 Hints 如下:

- `co.elastic.logs/enabled` Filebeat 默认从所有容器获取日志，设置为 false 以忽略容器或 Pod 的输出。 如果默认配置被禁用，使用此注释仅对设置为 true 的容器启用日志检索。下面是一个例子

```yaml
    filebeat.autodiscover:
      providers:
        - type: kubernetes
          node: ${NODE_NAME}
          hints.enabled: true
          hints.default_config:
            type: container
            paths:
              - /var/log/containers/*${data.kubernetes.container.id}.log
            enabled: false # 将默认配置修改为 false
```

> 当你的 pod 中包含 co.elastic.logs/enabled: "true" 注解的时候, 只会采集这个 Pod 的日志

- `co.elastic.logs/multiline.*` 配置多行解析, 可以参考之前的文章. [ELK-filebeat 配置多行解析 (四)](https://www.soulchild.cn/post/2256/)

```yaml
annotations:
  co.elastic.logs/multiline.pattern: '^\['
  co.elastic.logs/multiline.negate: true
  co.elastic.logs/multiline.match: after
```

- `co.elastic.logs/json.*` 配置 json 解析, 如果input类型是filestream 请参考 [ndjson](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-filestream.html#filebeat-input-filestream-ndjson) , 如果是 container 或 log 可以参考之前文章的 json 部分 [ELK-filebeat 配置 input (三)](https://www.soulchild.cn/post/2248/)

- `co.elastic.logs/include_lines` 只收集哪些行

- `co.elastic.logs/exclude_lines` 排除哪些行

- `co.elastic.logs/module` 使用 module 功能

  - `co.elastic.logs/fileset` 配置 module 后，将容器日志映射到 module 文件集。您可以像这样配置单个文件集:

```yaml
  co.elastic.logs/fileset: access
```

或者在容器中为每个流配置一个文件集(stdout和stderr)

```yaml
co.elastic.logs/fileset.stdout: access
co.elastic.logs/fileset.stderr: error
```

- `co.elastic.logs/raw` 将 filebeat input 的配置转换成json字符串形式表示, 就不需要写其他的 hints 了, 比如使用docker类型的input + 一些其他配置, 可以写成如下:

```yaml
co.elastic.logs/raw: "[{\"containers\":{\"ids\":[\"${data.container.id}\"]},\"multiline\":{\"negate\":\"true\",\"pattern\":\"^test\"},\"type\":\"docker\"}]"
```

- `co.elastic.logs/processors` 配置处理器, 略. [官方文档](https://www.elastic.co/guide/en/beats/filebeat/current/configuration-autodiscover-hints.html#_co_elastic_logsprocessors)

- `co.elastic.logs/pipeline` 略

- `co.elastic.logs/number.xxx` 生成多个 input， 比如

```yaml
annotations:
  co.elastic.logs/exclude_lines: '^DBG'  # 第一个 input
  co.elastic.logs/1.include_lines: '^DBG' # 第二个 input 
  co.elastic.logs/1.processors.dissect.tokenizer: "%{key2} %{key1}" # 第二个 input 的处理器
```

- `co.elastic.logs.container_name/xxx` 设置不同容器的input, 比如

```yaml
annotations:
  co.elastic.logs/multiline.pattern: '^\[' # 默认容器
  co.elastic.logs/multiline.negate: true # 默认容器
  co.elastic.logs/multiline.match: after # 默认容器
  co.elastic.logs.sidecar/exclude_lines: '^DBG' # sidecar 容器
```

#### Kubernetes

##### 启用 hints 功能

```yaml
filebeat.autodiscover:
  providers:
    - type: kubernetes
      hints.enabled: true
```

上面只是使用的自动发现的功能, 如果 Pod 没有提供注解, 那么也不会进行收集, 所以还需加一下默认配置, 如下

```yaml
filebeat.autodiscover:
  providers:
    - type: kubernetes
      hints.enabled: true
      hints.default_config: # 默认 input 配置
        type: container
        paths:
          - /var/log/containers/*-${data.container.id}.log
```

### 高级用法 Appenders

由于很多配置是动态生成自动发现的, 我们可以对这些动态的配置进行追加配置, 比如

```yaml
filebeat.autodiscover:
  providers:
    - type: kubernetes
      templates:
        ...
      appenders:
        - type: config
          condition.equals:
            kubernetes.namespace: "prometheus"
          config:
            fields:
              type: monitoring
```

> 这个配置会发现如果名称空间是 prometheus , 就会增加 fiels 配置. config 也是写 filebeat input 的配置, 可以自由发挥.


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/709090325/  

