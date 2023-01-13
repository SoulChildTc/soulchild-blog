# gitlab-ci 上传镜像提示denied: access forbidden

<!--more-->
### 问题描述:
  当提交代码触发gitlab pipeline时，执行到`build`阶段的`docker push`时，提示 `denied: access forbidden`，前面也提示登录成功了，很奇怪，最近并没有修改gitlab-ci文件，之前运行也一直没问题，并且其他pipeline还可以正常运行，所以只能从ci配置上找问题了。

ci配置大致如下:
```bash
image: registry.gitlab.xxx.cn/base-images/maven

variables:
  IMAGE_REF: $CI_REGISTRY_IMAGE:$CI_PIPELINE_ID

stages:
  - build

build:
  stage: build
  script:
    - export MAVEN_OPTS=-Dmaven.repo.local=$PWD/.m2/repository
    - mvn $MAVEN_CLI_OPTS clean package
    - mvn -U package
    - docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $
    - docker build -t $IMAGE_REF .
    - docker push $IMAGE_REF
    - docker rmi $IMAGE_REF
  cache:
    paths:
    - .m2
```
> 可以看到build是使用了一个公共的基础镜像，执行的内容就是编译打包制作镜像上传

### 排查
略

### 原因
问题比较坑，很久之前因为某些原因(忘记了)升级了runner所在宿主机的docker版本到20.10.12，之前应该是1.13。但是基础镜像中使用的docker客户端版本还是1.13的，所以就导致哪怕提示登陆成功，但是依然不能上传镜像。

### 解决
#### 方法一、 将maven和docker剥离开,docker使用新的stage，并且单独使用新版本的docker客户端image,这样的好处就是不用修改基础镜像了。

#### 方法二、 升级基础镜像中的docker版本



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2833/  

