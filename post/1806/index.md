# helm模板开发-流程控制、作用域、循环、变量(三)

<!--more-->
# 运算符
eq，ne，lt，gt，and，or，not

# 流程控制
- if/else 条件
- with 控制作用域
- range，循环

## 1.if
条件语句的基本结构如下所示：
```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

如果值为以下内容，则将评估为false：
- 布尔值false
- 数字零
- 一个空字符串
- 一个nil（empty 或 null）
- 一个空的集合（map，slice，tuple，dict，array）

在任何其他情况下，条件被计算为true。

#### 示例
./values.yaml
```yaml
name: soulchild
favorite:
  drink: coffee
  food: pizza
```

`templates/configmap.yaml`条件要求.Values.favorite.drink的值等于coffee，则输出mug: true
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: true{{ end }}
```

结果
```yaml
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: singing-squid-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
```

## 控制空行
看一下下面的例子
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{if eq .Values.favorite.drink "coffee"}}
  mug: true
  {{end}}
```

结果
```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: killjoy-cow-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: true
```
可以看到mug上面多了一个空行。

>请注意，我们在YAML中收到一些空行。为什么？模板引擎运行时，它会删除{{中的内容}}，但会完全保留其余空白。

>首先，可以使用特殊字符修改模板声明的花括号语法，以告诉模板引擎压缩空白。`{{-`（左边加上破折号和空格）表示应该在左边砍掉空白，`-}}`右边加上破折号代表在右边砍掉空白。换行符是空格！

解决空行问题：
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: true
  {{- end }}
```

## 2.with
with可以让您将当前范围（.）设置为特定对象。例如，我们一直在与.Values.favorites。让我们重写ConfigMap，将.范围更改为指向.Values.favorites：
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```
使用{{- with .Values.favorite }} {{- end }}后，with区块内的当前作用域就是`.Values.favorite`
所以当我们再使用`.drink`时，就代表是`.Values.favorite.drink`

## 3.range
helm中使用range来进行循环的工作

首先在values.yaml添加要用到的值
```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
```
templates/configmap.yaml
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
```

>该range函数将遍历pizzaToppings列表。每次通过循环，`.`的值都会发生改变，即 第一次`.`为mushrooms。将第二个迭代为cheese，依此类推。


我们可以.直接沿管道发送值，所以当我们这样做时{{ . | title | quote }}，它先发送.到title（标题大小写函数），然后发送到quote。如果运行此模板，则输出为：
```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
```
## 4.变量
### 定义和调用一个变量
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

### range遍历对象
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
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

渲染后的结果
```
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: right-gibbon-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
  toppings: |-
    drink: coffee
    food: pizza
```




### range使用变量来接收遍历出来的值和索引，例如：
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
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
    {{- range $index, $topping := .Values.pizzaToppings }}
    - {{ $index | toString | quote }}: {{ $topping | title | quote }}
    {{- end }}
```

渲染后：
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sanguine-hydra-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: true
  toppings: |-
    - "0": "Mushrooms"
    - "1": "Cheese"
    - "2": "Peppers"
    - "3": "Onions"
```




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1806/  

