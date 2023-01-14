# gitlab提交代码自动触发jenkins pipeline

<!--more-->
1.配置jenkins（需要先安装Generic Webhook Trigger插件）

获取gitlab提交的分支，赋给变量branch

<img src="images/47e886e74992bbb1db166215aff11199.png "47e886e74992bbb1db166215aff11199"" />

&nbsp;

加一个webhook参数，用于判断触发构建的类型：

<img src="images/ae0bf0a61e6a907d7d33033868aec526.png "ae0bf0a61e6a907d7d33033868aec526"" />

&nbsp;

填写token：

<img src="images/6591b3162d6c9dbfb09827db52c77016.png "6591b3162d6c9dbfb09827db52c77016"" />

&nbsp;

打印相关内容和变量，方便调试：

<img src="images/7ceff1dba92b85144a08e3bf3d9cc0f4.png "7ceff1dba92b85144a08e3bf3d9cc0f4"" />

&nbsp;

2.gitlab配置

URL：http://10.0.0.51:8080/generic-webhook-trigger/invoke?token=demo-maven-service_PUSH&amp;runType=gitlabpush

<img src="images/1133196075888fece5a27d21b51f87a6.png "1133196075888fece5a27d21b51f87a6"" />

&nbsp;

修改pipeline动态获取分支名称
<pre class="pure-highlightjs"><code class="null">#!groovy
@Library('jenkins-sharelibrary@master')
def tools = new org.devops.tools()

String srcUrl = "${env.srcUrl}"
String branchName = "${env.branchName}"
String buildType = "${buildType}"
String buildShell = "${buildShell}"

try{
    if ( "${runType}" == "gitlabpush" ){
        branchName = "${branch}"
    }
}catch(Exception e){
    println(branchName)
}

currentBuild.description = "构建分支：${branchName}"

pipeline{
    agent { 
        node { label 'master'} 
    }
    stages{
        stage('GetCode'){
            steps{
                script{
                    tools.myprint("正在拉取代码","green")
                    checkout([$class: 'GitSCM', 
                            branches: [[name: "${branchName}"]], 
                            doGenerateSubmoduleConfigurations: false, 
                            extensions: [], 
                            submoduleCfg: [], 
                            userRemoteConfigs: [[credentialsId: '476e5130-258c-4e7e-a80e-4ea8a303a985', 
                                                url: "${srcUrl}"]]]) 
                }
            }
        }
        stage('Build'){
            steps{
                script{
                    tools.build("${buildType}","${buildShell}")
                }
            }
        }
    }
}</code></pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1636/  

