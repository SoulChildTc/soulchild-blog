# django-url反向解析

<!--more-->
app_name和namespace介绍https://www.liujiangblog.com/course/django/136
## 1.配置根url
```python
# 指定包含的url为tpl.urls，app_name为tpl,命名空间为"tpl"
path('', include(('tpl.urls', 'tpl'), namespace="tpl"))

# 另外一种写法
# 没有指定app_name,需要到App.urls文件中添加app_name = 'App'
path('', include('App.urls', namespace="App")),
```
> 获取当前的app_name和namespace
> request.resolver_match

## 2.配置具体url的name
```python
urlpatterns = [
    path('login/', views.login, name="login"),
    path('reverse_url/', views.reverse_url, name="reverse_url"),
    path('reverse_test/', views.reverse_test, name="reverse_test"),

    re_path(r'(.*?)/(.*?)/', views.url1, name="url1"),
    re_path(r'(?P<arg1>.*?)/(?P<arg2>.*?)/', views.url1, name="url2"),
]
```

## 2.模板语法

写死的
```html
<a href="/login/">普通url,写死</a>
```

模板语法
```html
<!-- tpl是namespace,login是url的名称，上面name定义的 -->
<a href="{%url 'tpl:login' %}">根据namespace获取</a>
```

带参数的
```html
# 位置参数
<a href="{%url 'tpl:login' '参数1' '参数2' %}">根据namespace获取</a>

# 命名参数
<a href="{%url 'tpl:url2' arg1='soulchild' arg2=12 %}">根据namespace获取的,命名参数url: {%url 'tpl:url2' arg1='soulchild' arg2=12 %}</a>
```

## 3.python中reverse反向获取url
不带参数
```
def reverse_test(request):
    print(reverse("tpl:login"))
    return HttpResponse("python reverse")
```

位置参数
```
def reverse_test(request):
    print(reverse("tpl:url1", args=('arg1', 'arg2')))
    return HttpResponse("python reverse")
```

命名参数
```
def reverse_test(request):
    print(reverse("tpl:url2", kwargs={'arg1': '1', 'arg2': '2'}))
    return HttpResponse("python reverse")
```












---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2013/  

