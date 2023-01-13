# tekton学习-PipelineResources对象(一)

<!--more-->
## 概述
PipelineResources是给Task提供输入和输出的资源对象。

一个Task可能会有多个输入和输出:
- Task的输入可以是GitHub代码仓库
- Task的输出可以是一个要上传到镜像仓库的容器镜像
- Task的输出可以是一个要上传到存储桶的jar包

PipelineResources一直处于alpha版本,随时可能会被抛弃,官方也给了一些替代它的方案,[在这里](https://tekton.dev/docs/pipelines/migrating-v1alpha1-to-v1beta1/#replacing-pipelineresources-with-tasks)


[为什么可能会被抛弃？](https://tekton.dev/docs/pipelines/resources/#why-aren-t-pipelineresources-in-beta)

## 一、PipelineResources对象支持的属性

- 必须:
  - apiVersion - tekton.dev/v1alpha1.
  - kind - PipelineResource
  - metadata - 略
  - spec - PipelineResource对象的详细配置
    - type - PipelineResource的类型,可选git、pullRequest、image、cluster、storage、cloudEvent


- 可选: 
  - description - 资源描述
  - params - 在选择不同的资源类型时,在这里指定其参数名称和值。比如git需要名为url和revision参数
  - secrets - 当参数中的值需要脱敏时,可以使用secret代替params。[配置示例](https://tekton.dev/vault/pipelines-v0.18.1/resources/#cluster-resource)


## 二、配置示例

### 1.配置git资源
```yaml
apiVersion: tekton.dev/v1alpha1
kind: PipelineResource
metadata:
  name: website-git
spec:
  type: git
  params:
  - name: url
    value: https://github.com/tektoncd/website
  - name: revision
    value: main
```
> 定义了git仓库地址和git分支

### 2.配置容器镜像资源
```yaml
apiVersion: tekton.dev/v1alpha1
kind: PipelineResource
metadata:
  name: website-image
spec:
  type: image
  params:
  - name: url
    value: cr.io/website
```
> 定义镜像仓库地址,tag不写代表latest


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2628/  

