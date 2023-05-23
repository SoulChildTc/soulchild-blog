# Jenkins pipeline基础语法详解


<!--more-->

## 声明式流水线

### pipeline

在声明式管道中所有的内容都在pipeline中填写

```groovy
pipeline {
    /* insert Declarative Pipeline here */
}
```

> - 声明式管道中的部分通常包含一个或多个 [指令](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-directives)或[步骤](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-steps)。

### agent

允许配置在`pipeline`或`stage`中
指定 整个流水线 或者 某个阶段(步骤) 在哪个 环境(节点) 中执行。
在整个流水线中定义agent(**必须**)

```groovy
pipeline {
    agent any
}
```

在某个步骤中定义agent(**可选**)

```groovy
pipeline {
    agent none
    stages {
        stage('Example') {
            agent any
            steps {
                echo 'Hello World'
            }
        }
    }
}
```

#### any 

在任何可用的节点中执行这个管道或阶段。例如：`agent any`

#### none

当在流水线块的顶层使用none时，不会为整个流水线运行分配全局默认运行节点，每个阶段部分需要指定自己的节点。例如：`agent none`

#### label

根据标签匹配节点，例如`agent { label 'my-defined-label' }`
也可以使用条件，例如`agent { label 'my-label1 && my-label2' }`和`agent { label 'my-label1 || my-label2' }`

#### node

`agent { node { label 'labelName' } }` 和 `agent { label 'labelName' }`一样， 但是node可以配置额外的选项`customWorkspace`。

#### customWorkspace

自定义工作目录

```groovy
agent {
    node {
        label 'my-defined-label'
        customWorkspace '/some/other/path'
    }
}
```

#### docker

安装插件：`Docker`、`Docker Pipeline`
使用容器执行整个流水线个某个步骤，例如`agent { docker 'maven:3.9.0-eclipse-temurin-11' }`，下面的方式可以配置更多的选项

```groovy
agent {
    docker {
        image 'maven:3.9.0-eclipse-temurin-11'
        label 'my-defined-label' // 运行指定节点上的docker
        args  '-v /tmp:/tmp'
        registryUrl 'https://myregistry.com/'  // 自定义仓库
        registryCredentialsId 'myPredefinedCredentialsInJenkins' // 指定登录凭证
        alwaysPull true
    }
}
```

#### dockerfile

根据代码仓库的Dockerfile构建一个容器环境，用作执行整个流水线或某个步骤的节点

#### kubernetes

使用k8s的pod作为执行整个流水线或某个步骤的节点。

```groovy
agent {
    kubernetes {
        defaultContainer 'kaniko'
        yaml '''
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - sleep
    args:
    - 99d
    volumeMounts:
      - name: aws-secret
        mountPath: /root/.aws/
      - name: docker-registry-config
        mountPath: /kaniko/.docker
  volumes:
    - name: aws-secret
      secret:
        secretName: aws-secret
    - name: docker-registry-config
      configMap:
        name: docker-registry-config
'''
   }
```

