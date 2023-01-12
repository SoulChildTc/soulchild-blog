# jenkins中env: node: No such file or directory

<!--more-->
两种方式解决：

第一种：创建node软连接到/usr/sbin目录下

ln -s /application/node-v14.2.0-linux-x64/bin/node /usr/sbin/node

&nbsp;

第二种：

在执行sh时添加环境变量
<pre class="pure-highlightjs"><code class="null">pipeline{
    agent {
        node { label "master" }
    }
    parameters{
        choice(choices: ["-v","build"],description: "npm",name: "buildShell")
    }
    stages{
        stage("npm构建"){
            steps{
                script{
                    nodejs_home = tool "NPM"
                    sh "export PATH=\$PATH:${nodejs_home}/bin &amp;&amp; ${nodejs_home}/bin/npm ${buildShell}"
                }
            }
        }
    }
}</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1628/  

