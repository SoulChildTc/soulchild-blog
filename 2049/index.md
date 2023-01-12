# django-自定义过滤器

<!--more-->
官方文档: https://docs.djangoproject.com/zh-hans/3.1/howto/custom-template-tags/

### 1.创建目录
在应用目录下，创建`templatetags`目录，并创建一个filters.py文件，名字自定义。

### 2.编辑filters.py
```python
from django import template


register = template.Library()


# 无参数，模板调用时使用函数名即可,例{{ 2|mod }}
@register.filter  
def mod(num):
    """判断num是否为偶数"""
    return num % 2 == 0


# 为过滤器命名,模板调用的时候使用这个名字,例{{ 'OK'|my_lower }}
@register.filter(name="my_lower")  
def lower(v):
    """转换为小写"""
    return v.lower()


# 多参数的过滤器,只是举个例子
@register.filter
def replace(value, arg):
    """删除字符串中的字符,可以指定次数"""
    args = eval(arg)
    old = args[0]
    count = args[1]
    return value.replace(old, '', count)
```

###  3.编写模板
load: 填写的是py文件名
```
{% load filters %}

{{ 2|mod }}

{{ "OK"|my_lower }}

{{ "helloworld"|replace:"('o',1)" }}
```


> 更多使用方法可以查看内置过滤器是怎么定义的
lib/python3.6/site-packages/django/template/defaultfilters.py


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2049/  

