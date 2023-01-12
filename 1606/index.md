# pipeline语法

<!--more-->
<span style="font-size: 14pt; color: #ff0000;"><strong>agent</strong></span>

any：任意节点执行流水线

node：默认

label：在指定的agent上执行流水线

node：<code>agent { node { label 'labelName' } }</code>和 <code>agent { label 'labelName' }相同</code>，但<code>node</code>允许其他选项（如<code>customWorkspace</code>指定工作空间目录）

&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #ff0000;">options</span></strong></span>

<strong>buildDiscarder</strong>

持久化工件和控制台输出，用于最近Pipeline运行的具体数量。例如：<code>options { buildDiscarder(logRotator(numToKeepStr: '1')) }</code>

<strong>disableConcurrentBuilds</strong>

不允许并行执行Pipeline。可用于防止同时访问共享资源等。例如：<code>options { disableConcurrentBuilds() }</code>

<strong>skipDefaultCheckout</strong>

在<code>agent</code>指令中默认跳过来自源代码控制的代码。例如：<code>options { skipDefaultCheckout() }</code>

<strong>skipStagesAfterUnstable</strong>

一旦构建状态进入了“不稳定”状态，就跳过阶段。例如：<code>options { skipStagesAfterUnstable() }</code>

<strong>timeout</strong>

设置Pipeline运行的超时时间，之后Jenkins应该中止Pipeline。例如：<code>options { timeout(time: 1, unit: 'HOURS') }</code>

<strong>retry</strong>

失败后，重试整个Pipeline指定的次数。例如：<code>options { retry(3) }</code>

<strong>timestamps</strong>

在控制台输出运行时间。例如：<code>options { timestamps() }</code>

&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #ff0000;">post</span></strong></span>

<code>always</code>

运行，无论Pipeline运行的完成状态如何。

<code>changed</code>

只有当前Pipeline运行的状态与先前完成的Pipeline的状态不同时，才能运行。

<code>failure</code>

仅当当前Pipeline处于“失败”状态时才运行，通常在Web UI中用红色指示表示。

<code>success</code>

仅当当前Pipeline具有“成功”状态时才运行，通常在具有蓝色或绿色指示的Web UI中表示。

<code>unstable</code>

只有当前Pipeline具有“不稳定”状态，通常由测试失败，代码违例等引起，才能运行。通常在具有黄色指示的Web UI中表示。

<code>aborted</code>

只有当前Pipeline处于“中止”状态时，才会运行，通常是由于Pipeline被手动中止。通常在具有灰色指示的Web UI中表示。

&nbsp;

<span style="color: #ff0000;"><span style="font-size: 18.6667px;"><b>environment</b></span></span>

该environment指令指定一系列键值对，这些对值将被定义为所有步骤或阶段特定步骤的环境变量，具体取决于environment指令位于Pipeline中的位置。

该指令支持一种特殊的帮助方法credentials()，可以通过其在Jenkins环境中的标识符来访问预定义的凭据。对于类型为“Secret Text”的凭据，该 credentials()方法将确保指定的环境变量包含Secret Text内容。对于“标准用户名和密码”类型的凭证，指定的环境变量将被设置为， username:password并且将自动定义两个附加的环境变量：MYVARNAME_USR和MYVARNAME_PSW相应的。
<pre class="pure-highlightjs"><code class="null">pipeline {
    agent any
    environment { 
        CC = 'clang'
    }
    stages {
        stage('Example') {
            environment { 
                AN_ACCESS_KEY = credentials('my-prefined-secret-text') 
            }
            steps {
                sh 'printenv'
            }
        }
    }
}</code></pre>
&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>parameters</strong></span>

参数化构建