> [https://github.com/jenkinsci/kubernetes-plugin/blob/master/examples/kaniko.groovy](https://github.com/jenkinsci/kubernetes-plugin/blob/master/examples/kaniko.groovy)

#### 其他

[https://www.jenkins.io/doc/book/pipeline/syntax/#agent](https://www.jenkins.io/doc/book/pipeline/syntax/#agent)

### post

允许配置在`pipeline`和`stage`中
可以在流水线或者某个阶段执行后 执行一些其他的动作, 比如当某个步骤执行成功要做什么，执行失败要做什么。
支持以下的条件

#### always

无论运行成功或失败都执行

#### changed

如果当前 Pipeline 的运行与上一次运行的完成状态不同，才运行

#### fixed

如果当前 Pipeline 的运行成功并且之前的运行失败或不稳定，才运行

#### regression

仅当前流水线的状态为失败、不稳定或中止且上一次运行成功时，才运行。

#### aborted

如果当前 Pipeline 的运行处于“中止”状态，才运行，通常是由于 Pipeline 被手动中止。这通常在 Web UI 中用灰色表示。

#### failure

仅当前流水线或阶段的运行处于“失败”状态时才运行，通常在 Web UI 中用红色表示。

#### success

仅当前流水线或阶段的运行状态为“成功”时才运行，通常在 Web UI 中用蓝色或绿色表示

#### unstable

如果当前 Pipeline 的运行处于“不稳定”状态，则运行，这通常是由测试失败、代码违规等引起的。这通常在 Web UI 中以黄色表示。

#### unsuccessful

如果当前流水线或阶段的运行状态不是“成功”，则运行

#### cleanup

在评估所有其他后置条件后，运行此后置条件中的步骤，无论管道或阶段的状态如何。

示例

```groovy
pipeline {
    agent {
        label 'mytest'
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
            post {   // 步骤中的post
                always {
                    echo "步骤中 always"
                }
                cleanup {
                    echo "步骤中 cleanup"
                }
            }
        }
    }
    post { // 整个流水线的post
        always {
            echo "always"
        }
        cleanup {
            echo "cleanup"
        }
    }
}
```

### stages/stage/steps

这里是流水线的核心，他们的关系是: 
全局有一个`stages`，它包含一个或多个`stage`，stage具有名称，每个`stage`包含一个`steps`

```groovy
pipeline {
    agent any
    stages { 
        stage('Example') {
            steps {
                echo 'Hello World'
                script {
                    ls -l
                    pwd
                }
            }
        }
    }
}
```

> stage可以包含stages，在并行或矩阵运行步骤时有用

关于step，在声明式pipeline中，可以使用很多内置和插件的语法，[https://www.jenkins.io/doc/pipeline/steps/](https://www.jenkins.io/doc/pipeline/steps/)。

### environment

允许配置在`pipeline`或`stage`中
[https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-directives](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-directives)
自定义环境变量，也从jenkins凭据中读取数据到环境变量，这个变量是被保护的哦!!!  也可以使用`withCredentials`插件获取([这里搜索](https://www.jenkins.io/doc/pipeline/steps/))

```groovy
pipeline {
    agent any
    environment { 
        CC = 'clang'
        PIPELINE_TEST = credentials('pipeline-test')   // 获取pipeline-test凭据的内容给PIPELINE_TEST，所有的步骤都能读取到
        IPADDR = sh(returnStdout: true, script: "hostname -I | awk '{print \$2}'").trim() // 执行命令获取
    }
    stages {
        stage('Example') {
            environment { 
                AN_ACCESS_KEY = credentials('pipeline-test') // 只有当前的步骤能读取到AN_ACCESS_KEY
            }
            steps {
                sh 'printenv'
            }
        }
    }
}
```

案例2 - 凭据中有多个内容

```groovy
pipeline {
    agent any
    stages {
        stage('Example Username/Password') {
            environment {
                SERVICE_CREDS = credentials('my-predefined-username-password') // 用户名和密码类型: 存入SERVICE_CREDS_前缀的变量中
            }
            steps {
                sh 'echo "Service user is $SERVICE_CREDS_USR"' // SERVICE_CREDS_USR 是用户名
                sh 'echo "Service password is $SERVICE_CREDS_PSW"' // SERVICE_CREDS_PSW 是密码
                sh 'curl -u $SERVICE_CREDS https://myservice.example.com'
            }
        }
        stage('Example SSH Username with private key') {
            environment {
                SSH_CREDS = credentials('my-predefined-ssh-creds') // ssh类型
            }
            steps {
                sh 'echo "SSH private key is located at $SSH_CREDS"' // SSH_CREDS 私钥
                sh 'echo "SSH user is $SSH_CREDS_USR"' // SSH_CREDS_USR 用户名
                sh 'echo "SSH passphrase is $SSH_CREDS_PSW"' // SSH_CREDS_PSW 密码
            }
        }
    }
}
```

### options

options允许配置在`pipeline`或`stage(只有部分选项)`中
很好的文章[https://cloudaffaire.com/jenkins-pipeline-part-5-options/](https://cloudaffaire.com/jenkins-pipeline-part-5-options/)
用于设置流水线和步骤

#### buildDiscarder

保留最近 n 个 Pipeline 运行历史记录`options { buildDiscarder(logRotator(numToKeepStr: '1')) }`

#### checkoutToSubdirectory

获取git仓库时，将代码拉到指定的目录中`options { checkoutToSubdirectory('MyCustomDir') }`
这里指的是拉取jenkinsfile仓库, 一般jenkinsfile会和代码放在一个仓库

#### disableConcurrentBuilds

禁止并行运行流水线，可以选择等待之前的流水线运行完毕`options { disableConcurrentBuilds() }`, 也可以选择终止上一个流水线`options { disableConcurrentBuilds(abortPrevious: true) }`

#### disableResume

如果一个流水线正在运行中，这时候jenkins发生了重启，默认启动后会恢复运行中的流水线， 使用disableResume则不允许流水线恢复。例如`options { disableResume() }`。jenkins重启了，但是agent不一定重启

#### newContainerPerStage

如果agent使用了 docker 或 dockerfile 。每个阶段将在同一节点上的新容器实例中运行，而不是所有阶段都在同一容器实例中运行。

#### overrideIndexTriggers

[https://www.jenkins.io/doc/book/pipeline/syntax/#options](https://www.jenkins.io/doc/book/pipeline/syntax/#options)

#### preserveStashes

在jenkins中可以使用stash保存指定的内容给后面的步骤使用，仅限于同一个流水线，作用就是 如果你想要 从指定阶段重新运行，正好流水线又需要unstash，那么可能会报错，因为之前的流水线已经运行完毕，stash的内容会被丢弃，而preserveStashes的作用就是保留它，需要指定保留最近几次构建的内容

```groovy
pipeline {  
    agent { label 'mytest' }
    options {  
        preserveStashes(buildCount: 2)
    }
    stages {    
        stage('one') {  
            steps {
                sh "mkdir input"
                writeFile file: "input/myfile${BUILD_NUMBER}", text: "Hello world!"
                stash name: "mystash", includes: "input/*"  // 用于将指定目录的内容暂存并提供给后面的阶段使用
                sh "rm -r input"
            }  
        }  
        stage('two') {  
            steps {
                sh "mkdir output"
                dir("output") {
                    unstash "mystash"  // 使用之前暂存的内容
                    sh "ls -lR ${pwd()}"
                }
                sh "rm -r output"
            }  
        }  
    }  
}
```

> 这个例子测试流程如下
>
> 1. 完整的运行流水线一次，比如他的构建ID是10
> 2. 进入构建ID为10的这个流水线，选择从指定阶段重新运行，选择two阶段。第一次正常运行
> 3. 重复步骤二。第二次正常运行
> 4. 重复步骤二。第三次运行失败，提示`No such saved stash ‘mystash’`

#### quietPeriod

设置静默期. 什么是静默期？当通过git webhook(或者其他手段) 触发构建后首先会处于静默期，静默期结束才会执行构建。如果在静默期内被触发多次构建，静默期结束也只会执行一次构建。例如`options { quietPeriod(30) }`

#### retry(global+stage)

失败时，重试整个流水线指定的次数. 例如`options { retry(3) }`

#### skipDefaultCheckout(global+stage)

目前测试下来就是，当jenkinsfile从git仓库获取时, 默认会拉取全部的内容到工作空间中，使用skipDefaultCheckout true就不会拉取, 但还是可以获取到jenkinsfile。
适用于我们的代码仓库和jenkinsfile不在一起的情况。其他情况可能需要配合多分支流水线

```groovy
pipeline {
  agent any
  options {
    skipDefaultCheckout true
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm // 手动执行
      }
    }
    stage('Hello') {
      steps {
        sh 'cat file.txt'
      }
    }
  }
}
```

#### skipStagesAfterUnstable

如果某个阶段不稳定，那么后续的阶段就不执行了，直接跳过

```groovy
pipeline {
    agent { label 'test' }
    options {  
        skipStagesAfterUnstable()
    }
    stages {
        stage('Stable') {
            steps {
                sh 'exit 0'
            }
        }
        stage('Unstable') {
            steps {
                unstable(message: "unknown error")
            }
        }
        stage('StableAgain') {
            steps {
                sh 'exit 0'
            }
        }
    }
}
```

#### timeout(global+stage)

为 Pipeline 运行设置一个超时时间，超时后自动终止流水线。例如`options { timeout(time: 1, unit: 'HOURS') }`

#### timestamps(global+stage)

在控制台输出中添加时间，例如 `options { timestamps() }`

#### parallelsAlwaysFailFast

设置后，如果某个并行步骤执行失败，后续的并行步骤就不执行了。配置示例`options { parallelsAlwaysFailFast() }`

### paramters

只能在pipeline块中配置一次。
[https://www.jenkins.io/doc/book/pipeline/syntax/#parameters](https://www.jenkins.io/doc/book/pipeline/syntax/#parameters)
用户交互相关，可以让用户输入内容

```groovy
pipeline {
    agent any
    parameters {
        string(name: 'PERSON', defaultValue: 'Mr Jenkins', description: '请输入一个字符串')

        text(name: 'BIOGRAPHY', defaultValue: '', description: '请输入长文本')

        booleanParam(name: 'TOGGLE', defaultValue: true, description: '请勾选')

        choice(name: 'CHOICE', choices: ['One', 'Two', 'Three'], description: '请选择一项')

        password(name: 'PASSWORD', defaultValue: 'SECRET', description: '请输入密码')
    }
    stages {
        stage('Example') {
            steps {
                echo "Hello ${params.PERSON}" // 不加params也可以${PERSON}

                echo "Biography: ${params.BIOGRAPHY}"

                echo "Toggle: ${params.TOGGLE}"

                echo "Choice: ${params.CHOICE}"

                echo "Password: ${params.PASSWORD}"
            }
        }
    }
}
```

### triggers

只能在pipeline块中配置一次。
定义自动触发流水线的方式

#### cron

定时触发，例如`triggers { cron('H */4 * * 1-5') }`

#### pollSCM

在jenkins中配置了从git或其他版本控制工具获取jenkinsfile时，定时检测仓库有没有变化，有变化就执行流水线。这种方式会对git之类的代码服务器造成一些压力。
使用示例：`triggers { pollSCM('H */4 * * 1-5') }`

#### upstream

如果其他项目执行成功，那么触发当前流水线。例如`triggers { upstream(upstreamProjects: 'upstream', threshold: hudson.model.Result.SUCCESS) }`， 当upstream这个job运行成功，那么就执行当前job。注意当前流水线需要手动执行一次, 后续才会自动触发

#### cron语法

[https://www.jenkins.io/doc/book/pipeline/syntax/#cron-syntax](https://www.jenkins.io/doc/book/pipeline/syntax/#cron-syntax)

### tools

tools允许配置在`pipeline`和`stage`中
使用全局工具中配置的工具，好处是可以指定不同的版本, 并且使用全局工具是可以有自动安装的功能。

```groovy
pipeline {
    agent { label 'mytest' }
    stages {
        stage('hello') {
            tools {
                dockerTool 'docker1'  // 这里会自动将全局工具中设置的目录添加到PATH中
            }
            steps {
                sh "env;docker version"
            }
        }
    }
}
```

### input

人工卡点

#### **message**

必需的。给用户的提示语。

#### id

此input的可选标识符。默认值基于阶段名称。

#### ok

设置确认按钮的文本

#### submitter

允许哪些用户提交，多个用户逗号分隔， 管理员总是能提交，默认所有人都能提交

#### **submitterParameter**

将输入input的用户ID存入环境变量中

#### parameters

自定义用户输入，请参考上面的parameters部分
完整示例

```groovy
pipeline {
    agent { label 'mytest' }
    stages {
        stage('dev') {
            steps {
              echo "building in dev env!"
            }
        }
        stage('prod') {
            input {
                message "Deploy in production?"
                ok "Deploy"
                submitter "alice" // 只允许alice用户提交
                parameters {
                    string(name: 'Version', defaultValue: 'v1.0.4', description: 'Build version?')
                }
            }
            steps {
                echo "deploying to production, version - $VERSION"
                sh "env"
            }
        }
    }
}
```

### when

只能在stage中使用
根据条件判断stage是否执行， 必须包含至少一个条件。如果 when 指令包含多个条件，则所有子条件都必须返回 true 才能执行该阶段。

#### branch

判断分支是否一致，例如`when { branch 'master' }`。请注意，这仅适用于多分支流水线。
更复杂的匹配模式，可以指定参数比较器：`EQUALS` 用于简单的字符串比较，`GLOB`（默认）用于 ANT 样式路径 glob，或 `REGEXP` 用于正则表达式匹配。例如正则比较器：`when { branch pattern: "release-\\d+", comparator: "REGEXP"}`

#### buildingTag

如果当前 git(或其他SCM) 提交有标签，则 buildingTag 运行这个阶段。这种情况受到未修复错误的影响，如果您发现它不起作用，您应该手动设置 TAG_NAME 环境变量。

#### changelog

匹配git(或其他SCM)的changelog， 例如`when { changelog '.*^\\[DEPENDENCY\\] .+$' }`

#### changeset

匹配git(或其他SCM)本次变更的文件，例如`when { changeset "**/*.js" }`
指定参数比较器`when { changeset pattern: ".TEST\\.java", comparator: "REGEXP" }` or `when { changeset pattern: "*/*TEST.java", caseSensitive: true }`

#### changeRequest

判断是否为更改请求，比如github PR、gitlab MR等,例如`when { changeRequest() }`

也可以判断一些额外的信息，他们包括`id`, `target`, `branch`, `fork`, `url`, `title`, `author`, `authorDisplayName`, `authorEmail`. 
其中每一个信息都对应一个 `CHANGE_*` 环境变量，例如：`when { changeRequest target: 'master' }`。

也可以指定参数比较器，例如`when { changeRequest authorEmail: "[\\w_-.]+@example.com", comparator: 'REGEXP' }`

#### environment

`when { environment name: 'DEPLOY_TO', value: 'production' }` 判断环境变量DEPLOY_TO的值是不是production

#### equals

当期望值等于实际值时执行阶段，例如`when { equals expected: 2, actual: currentBuild.number }`，`currentBuild.number`的值是2才会执行阶段。
currentBuild的属性在<http://jenkins.xxx.cn/job/xxx/pipeline-syntax/globals#currentBuild可以找到>

#### expression

当指定的 Groovy 表达式计算结果为真时执行该阶段，例如：`when { expression { return params.DEBUG_BUILD } }` 请注意，当从表达式返回字符串时，它们必须转换为布尔值或返回空值。简单地返回 "0" 或 "false" 仍将评估为 "true"。

#### tag

如果 TAG_NAME 变量与给定模式匹配，则执行该阶段。示例：`when { tag "release-*" }`。如果提供了一个空匹配，如果 TAG_NAME 变量存在,与 buildingTag() 相同，该阶段将执行。

也可以使用参数比较器，例如`when { tag pattern: "release-\\d+", comparator: "REGEXP"}`

#### not

取反，也就是当条件为假时执行该阶段。例如`when { not { branch 'master' } }`，分支不是master执行该阶段

#### allOf

所有条件必须为真，例如`when { allOf { branch 'master'; environment name: 'DEPLOY_TO', value: 'production' } }`

#### anyOf

或的关系，至少一个条件为真时执行该阶段，例如`anyOf { branch 'master'; branch 'staging' } }`

#### triggeredBy

当前流水线由指定的方式触发，才会执行该阶段

- `when { triggeredBy 'SCMTrigger' }` 应该是通过pollSCM触发的
- `when { triggeredBy 'TimerTrigger' }` 通过定时触发的
- `when { triggeredBy 'BuildUpstreamCause' }` 由上游构建触发
- `when { triggeredBy cause: "UserIdCause", detail: "vlinde" }` 由 vlinde 用户触发

#### 在当前阶段进入agent之前评估条件

默认情况下，如果定义了一个阶段的 when 条件，将在进入该阶段的agent后对其进行评估。
这可以通过在 when 块中将 `beforeAgent` 设置为 true 来更改。只有当 when 条件评估为 true 时才会进入代理，如果使用k8s这样的agent，可以免去不必要的pod创建启动

#### 在input指令之前评估条件

如果 `beforeInput` 设置为 true，则首先评估 when 条件，只有当 when 条件评估为 true 时才会执行input。

#### 在 options 指令之前评估 when

`beforeOptions`设置为true即可

#### 官方示例

[https://www.jenkins.io/doc/book/pipeline/syntax/#evaluating-when-before-the-options-directive](https://www.jenkins.io/doc/book/pipeline/syntax/#evaluating-when-before-the-options-directive)

### 并行

并行运行步骤的示例

```groovy
pipeline {
    agent any
    stages {
        stage('Non-Parallel Stage') {  // 第一个运行，这个运行完后才会运行下一个步骤
            steps {
                echo 'This stage will be executed first.'
                sh "sleep 10"
            }
        }
        stage('Parallel Stage') { // 第二个运行，Branch A B C 同时运行， 其中C包含了两个步骤Nested 1 2，他们是串行的
            failFast true    // 某个并行任务失败时，终止其他并行任务，也可以使用options指令设置
            parallel {  // 使用parallel包起来的stage是并行的
                stage('Branch A') {
                    agent {
                        label "mytest"
                    }
                    steps {
                        echo "On Branch A"
                    }
                }
                stage('Branch B') {
                    agent {
                        label "mytest"
                    }
                    steps {
                        echo "On Branch B"
                    }
                }
                stage('Branch C') {
                    agent {
                        label "mytest"
                    }
                    stages {
                        stage('Nested 1') {
                            steps {
                                echo "In stage Nested 1 within Branch C"
                                sh "sleep 3"
                            }
                        }
                        stage('Nested 2') {
                            steps {
                                echo "In stage Nested 2 within Branch C"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

### 矩阵运行

示例

```groovy
pipeline {
    agent any
    parameters {
        choice(name: 'PLATFORM_FILTER', choices: ['all', 'linux', 'windows', 'mac'], description: 'Run on specific platform')
    }
    stages {
        stage("Build") {  
            matrix {  // 将axes中声明的所有内容组合起来
                when { anyOf {  // 只有选择all或者某一个平台才会构建
                    expression { params.PLATFORM_FILTER == 'all' }
                    expression { params.PLATFORM_FILTER == env.PLATFORM }  // env.PLATFORM就是将要构建的PLATFORM值, 如果不等于选择的平台就不会执行构建
                } }
                axes { // 这将根据下面的stages生成3x2个步骤,分别是linux + 32-bit, mac + 32-bit, windows + 32-bit, linux + 64-bit ...
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'mac', 'windows'
                    }
                    axis {
                        name 'ARCHITECTURE'
                        values '32-bit', '64-bit'
                    }
                }
                stages {
                    stage('Package') {
                        steps {
                            sh "echo build $PLATFORM-$ARCHITECTURE"
                        }
                    }
                }
                excludes { // 排除一些组合，他们是mac + 32-bit, windows + 32-bit
                    exclude {
                        axis {
                            name 'PLATFORM'
                            values 'mac'
                        }
                        axis {
                            name 'ARCHITECTURE'
                            values '32-bit'
                        }
                    }
                    exclude {
                        axis {
                            name 'PLATFORM'
                            values 'windows'
                        }
                        axis {
                            name 'ARCHITECTURE'
                            values '32-bit'
                        }
                    }
                }
            }
        }

    }
}
```

## 脚本式流水线

groovy

```groovy
// 设置属性
properties([
    disableConcurrentBuilds(),
    buildDiscarder(logRotator(numToKeepStr: '1'))
])

// timeout需要包裹body
timeout(time:1, "unit": "HOURS") {
    // 指定运行节点
    node('mytest') {
        stage('Example') {
            if (env.BRANCH_NAME == 'master') {
                echo 'I only execute on the master branch'
            } else {
                echo 'I execute elsewhere'
            }
        }
        stage('Example2') {
            sh "pwd;sleep 5"
        }
    }
}
```

try-catch

```groovy
node {
    stage('Example') {
        try {
            sh 'exit 1'
        }
        catch (exc) {
            echo 'Something failed, I should sound the klaxons!'
            throw
        }
    }
}
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/684864836/  

