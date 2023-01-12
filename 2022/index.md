# django-静态文件配置

<!--more-->
settings.py配置三个部分
```
# 添加内置标签配置
TEMPLATES = [
    {
        ......
        'OPTIONS': {
            ......
            'builtins': ['django.templatetags.static']
        },
    },
]

# 配置静态文件url路径
STATIC_URL = '/static/'

# 配置静态文件路径
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static")
]
```

配置完成后就可以在模板中直接使用了
```
<script src="{% static "js/jquery.js" %}" ></script>
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2022/  

