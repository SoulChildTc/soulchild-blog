# django-模板关闭html转义

<!--more-->
默认html转义是开启的，比如`<h1>ok<h1>`会被转成`&lt;h1&gt;ok&lt;/h1&gt;`。在网页中所见即所得


{"content": "<h1>ok<h1>"}

1.过滤器关闭转义
```
{{ content | safe }}  {# 在网页中显示的是h1标题 #}
```

2.标签关闭转义
```html
{% autoescape off %}
    {{ content }}  {# 在网页中显示的是h1标题 #}
{% endautoescape %}
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2019/  

