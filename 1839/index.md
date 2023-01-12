# helm模板开发-hooks(七)

<!--more-->
Helm提供了一种hook机制，以允许chart开发人员在release的生命周期的某些时间进行干预。例如，您可以使用hook执行以下操作：

- 在加载任何其他chart之前，在安装期间加载ConfigMap或Secret。
- 在安装新chart之前，执行作业备份数据库，然后在升级后,执行第二个作业还原数据。
- 在删除release之前，在删除release之前适当地停止其他服务。

hook使用注解来定义，例如：
```
apiVersion: ...
kind: ....
metadata:
  annotations:
    "helm.sh/hook": "pre-install"
# ...
```

## 可用的hooks
- `pre-install`: 在渲染模板之后,在Kubernetes中创建任何资源之前执行。
- `post-install`: 将所有资源加载到Kubernetes之后执行
- `pre-delete`: 在从Kubernetes删除任何资源之前执行
- `post-delete`: 删除所有release资源后执行
- `pre-upgrade`: 在渲染模板之后，但在任何资源加载到Kubernetes之前执行
- `post-upgrade`: 升级所有资源后执行
- `pre-rollback`: 在模板渲染后，回滚之前执行
- `post-rollback`: 回滚之后执行
- `crd-install`: 在运行任何其他检查之前添加CRD资源。这仅在chart中其他清单所使用的CRD定义上使用。
- `test-success`: 在运行`helm test`,Pod返回成功(返回码==0)执行
- `test-failure`: 在运行`helm test`,Pod返回失败(返回码!=0)执行

## hook的生命周期
hooks使chart开发人员 有机会在release生命周期的关键时刻执行特定的操作。
例如，`helm install`的生命周期。默认情况下，生命周期如下：
1. 运行`helm install foo`
2. chart加载到tiller中
3. 经过验证后，tiller渲染foo模板
4. tiller将产生的资源加载到Kubernetes中
5. titler返回release名称和一些其他数据给helm客户端
6. helm客户端退出

Helm为`install`生命周期定义了两个hooks：`pre-install`和`post-install`。如果foo chart的开发人员使用了这两个hook，那么生命周期的更改如下：
1. 运行`helm install foo`
2. chart加载到tiller中
3. 经过验证后，tiller渲染foo模板
4. tiller准备执行`pre-install`(将hook资源加载到Kubernetes中)
5. tiller按权重对hook进行排序(默认情况下权重为0),并按名称对具有相同权重的hook按升序排序。
6. tiller加载最小权重的hook
7. tiller等待hook准备好为止(CRD资源除外)
8. tiller将产生的资源加载到Kubernetes中。`注意`:如果设置了--wait参数，Tiller将等待所有资源处于就绪状态，并且在它们就绪之前不会运行`post-install`挂钩。
9. tiller执行`post-install`(将hook资源加载到Kubernetes中)
10. tiller等待hook准备好为止
11. titler返回release名称和一些其他数据给helm客户端
12. helm客户端退出

上面提到的`tiller等待hook准备好为止`是什么意思？
这取决于hook中声明的资源。如果资源是一个`job`类型，tiller就会等待job成功运行，如果job失败了，这个release失败，这是一个阻塞操作，因此Helm客户端将在运行job时暂停。

对于所有其他类型的资源，只要Kubernetes将资源标记为已加载（添加或更新），资源就被视为“就绪”。
当在一个hook中声明许多资源时，这些资源将被串行执行。如果它们有hook权重(见下文)，则按权重顺序执行。否则，不能保证执行顺序。（在Helm 2.3.0和之后的版本中，它们是按字母顺序排序的。)

添加hook权重被认为是一个好的实践，如果权重不重要，则将其设置为0。

## hooks资源是不受版本管理的
hooks创建的资源不会作为release的一部分进行跟踪或管理。一旦Tiller确认hook已达到就绪状态，就不会在管这个hook资源了

实际上，这意味着如果在hook中创建资源，就不能依赖`helm delete`来删除资源。要销毁这些资源，您需要在`pre-delete`或`post-delete`hook中编写执行此操作的代码，或者添加`"helm.sh/hook-delete-policy"`注解到hook模板文件。

##编写一个hook
hook只是Kubernetes清单文件，在`metadata`部分有特殊注解。因为它们是模板文件，所以可以使用所有常规模板功能，包括读取`.Values`、`.Release`和`.Template`。

比如，这个模板文件在`templates/post-install-job.yaml`,声明了hook `post-install`，要运行一个job。
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{.Release.Name}}"
  labels:
    app.kubernetes.io/managed-by: {{.Release.Service | quote }}
    app.kubernetes.io/instance: {{.Release.Name | quote }}
    helm.sh/chart: "{{.Chart.Name}}-{{.Chart.Version}}"
  annotations:
    # 如果没有下面的注解，这个job将作为release的一部分
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{.Release.Name}}"
      labels:
        app.kubernetes.io/managed-by: {{.Release.Service | quote }}
        app.kubernetes.io/instance: {{.Release.Name | quote }}
        helm.sh/chart: "{{.Chart.Name}}-{{.Chart.Version}}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{default "10" .Values.sleepyTime}}"]
```

使此模板成为hook的注解：
```
  annotations:
    "helm.sh/hook": post-install
```

一个资源可以实现多个hook，例如:
```
annotations:
    "helm.sh/hook": post-install,post-upgrade
```
`当subcharts声明hook时，也会执行。顶级chart无法禁用subcharts声明的hook。`

可以为hook定义一个权重，这将有助于确定执行顺序。使用以下注解定义权重：
```
  annotations:
    "helm.sh/hook-weight": "5"
```
hook的权重可以是正数或负数，但必须表示为字符串。优先执行权重小的hook
-

我们还可以定义何时删除相应hook资源的策略。hook删除策略使用以下注解定义：
```
  annotations:
    "helm.sh/hook-delete-policy": hook-succeeded
```
可选的注解值：
- `"hook-succeeded"`: 在hook执行成功后，tiller删除对应的hook资源。
- `"hook-failed"`: 在hook执行失败后，tiller删除对应的hook资源。
- `"before-hook-creation"`: 在启动新hook之前，tiller删除上一次执行后hook资源。

`helm.sh/hook-delete-timeout`注解。该值是tiller应等待hook完全删除的秒数。值为0表示tiller不等待。默认情况下，Tiller将等待60秒。


## 自动从以前的版本删除hook
当release被更新时，hook资源可能已经存在于集群中。在这种情况下，helm会抛出`"... already exists"`错误。

hook资源已经存在的一个常见原因是，在以前的install/upgrade中使用hook资源后，没有将其删除。事实上，有充分的理由可以解释为什么人们想要保留hook：例如，需要手动调试，以防出错。在这种情况下，为了确保后续创建的hook不会失败的建议方法是定义一个`"hook-delete-policy"`，该策略可以处理：`"helm.sh/hook-delete-policy": "before-hook-creation"`。此hook注解会导致在安装新hook之前移除任何现有hook。







---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1839/  

