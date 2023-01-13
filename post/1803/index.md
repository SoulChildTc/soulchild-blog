# helm模板开发入门(一)

<!--more-->
## chart包目录结构：
```bash
demo1/
├── charts                #子chart包目录
├── Chart.yaml            #chart包的描述信息元数据
├── templates             # 资源清单模板目录
│   ├── deployment.yaml   #资源清单模板
│   ├── _helpers.tpl      #存放可在整个chart中重复使用的变量
│   ├── ingress.yaml      #资源清单模板
│   ├── NOTES.txt         #说明文件，install后会打印在屏幕中
│   └── service.yaml      #资源清单模板
└── values.yaml           #chart包的默认配置信息
```
Chart.yaml
```yaml
apiVersion: api版本，始终是v1 (必须)
name: chart名称(必须)
version: chart版本号 (必须)
kubeVersion: 兼容的kubernetes版本 (可选)
description: 描述信息 (可选)
keywords:
  - 关键字列表 (可选)
home: 项目url (可选)
sources:
  - 项目源码url列表 (可选)
maintainers: # 维护人员的信息(可选)
  - name: 名字
    email: 邮箱
    url: 维护人员的url
engine: gotpl # 模板引擎的名称 (可选, 默认是gotpl)
icon: 要用作图标的SVG或PNG图像的URL (可选)
appVersion: chart包含的应用程序版本(可选)
deprecated: 这个chart是否被废弃 (可选, 布尔型)
tillerVersion: 需要的tiller版本(可选)
```


## 第一个模板：
### 1.创建chart：
```bash
helm create mychart
rm -fr mychart/templates/*
```
### 2.创建资源清单模板：
vim mychart/templates/configmap.yaml
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```
### 3.安装
```
安装
helm install . --name my-cm

#查看渲染后的模板
helm get manifest my-cm
```
上面的{{ .Release.Name }}意思是获取Release对象的Name值

## helm模板提供的内置对象：
##### Release：
- Release.Name: release的名称
- Release.Time: release的发布时间
- Release.Namespace: release的namespace
- Release.Service: 发布服务的名称，总是Tiller
- Release.Revision: release的版本修订号。它从1开始，随着release的升级而增加。
- Release.IsUpgrade: 如果当前操作是升级或回滚，则为true
- Release.IsInstall: 如果当前操作是安装，则为true

##### Values：从values.yaml文件和用户提供的文件传递到模板的值。默认情况下Values为空。

##### Chart：读取Chart.yaml文件的内容。例如{{.Chart.Name}}-{{.Chart.Version}}将打印出mychart-0.1.0。

##### Files：这提供对图表中所有非特殊文件的访问。虽然无法使用它来访问模板，但是可以使用它来访问图表中的其他文件。
- Files.Get 是一个按名称获取文件的函数（.Files.Get config.ini）
- Files.GetBytes 是将文件内容作为字节数组而不是字符串获取的函数。这对于像图片这样的东西很有用。

##### Capabilities: 提供了关于 Kubernetes 集群支持的功能的信息
- Capabilities.APIVersions：是一组版本信息。
- Capabilities.APIVersions.Has $version：是否支持指定的api或resources版本
- Capabilities.KubeVersion：提供查找Kubernetes版本的方法。它有以下值:Major、Minor、GitVersion、GitCommit、GitTreeState、BuildDate、GoVersion、Compiler和Platform。
- Capabilities.TillerVersion：提供了一种查找tiller版本的方法。它有以下值:SemVer, GitCommit, GitTreeState。

##### Template: Contains information about the current template that is being executed
- Name:当前模板的文件路径(例如mychart/templates/mytemplate.yaml)
- BasePath: 当前chart模板目录路径(例如mychart/templates)

这些值可用于任何顶级模板。这并不一定意味着它们将在任何地方都可用。


## values 文件
传递到chart中的值。它的内容来自四个来源:
- chart包的values.yaml文件
- 如果是子chart，则values.yaml文件为父chart包的
- 通过-f参数指定一个文件(helm install -f myvals.yaml ./mychart)
- 通过--set指定 (helm install --set foo=bar ./mychart)

上面的列表按特定性顺序排列：values.yaml是默认值，可以被父图表的覆盖values.yaml，而后者可以由用户提供的值文件覆盖，而后者又可以由--set参数覆盖。


示例：
1.添加一个value
```bash
echo 'name: soulchild' > values.yaml
```
2.修改模板`cat templates/configmap.yaml`
```bash
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  namespace: {{ .Release.Namespace }}
  name: {{ .Values.name }}
```
3.升级chart
```bash
helm upgrade my-cm .
```
4.查看渲染后的结果
```bash
helm get manifest my-cm
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: wishing-rottweiler-configmap
data:
  myvalue: "Hello World"
  namespace: default
  name: soulchild
```














---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1803/  