string 字符串类型的参数：
<pre class="pure-highlightjs"><code class="null">parameters { string(name: 'DEPLOY_ENV', defaultValue: 'staging', description: '') }
</code></pre>
booleanParam 布尔参数：
<pre class="pure-highlightjs"><code class="null">parameters { booleanParam(name: 'DEBUG_BUILD', defaultValue: true, description: '') }
</code></pre>
<pre class="pure-highlightjs"><code class="null">pipeline {
    parameters { 
        string(name: 'DEPLOY_ENV', defaultValue: 'staging', description: '') 
        booleanParam(name: 'DEBUG_BUILD', defaultValue: true, description: '') 
    }
    agent any
    stages {
        stage("Example") {
            steps {
                println("${DEPLOY_ENV}")
                println("$DEBUG_BUILD")
            }
        }
    }</code></pre>
&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>tool</strong></span>

获取通过自动安装或手动放置工具的环境变量。支持maven/jdk/gradle。工具的名称必须在系统设置-&gt;全局工具配置中定义。

需要在jenkins配置maven环境，名称为apache-maven-3.0.1
<pre class="pure-highlightjs"><code class="null">pipeline {
    agent any
    tools {
        maven 'apache-maven-3.0.1' 
    }
    stages {
        stage('Example') {
            steps {
                sh 'mvn --version'
            }
        }
    }
}</code></pre>
&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #ff0000;">input</span></strong></span>

input用户在执行各个阶段的时候，由人工确认是否继续进行。
<ul>
 	<li>message 呈现给用户的提示信息。</li>
 	<li>id 可选，默认为stage名称。</li>
 	<li>ok 默认表单上的ok文本。</li>
 	<li>submitter 可选的,以逗号分隔的用户列表或允许提交的外部组名。默认允许任何用户。</li>
 	<li>submitterParameter 环境变量的可选名称。如果存在，用<code>submitter</code> 名称设置。</li>
 	<li>parameters 提示提交者提供的一个可选的参数列表。</li>
</ul>
<pre class="pure-highlightjs"><code class="null">pipeline {
    parameters { 
        string(name: 'DEPLOY_ENV', defaultValue: 'staging', description: '') 
        booleanParam(name: 'DEBUG_BUILD', defaultValue: true, description: '') 
    }
    agent any
    stages {
        stage("Example") {
            steps {
                println("${DEPLOY_ENV}")
                println("$DEBUG_BUILD")
                input message: '继续执行', ok: '是的，执行', parameters: [text(defaultValue: 'None', description: '', name: 'content')], submitter: 'admin'
            }
        }
    }
}</code></pre>
&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #ff0000;">when</span></strong></span>

when 指令允许流水线根据给定的条件决定是否应该执行阶段。 when 指令必须包含至少一个条件。 如果<code>when</code> 指令包含多个条件, 所有的子条件必须返回True，阶段才能执行。 这与子条件在 allOf 条件下嵌套的情况相同。

branch: 当正在构建的分支与模式给定的分支匹配时，执行这个阶段,这只适用于多分支流水线例如:
<div class="highlight">
<pre class="chroma"><code class="language-groovy" data-lang="groovy"><span class="n">when</span> <span class="o">{</span> <span class="n">branch</span> <span class="s1">'master'</span> <span class="o">}</span></code></pre>
</div>
&nbsp;

environment: 当指定的环境变量是给定的值时，执行这个步骤,例如:
<div class="highlight">
<pre class="chroma"><code class="language-groovy" data-lang="groovy"><span class="n">when</span> <span class="o">{</span> <span class="n">environment</span> <span class="nl">name:</span> <span class="s1">'DEPLOY_TO'</span><span class="o">,</span> <span class="nl">value:</span> <span class="s1">'production'</span> <span class="o">}</span></code></pre>
</div>
&nbsp;

expression 当指定的Groovy表达式评估为true时，执行这个阶段, 例如:
<div class="highlight">
<pre class="chroma"><code class="language-groovy" data-lang="groovy"><span class="n">when</span> <span class="o">{</span> <span class="n">expression</span> <span class="o">{</span> <span class="k">return</span> <span class="n">params</span><span class="o">.</span><span class="na">DEBUG_BUILD</span> <span class="o">}</span> <span class="o">}</span></code></pre>
</div>
&nbsp;

not 当嵌套条件是错误时，执行这个阶段,必须包含一个条件，例如:
<div class="highlight">
<pre class="chroma"><code class="language-groovy" data-lang="groovy"><span class="n">when</span> <span class="o">{</span> <span class="n">not</span> <span class="o">{</span> <span class="n">branch</span> <span class="s1">'master'</span> <span class="o">}</span> <span class="o">}</span></code></pre>
</div>
&nbsp;

allOf 当所有的嵌套条件都为真时，执行这个阶段,必须包含至少一个条件，例如:
<div class="highlight">
<pre class="chroma"><code class="language-groovy" data-lang="groovy"><span class="n">when</span> <span class="o">{</span> <span class="n">allOf</span> <span class="o">{</span> <span class="n">branch</span> <span class="s1">'master'</span><span class="o">;</span> <span class="n">environment</span> <span class="nl">name:</span> <span class="s1">'DEPLOY_TO'</span><span class="o">,</span> <span class="nl">value:</span> <span class="s1">'production'</span> <span class="o">}</span> <span class="o">}</span></code></pre>
</div>
&nbsp;

anyOf 当至少有一个嵌套条件为真时，执行这个阶段,必须包含至少一个条件，例如:
<div class="highlight">
<pre class="chroma"><code class="language-groovy" data-lang="groovy"><span class="n">when</span> <span class="o">{</span> <span class="n">anyOf</span> <span class="o">{</span> <span class="n">branch</span> <span class="s1">'master'</span><span class="o">;</span> <span class="n">branch</span> <span class="s1">'staging'</span> <span class="o">}</span> <span class="o">}</span></code></pre>
</div>
&nbsp;

示例：
<pre class="pure-highlightjs"><code class="null">// branch
pipeline {
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                branch 'production'
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}

// env
pipeline {
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                branch 'production'
                environment name: 'DEPLOY_TO', value: 'production'
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}

// allOf
pipeline {
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                allOf {
                    branch 'production'
                    environment name: 'DEPLOY_TO', value: 'production'
                }
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}

// anyOf
pipeline {
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                branch 'production'
                anyOf {
                    environment name: 'DEPLOY_TO', value: 'production'
                    environment name: 'DEPLOY_TO', value: 'staging'
                }
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}

// expression
pipeline {
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                expression { BRANCH_NAME ==~ /(production|staging)/ }
                anyOf {
                    environment name: 'DEPLOY_TO', value: 'production'
                    environment name: 'DEPLOY_TO', value: 'staging'
                }
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}</code></pre>
&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #ff0000;">paraller</span></strong></span>

声明式流水线的阶段可以在他们内部声明多个嵌套阶段, 它们将并行执行。 注意，一个阶段必须只有一个 steps 或 <code>parallel</code>的阶段。 嵌套阶段本身不能包含 进一步的 <code>parallel</code> 阶段, 但是其他的阶段的行为与任何其他 stage<code>parallel</code>的阶段不能包含 <code>agent</code> 或 <code>tools</code>阶段, 因为他们没有相关 <code>steps</code>。

另外, 通过添加 <code>failFast true</code> 到包含<code>parallel</code>的 <code>stage</code>中， 当其中一个进程失败时，你可以强制所有的 <code>parallel</code> 阶段都被终止。

&nbsp;

示例：
<pre class="pure-highlightjs"><code class="null">pipeline {
    agent any
    stages {
        stage('普通stage') {
            steps {
                echo 'This stage will be executed first.'
            }
        }
        stage('并行Stage') {
            failFast true
            parallel {
                stage('Branch A') {
                    // agent {
                    //     label "for-branch-a"
                    // }
                    steps {
                        echo "On Branch A"
                    }
                }
                stage('Branch B') {
                    // agent {
                    //     label "for-branch-b"
                    // }
                    steps {
                        echo "On Branch B"
                    }
                }
            }
        }
    }
}</code></pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1606/  

