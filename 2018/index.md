# django-模板继承

<!--more-->
父模版
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{% block title %} 默认 {% endblock %}</title>
</head>
<body>
<h1>header</h1>

{% block b1 %}
    <p>模板继承，我是默认内容，可以被修改</p>
{% endblock b1 %}

<h1>footer</h1>
</body>
</html>
```

子模板
```html
{% extends 'tpl/index.html' %}

{% block title %} 新的标题 {% endblock %}

{% block b1 %}
    {{ block.super }}  {# 获取模版默认的内容 #}
    <p>替换父模板的内容</p>
{% endblock %}
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2018/  

