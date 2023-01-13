# tekton学习-pipeline资源对象(三) 

<!--more-->
## 概述
pipeline由一个或多个task对象组成,并可以按照特定的顺序执行,pipeline只是定义的作用,不会真正的运行,运行需要pipelinerun对象。
官方文档: https://tekton.dev/vault/pipelines-v0.18.1/pipelines


## 一、对象属性

- 必须:
  - apiVersion - tekton.dev/v1beta1.
  - kind - Pipeline
  - metadata - 略
  - spec - pipeline对象的详细配置
    - tasks - 指定组成pipeline的task及其执行的详细信息


- 可选:
  - resources - 声明当前pipeline所需的资源，由pipelinerun提供具体内容，在tasks中的任务可以指定使用这个资源
  - workspaces - 声明当前pipeline所需的workspace
  - params - 声明当前pipeline所需的参数
  - results - task可以在执行后配置results。pipeline可以使用这些results
  - finally - 指定要在所有task执行完成后需要并行执行的一个或多个任务。




## 二、常见属性介绍
### resources/workspaces/params
在pipeline中不仅可以直接给task提供参数(见下面的tasks介绍)，还可以通过声明的方式向pipelinerun来索要,然后在tasks中给它们赋值,注意params需要使用变量替换的方式，workspace和resource可以直接使用声明的名称。例子如下:
```yaml
spec:
  resources:
    - name: code  # 需要pr给我们传一个git类型的资源
      type: git
  workspaces:
    - name: dockerconfig  # 需要pr给我们传一个工作空间(可选)
      optional: true
  params:
    - name: image # 需要pr给我们传一个image参数
  tasks:
    - name: build-the-image
      taskRef:
        name: build-push
      workspaces: 
      - name: dockerconfig  # 引用上面声明的dockerconfig workspace，传递给task中的dockerconfig workspace
        workspace: dockerconfig
      params:
        - name: pathToDockerFile
          value: Dockerfile
        - name: pathToContext
          value: /workspace/examples/microservices/leeroy-web
        - name: image
          value: $(params.image)  # 引用上面声明的image参数，传递给task中的image参数
      resources:
        inputs:
          - name: my-repo  # 引用上面声明的code resource，传递task中input类型的my-repo resource
            resource: code
```
> 先声明在引用

### tasks
tasks用于指定当前pipeline中包含哪些task,以及一些运行规则等等。

#### 1.params、resources、workspaces
提供task需要的运行参数、资源。可以像下面这样配置
```
spec:
  tasks:
    - name: build-the-image
      taskRef:
        name: build-push
      params:
        - name: pathToDockerFile
          value: Dockerfile
        - name: pathToContext
          value: /workspace/examples/microservices/leeroy-web
      resources:
        inputs:
          - name: workspace
            resource: my-repo
        outputs:
          - name: image
            resource: my-image
```

#### 2.from
如果pipeline中的task需要使用前一个task的输出作为输入,from也可以达到控制task执行顺序的效果
```yaml
- name: build-app
  taskRef:
    name: build-push
  resources:
    outputs:
      - name: image
        resource: my-image
- name: deploy-app
  taskRef:
    name: deploy-kubectl
  resources:
    inputs:
      - name: image
        resource: my-image
        from:
          - build-app
```
> 部署task需要在构建镜像task之后执行。可以看到给部署task提供input资源，是从构建镜像task的输出中获取的。
> from是个数组类型,可以指定多个task来控制顺序，但resource获取的是最后一个task的。(我的猜测)

#### 3.runAfter
表示当前任务在某任务执行后开始执行，也是用于控制task的执行顺序的。
```yaml
- name: test-app
  taskRef:
    name: make-test
- name: build-app
  taskRef:
    name: kaniko-build
  runAfter:
    - test-app
```
> build-app在test-app之后执行

#### 4.retries
指定某个task在执行失败后重试的次数
```yaml
tasks:
  - name: build-the-image
    retries: 1
    taskRef:
      name: build-push
```

#### 4.When
when表达式可以用来判断task是否要执行。
when中可以使用
`Input`: 是when表达式的输入，它可以是静态内容或变量（params或results）。如果未提供输入，则默认为空字符串。
`Operator`: 运算符。可用`in`和`notin`
`Values`: 一个字符串值数组,必须提供数组值，并且该数组不能为空。它可以使用静态内容或变量（params、results或工作区的绑定状态）

下面是示例: 
```yaml
tasks:
  - name: first-create-file
    when: # 当参数path的值是README.md才会运行这个task
      - input: "$(params.path)"
        operator: in
        values: ["README.md"]
    taskRef:
      name: first-create-file
---
tasks:
  - name: echo-file-exists
    when: # 当check-file任务的结果中exists的值是yes，才会运行这个task
      - input: "$(tasks.check-file.results.exists)"
        operator: in
        values: ["yes"]
    taskRef:
        name: echo-file-exists
---
tasks:
  - name: run-lint
    when:  # 如果pipelinerun提供了lint-config workspace则会运行这个task
      - input: "$(workspaces.lint-config.bound)" # 工作区是否绑定，就是pipelinerun是否提供了workspace卷。
        operator: in
        values: ["true"]
    taskRef:
      name: lint-source
```
> 可以定义一些用于检查的task,将结果给result,再通过result来决定是否要运行当前task


### resources
#### pipeline需要用pipelineresource为组成它的task提供输入和输出
```yaml
spec:
  resources:
    - name: my-repo
      type: git
    - name: my-image
      type: image
```


### results
有两种用法,在使用

#### 1.在pipeline中的task可以调用另外一个task的result，使用方法`$(tasks.<task-name>.results.<result-name>)`。由于存在这种调用关系，就需要有先后执行顺序，在使用了result引用后，tekton会确保被引用的task先执行。

例如：

在下面的配置中,从checkout-source这个task中获取commit结果。 Tekton 将确保 checkout-source 任务在build任务之前运行。
```yaml
tasks:
- name: build
    taskRef:
      name: build
  params:
  - name: foo
    value: "$(tasks.checkout-source.results.commit)"
```
> 注意: 如果checkout-source没有将结果写入result，那么build这个task就找不到commit这个结果了,最终Pipeline失败并显示 InvalidTaskResultReference: 
> `unable to find result referenced by param 'foo' in 'task';: Could not find result with name 'commit' for task run 'checkout-source'
`


#### 2. 将task的result作为pipeline的result，也可以组合多个result作为pipeline的result。最终的结果可以在pipelinerun的status.pipelineResults字段看到

例如:
第一个sum表示将task `calculate-sum`的`outputValue`结果，作为`pipelinerun`的result
第二个all-sum表示将两个结果组合在一起,注意不是相减是字符串的组合。
```yaml
spec:
  results:
    - name: sum
      description: the sum of all three operands
      value: $(tasks.calculate-sum.results.outputValue)
    - name: all-sum
      value: $(tasks.second-add.results.sum)-$(tasks.first-add.results.sum)
```


### finally
指定要在所有task执行完成后需要并行执行的一个或多个任务。
`finally task`与`task`非常相似，并遵循相同的语法。

注意点:
1. `finally task`会影响pipelinerun的运行状态。
2. 在`finally`的task中不能使用from
3. 不能控制执行顺序
4. 不能使用条件语句
5. 暂时不支持从task中获取result，即不能使用`$(tasks.checkout-source.results.commit)`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2632/  

