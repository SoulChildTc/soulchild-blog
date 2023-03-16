# Tekton Operator配置参数详解


<!--more-->

在使用 tekton-operator 的时候我们可以通过 TektonConfig CR 来安装tekton组件，其中有一些安装参数,过一遍留个印象
所有参数 https://tekton.dev/docs/pipelines/additional-configs/

## 官方模板
```yaml
apiVersion: operator.tekton.dev/v1alpha1
kind: TektonConfig
metadata:
  name: config
spec:
  targetNamespace: tekton-pipelines # tekton安装在哪个namespace
  profile: all # 安装哪些组件
  config: # pod调度相关
    nodeSelector: <>
    tolerations: []
  pipeline: # 单独介绍
    disable-affinity-assistant: false
    disable-creds-init: false
    disable-home-env-overwrite: true
    disable-working-directory-overwrite: true
    enable-api-fields: stable
    enable-custom-tasks: false
    enable-tekton-oci-bundles: false
    metrics.pipelinerun.duration-type: histogram
    metrics.pipelinerun.level: pipelinerun
    metrics.taskrun.duration-type: histogram
    metrics.taskrun.level: taskrun
    require-git-ssh-secret-known-hosts: false
    running-in-environment-with-injected-sidecars: true
  pruner: # 自动清理构建记录资源等
    resources: # 目前支持清理taskrun、pipelinerun
    - taskrun
    - pipelinerun
    keep: 3 # 保留个数
    schedule: "* * */1 * *" # 定时清理
  dashboard: # true为开启只读的dashboard
    readonly: false
```


### pipeline参数

TektonPipeline CR也可以用来安装Tekton Pipeline组件，但是官方建议的是使用TektonConfig来安装。

### 必选参数(含默认值)

#### disable-affinity-assistant(默认false)
设置为 `true` 将阻止 Tekton 为共享了 workspace 的每个 TaskRun 创建Affinity Assistant Pod。
这样就可以保证这些pod运行在同一个节点上，避免了跨节点访问pvc的问题。

#### disable-home-env-overwrite(默认true)
设置为 `false` Tekton 将覆盖 task 容器中 `$HOME` 环境变量为 `/tekton/home`。
ps: 老版本应该是默认覆盖的,应该是0.24.0版本开始变了

#### disable-working-directory-overwrite(默认true)
设置为 `false` Tekton 将覆盖 task 容器的工作目录(workingDir)。

#### disable-creds-init(默认false)
使用serviceAccount可以配置多个凭证，比如docker、git、ssh, 如果task使用了这个serviceAccount, 默认会在所有容器中将这些凭证转换成真正的目标配置文件，如果`disable-creds-init=true`, 则不会将serviceAccount中的凭证信息转换为配置文件。

注意：将此设置为 `true` 将阻止 PipelineResources 工作, PipelineResources我个人觉得不需要使用它

#### running-in-environment-with-injected-sidecars(默认true)
如果你的集群中没有使用自动注入相关的准入控制器,比如istio、dapr。应将此选项设置为false。这将会减少TaskRun的启动时间。

对于使用注入sidecars的集群，请设置为 `true` , 否则可能会导致意外行为。

#### require-git-ssh-secret-known-hosts(默认false)
设置为 `true` 将要求提供给Tekton的任何Git SSH Secret必须包含 known_hosts字段。
https://www.soulchild.cn/post/2638/#%E4%B8%8D%E5%90%8C%E5%AF%86%E7%A0%81%E7%9A%84%E6%83%85%E5%86%B5

#### enable-tekton-oci-bundles(默认false)
可以使用 Tekton Bundle 引用在集群外部定义的task或者pipeline镜像。
https://tekton.dev/docs/pipelines/taskruns/#tekton-bundles

#### enable-custom-tasks(默认false)
设置为 `true` 可以在pipeline中使用custom tasks。这是一个处于 alpha 的功能。

关于自定义任务, 如果你的任务不想以pod的形式运行，那么你可以使用自定义task
https://tekton.dev/docs/pipelines/runs/
https://tekton.dev/docs/pipelines/customruns/#customruns
https://tekton.dev/docs/pipelines/pipelines/#using-custom-tasks

#### enable-api-fields(默认stable)
决定启用哪些特性 `stable` or `alpha`

#### scope-when-expressions-to-task(默认false)
限制when条件语句的作用范围，比如A task 依赖 B task , B task 被when跳过了, 如果设置为true, A task 会执行, 设置为false A task 不会执行 


### metrics配置
https://tekton.dev/docs/pipelines/metrics/#configuring-metrics-using-config-observability-configmap

#### metrics.pipelinerun.duration-type(默认histogram)
pipeline运行持续时间的指标类型。gauge 或 histogram

#### metrics.pipelinerun.level(默认pipeline)
pipelinerun: 每个pipelinerun都会有一个独立的度量指标。
pipeline: 所有使用同一个pipeline模板的pipelinerun会共享一个度量指标。
namespace: 所有在同一个namespace下的pipelinerun会共享一个度量指标。


#### metrics.taskrun.duration-type(默认histogram)
taskrun运行持续时间的指标类型。gauge 或 histogram

#### metrics.taskrun.level(默认task)
taskrun: 每个taskrun都会有一个独立的度量指标。
task: 所有使用同一个task的taskrun会共享一个度量指标。
namespace: 所有在同一个namespace下的taskrun会共享一个度量指标。


### 可选配置

#### default-timeout-minutes(默认60)
taskrun、pipelinerun的超时时间，默认60分钟

#### default-service-account(默认default)
TaskRun和PipelineRun使用的默认 serviceAccount 名称(如果没有指定)。

#### default-managed-by-label-value(默认tekton-pipelines)
taskRun创建的Pod的 app.kubernetes.io/managed-by 标签的值

#### default-pod-template
Pod 模板定义了一部分 PodSpec 的配置，默认附加到运行的pod中，比如
```yaml
  default-pod-template: |
    securityContext:
      runAsNonRoot: true
```

#### default-cloud-events-sink
将taskRun、pipelineRun、Run的事件通过http发送到远端服务。

事件内容 https://tekton.dev/docs/pipelines/events/#events-via-cloudevents

配置示例 https://tekton.dev/docs/pipelines/additional-configs/#configuring-cloudevents-notifications

#### default-task-run-workspace-binding
如果Task声明了workspace，但TaskRun没有明确提供的workspace。当TaskRun执行时，会使用默认的配置来绑定workspace。
```yaml
  default-task-run-workspace-binding: |
    persistentVolumeClaim:
      claimName: source-pvc

  default-task-run-workspace-binding: |
    volumeClaimTemplate:
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 1Gi
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/tekton-operator%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0%E8%AF%A6%E8%A7%A3/  

