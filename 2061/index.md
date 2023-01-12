# django-路由规则

<!--more-->
## path
```
urlpatterns = [
    path('', views.index, name="index"),
    path('home/', views.home, name="home"),

    # 带参数的路由url,路径转换器
    # 官方文档:https://docs.djangoproject.com/zh-hans/2.2/topics/http/urls/#path-converters
    # int类型,<int:age>只会匹配整数类型
    path('show/<int:age>/', views.show, name="show"),
    # slug类型,只匹配数字字母下划线
    path('list/<slug:name>/', views.list_user, name="list_user"),    # path类型,匹配所有内容
    path('access/<path:c1>/', views.access, name="access"),
    # 直接使用参数
    path('<name>/<age>', views.test2, name="arg"),
]
```

## re_path
```python
    # re_path
    re_path(r'(?P<arg1>^a\d+)/(?P<arg2>\d{2})/', views.test1, name="re_arg"),
    re_path(r'tel/(?P<phone>(^13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8})/$', views.get_phone,
            name="get_phone"),

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2061/  

