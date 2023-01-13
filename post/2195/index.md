# kubernetes pipeline Jenkinsfile模板

<!--more-->
mvn
```
String jobName = "${env.JOB_BASE_NAME}".toLowerCase()
String imageName = "swr.cn-east-2.myhuaweicloud.com/all-${deployEnv}/${jobName}:${BUILD_ID}"
String gitAddr = "http://gitlab.xxx.com/xxx/server.git"

pipeline{
    agent any
    parameters {
        text(defaultValue: '0m', description: 'request_cpu', name: 'request_cpu')
        text(defaultValue: '1Gi', description: 'request_memory', name: 'request_memory')
        text(defaultValue: '1000m', description: 'limit_cpu', name: 'limit_cpu')
        text(defaultValue: '2Gi', description: 'limit_memory', name: 'limit_memory')
        // choice(choices: ['blade-xxx'], description: '服务名称', name: 'serverName')
        // choice(choices: ['devops'], description: '命名空间', name: 'nameSpace')
        // choice(choices: ['dev'], description: '部署环境[dev,test,prod]', name: 'deployEnv')
        // choice(choices: ['dev'], description: '部署分支', name: 'branchName')
        choice(choices: ['1','2'], description: '副本数量', name: 'replicas')
    }
    options {
        timestamps()  //显示日志时间
        skipDefaultCheckout() //删除隐式checkout scm语句
        disableConcurrentBuilds() //禁止并行
        timeout(time: 20, unit: 'MINUTES')  //流水线超时时间10分钟
    }
    stages{
        stage("拉取代码"){
            steps{
                script{
                    wrap([$class: 'BuildUser']) {
                        currentBuild.description = "Started by user:${env.BUILD_USER},branch:${branchName}"
                    }
                    checkout([$class: 'GitSCM', branches: [[name: "${branchName}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: "${gitAddr}"]]])
                }
            }
        }
        stage("编译"){
            steps{
                script{
                    mvnHome = tool "M3"
                    sh "${mvnHome}/bin/mvn clean package -U -pl `find ./ -name ${serverName}` -am -Dmaven.test.skip=true"
                }
            }
        }
        stage("制作镜像"){
            steps{
                script{
                    sh "cd `find ./ -name ${serverName}` && docker build -t ${imageName} ."
                }
            }
        }
        stage("上传镜像"){
            steps{
                script{
                    sh "docker push ${imageName}"
                }
            }
            post{
                always{
                    script{
                        sh "docker rmi ${imageName}"
                    }
                }
            }
        }
        stage("生成yaml"){
            steps{
                script{
                    //修改命名空间
                    sh "sed -i s#{nameSpace}#${nameSpace}# devops/${serverName}.yaml"
                    //修改镜像地址
                    sh "sed -i s#{imageName}#${imageName}# devops/${serverName}.yaml"
                    //部署环境
                    sh "sed -i s#{deployEnv}#${deployEnv}# devops/${serverName}.yaml"
                    //设置副本数量
                    sh "sed -i s#{replicas}#${replicas}# devops/${serverName}.yaml"
                    //资源限制
                    sh "sed -i s#{request_cpu}#${request_cpu}# devops/${serverName}.yaml"
                    sh "sed -i s#{request_memory}#${request_memory}# devops/${serverName}.yaml"
                    sh "sed -i s#{limit_cpu}#${limit_cpu}# devops/${serverName}.yaml"
                    sh "sed -i s#{limit_memory}#${limit_memory}# devops/${serverName}.yaml"
                    //修改gateway的域名
                    if ( "${serverName}" == "gateway") {
                        sh "sed -i s#{domainName}#${domainName}# devops/${serverName}.yaml"
                    }
                }
            }
        }
        stage("部署"){
            steps{
                script{
                    sh "cat devops/${serverName}.yaml"
                    switch("${deployEnv}") {
                        case "dev":
                            kubeConfig = "/root/.kube/test.config"
                            break
                            ;;
                        case "test":
                            kubeConfig = "/root/.kube/test.config"
                            break
                            ;;
                        case "prod":
                            kubeConfig = "/root/.kube/prod.config"
                            break
                            ;;
                        break
                            println("未知环境")
                            ;;
                    }
                    sh "kubectl apply -f devops/${serverName}.yaml --record --kubeconfig=${kubeConfig}"
                }
            }
        }
        stage("就绪检测"){
            steps{
                timeout(time: 10, unit: 'MINUTES'){ //步骤超时时间
                    script{
                        sh "kubectl rollout status -n ${nameSpace} deployment ${serverName} --kubeconfig=${kubeConfig}"
                    }
                }
            }
        }
    }
}

```

