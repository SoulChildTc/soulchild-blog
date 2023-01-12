# helm模板开发-命名模板(四)

<!--more-->
命名模板时要记住的重要细节：**模板名称是全局的**。如果您声明两个具有相同名称的模板，则以最后加载的那个为准。由于子chart中的模板是与顶级模板一起编译的，因此应谨慎使用图表特定名称来命名模板。

一种流行的命名约定是在每个定义的模板前添加chart名称：`{{ define "mychart.labels" }}`。通过使用特定的chart名称作为前缀，我们可以避免由于两个不同的chart,使用了相同的模板名称而引起的任何冲突。

## 1.使用`define`声明和使用模板
define操作使我们可以在模板文件内部创建命名模板。它的语法如下：
```
{{ define "MY.NAME" }}
  # body of template here
{{ end }}
```

例如，我们可以定义一个模板来封装Kubernetes标签块：
```
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

现在，我们可以将此模板嵌入到现有的ConfigMap中，然后将其包含在template中：
```
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- if eq .drink "coffee" }}
  mug: true
  {{- end }}
  toppings: |-
    {{- end }}
    {{- range $key,$value := .Values.favorite }}
    {{ $key }}: {{ $value }}
    {{- end }}
```

渲染后的结果如下：
```
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: toned-greyhound-configmap
  labels:
    generator: helm
    date: 2020-06-23
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
  toppings: |-
    drink: coffee
    food: pizza
```

通常命名模板会放置在_helpers.tpl文件中。我们把该命名模板移到那里：
vim templates/_helpers.tpl
```
{{/* 生成基本标签 */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

渲染后的效果：
```
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: factual-seagull-configmap
  labels:
    generator: helm
    date: 2020-06-23
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
  toppings: |-
    drink: coffee
    food: pizza
```
## 2.设置模板作用域

在上面定义的模板中，我们没有使用任何对象。我们只是使用了函数。如果在命名模板中使用对象会是什么结果呢：
```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```
我们渲染后的结果：
```
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2016-11-02
    chart:
    version:
```
可以发现这并不是我们所期待的结果,因为`.Chart.Name、.Chart.Version`不在我们定义的模板作用域内。define呈现命名模板时，它将接收template调用时传递的作用域。在我们的示例中，我们这样调用的模板：
`{{- template "mychart.labels" }}`
没有传入任何作用域，因此在模板内我们无法访问`.`中的任何内容。不过，这很容易解决。我们只需将作用域传递给模板就可以了：
`{{- template "mychart.labels" . }}`

此时我们的三个文件内容分别为：
```
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- if eq .drink "coffee" }}
  mug: true
  {{- end }}
  toppings: |-
    {{- end }}
    {{- range $key,$value := .Values.favorite }}
    {{ $key }}: {{ $value }}
    {{- end }}

#values.yaml
name: soulchild
livenessProbe: null
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

#_helpers.tpl
{{/* 生成基本标签  */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```


修改后我们再次渲染：
```
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kind-chipmunk-configmap
  labels:
    generator: helm
    date: 2020-06-23
    chart: mychart
    version: 0.1.0
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
  toppings: |-
    drink: coffee
    food: pizza
```

##3.`include`函数
假设我们定义了一个命名模板：
```
{{- define "mychart.app" }}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}+{{ .Release.Time.Seconds }}"
{{- end -}}
```

configmap.yaml如下
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{- template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- if eq .drink "coffee" }}
  mug: true
  {{- end }}
  toppings: |-
    {{- end }}
    {{- range $key,$value := .Values.favorite }}
    {{ $key }}: {{ $value }}
    {{- end }}
```
查看渲染后的结果：
```
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: womping-swan-configmap
  labels:
app_name: mychart
app_version: "0.1.0+1592893332"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
  toppings: |-
    drink: coffee
    food: pizza
```
可以看到渲染后的label缩进是有问题的，因为template的数据只是插入到上一个文本的右边。上一个文本的最右边是换行符，就相当于是在换行符后面插入文本。

我们可以通过`管道`和`indent`来解决缩进问题，但是template是一个'动作'而不是'函数'，不能使用`管道`。所以无法将template调用的输出传递给其他函数，但是我们可以通过`include`来做到这一点，例如：

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{- include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- if eq .drink "coffee" }}
  mug: true
  {{- end }}
  toppings: |-
    {{- end }}
    {{- range $key,$value := .Values.favorite }}
    {{ $key }}: {{ $value }}
    {{- end }}
```
渲染后的结果：
```
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: lumbering-alligator-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0+1592895037"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
  toppings: |-
    drink: coffee
    food: pizza
```

nindent和indent的区别：nindent会在缩进前多出一个换行符







---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1828/  

