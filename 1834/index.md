# helm模板开发-访问文件(五)

<!--more-->
官方文档：https://v2.helm.sh/docs/chart_template_guide/#glob-patterns
Helm提供了通过`.Files`对象访问文件。但是，在开始使用模板示例之前，需要注意一些有关其工作原理的事情：
- 可以在Helm chart中添加其他文件。这些文件将被捆绑并发送到Tiller。不过要小心。由于Kubernetes对象的存储限制，图表必须小于1M。
- `.Files`通常出于安全原因，某些文件无法通过`.Files`对象访问。
  - 无法访问`templates/`中的文件。
  - 无法访问被`.helmignore`排除的文件。

## 基本示例：
首先创建三个文件
```
#config1.toml
message = "Hello from config 1"

#config2.toml
message = "This is config 2"

#config3.toml
message = "Goodbye from config 3"
```
我们使用range函数来遍历这些文件
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range list "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

渲染后的效果：
```
# Source: files-demo/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  app: eerie-hydra
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## glob模式
Files.Glob(pattern string)方法返回所有匹配的文件路径列表，可协助您以[全局模式](https://godoc.org/github.com/gobwas/glob)灵活性提取某些文件。

简单示例：
目录结构
```
bar
├── bar.conf
├── bar.go
└── bar.yaml
foo
├── foo.txt
└── foo.yaml
```

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: glob-test
data:
  {{- $root := . }}
  {{- range $path,$bytes := .Files.Glob "**.yaml" }}
  {{ base $path }}: |-
    {{ $root.Files.Get $path }}
  {{- end -}}
```
渲染后的效果：
```
---
# Source: files-demo/templates/configmap2.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: glob-test
data:
  bar.yaml: |-
    my is bar.yaml

  foo.yaml: |-
    my is foo.yaml
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1834/  

