# helm模板开发-模板功能和管道(二)

<!--more-->
##模板函数
1.将.Values对象中的字符串注入模板时，我们需要的是字符串。我们可以通过调用quote函数来做到这一点：
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```
模板函数遵循以下语法functionName arg1 arg2...。在上面的代码段中，quote .Values.favorite.drink调用quote函数并将其传递给单个参数。

2.查看渲染后的结果
```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: singed-puffin-configmap
data:
  myvalue: "Hello World"
  drink: "hello"
  food: "world"
```
可以看到drink和food都被加上了引号


> 模板函数拥有60多种可用函数。其中一些是由[Go模板语言](https://godoc.org/text/template)本身定义的。其他大多数都是[Sprig模板库](https://godoc.org/github.com/Masterminds/sprig)的一部分。我们将通过示例逐步介绍其中的许多内容。

##管道
### 模板语言的强大功能之一是其管道概念。管道利用UNIX的概念，是将一系列模板命令链接在一起以紧凑表达一系列转换的工具。换句话说，管道是按顺序完成多项工作的有效方式。
###upper函数：
我们添加了upper函数，将food的值转换成大写
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```
渲染后的效果：
```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: exegetical-wildebeest-configmap
data:
  myvalue: "Hello World"
  drink: "hello"
  food: "WORLD"
```

### repeat函数:
下面的例子将我们获取到的值，使用repeat函数重复5次
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```
渲染后的效果：
```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quelling-sparrow-configmap
data:
  myvalue: "Hello World"
  drink: "hellohellohellohellohello"
  food: "WORLD"
```
### default函数
default可以设置一个默认值
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | default "my is default" | upper | quote }}
```
手动将favorite.food的值设置为空：
`helm install --dry-run --debug --set=favorite.food=null .`

渲染后的效果
```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ungaged-grizzly-configmap
data:
  myvalue: "Hello World"
  drink: "hellohellohellohellohello"
  food: "MY IS DEFAULT"
```

在实际chart中，所有静态默认值都应位于values.yaml中，并且不应使用default命令重复（否则它们将是多余的）


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1804/  

