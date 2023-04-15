# Gitlab Ci使用kaniko构建镜像


<!--more-->


```yaml
image: python:3.11.3-bullseye

variables:
  IMAGE_REF: "$CI_REGISTRY_IMAGE:$CI_PIPELINE_ID"

stages:
  - build

build:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:v1.9.0-debug
    entrypoint: [""]
  script:
    - /kaniko/executor
      --context "${CI_PROJECT_DIR}"
      --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
      --destination "${IMAGE_REF}"
      --cache=true
```
--cache=true开启了缓存, 他会将一些层缓存到远程仓库中, 如果镜像名为 `devops/py-demo` , 那么环境的镜像名为 `devops/py-demo/cache`


这里直接上传到 `gitlab container registry` 不需要手动登录, 因为kaniko会自行读取环境变量`CI_REGISTRY_USER`和`CI_REGISTRY_PASSWORD`。

源码位置 `./vendor/github.com/ePirat/docker-credential-gitlabci/pkg/credhelper/credhelper.go`, 

如果上传到其他仓库的话,需要自行配置下认证信息, 注意要在 executor 之前执行。或者你可以尝试覆盖`CI_REGISTRY_USER`和`CI_REGISTRY_PASSWORD`环境变量。
```bash
- echo "{\"auths\":{\"${CI_REGISTRY}\":{\"auth\":\"$(printf "%s:%s" "${CI_REGISTRY_USER}" "${CI_REGISTRY_PASSWORD}" | base64 | tr -d '\n')\"}}}" > /kaniko/.docker/config.json
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/gitlab-ci%E4%BD%BF%E7%94%A8kaniko%E6%9E%84%E5%BB%BA%E9%95%9C%E5%83%8F/  