node

```
String jobName = "${env.JOB_BASE_NAME}".toLowerCase()
String imageName = "swr.cn-east-2.myhuaweicloud.com/all-${deployEnv}/${jobName}:${BUILD_ID}"
String gitAddr = "http://gitlab.xxx.com/xxx/frontend.git"

pipeline{
    agent any
    /*parameters {
        choice(choices: ['blade-xxx'], description: '服务名称', name: 'serverName')
        choice(choices: ['devops'], description: '命名空间', name: 'nameSpace')
        choice(choices: ['dev'], description: '部署环境[dev,test,prod]', name: 'deployEnv')
        choice(choices: ['dev'], description: '部署分支', name: 'branchName')
        choice(choices: ['1'], description: '副本数量', name: 'replicas')
    }*/
    options {
        timestamps()  //显示日志时间
        skipDefaultCheckout() //删除隐式checkout scm语句
        disableConcurrentBuilds() //禁止并行
        timeout(time: 20, unit: 'MINUTES')  //流水线超时时间10分钟
    }
    stages{
        stage("拉取代码"){
            steps{
                script{
                    wrap([$class: 'BuildUser']) {
                        currentBuild.description = "Started by user:${env.BUILD_USER},branch:${branchName}"
                    }
                    checkout([$class: 'GitSCM', branches: [[name: "${branchName}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: "${gitAddr}"]]])
                }
            }
        }
        stage("编译"){
            steps{
                script{
                    nodejsHome = tool "NPM"
                    sh "${nodejsHome}/bin/cnpm install"
		            sh "sed -i 's#{api_url}#${apiUrl}#' .env.production"
                    sh "${nodejsHome}/bin/npm run build:${deployEnv}"
                    sh "cp -r dist devops/"
                }
            }
        }
        stage("制作镜像"){
            steps{
                script{
                    sh "cd devops && docker build -t ${imageName} ."
                }
            }
        }
        stage("上传镜像"){
            steps{
                script{
                    sh "docker push ${imageName}"
                }
            }
            post{
                always{
                    script{
                        sh "docker rmi ${imageName}"
                    }
                }
            }
        }
        stage("生成yaml"){
            steps{
                script{
                    //修改命名空间
                    sh "sed -i s#{nameSpace}#${nameSpace}# devops/${serverName}.yaml"
                    //修改镜像地址
                    sh "sed -i s#{imageName}#${imageName}# devops/${serverName}.yaml"
                    //部署环境
                    sh "sed -i s#{deployEnv}#${deployEnv}# devops/${serverName}.yaml"
                    //设置副本数量
                    sh "sed -i s#{replicas}#${replicas}# devops/${serverName}.yaml"
                    //设置服务名
                    sh "sed -i s#{serverName}#${serverName}# devops/${serverName}.yaml"
                    //修改域名
                    sh "sed -i s#{domainName}#${domainName}# devops/${serverName}.yaml"
                }
            }
        }
        stage("部署"){
            steps{
                script{
                    sh "cat devops/${serverName}.yaml"
                    switch("${deployEnv}") {
                        case "dev":
                            kubeConfig = "/root/.kube/test.config"
                            break
                            ;;
                        case "test":
                            kubeConfig = "/root/.kube/test.config"
                            break
                            ;;
                        case "prod":
                            kubeConfig = "/root/.kube/prod.config"
                            break
                            ;;
                        break
                            println("未知环境")
                            ;;
                    }
                    sh "kubectl apply -f devops/${serverName}.yaml --record --kubeconfig=${kubeConfig}"
                }
            }
        }
        stage("就绪检测"){
            steps{
                timeout(time: 10, unit: 'MINUTES'){ //步骤超时时间
                    script{
                        sh "kubectl rollout status -n ${nameSpace} deployment ${serverName} --kubeconfig=${kubeConfig}"
                    }
                }
            }
        }
    }
}

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2195/  

