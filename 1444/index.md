# django-创建项目

<!--more-->
1.安装django框架
```pip install django```

2.创建一个项目
```django-admin startproject test```

3.创建一个APP
```
cd test
python startapp app01
```

修改settings.py

4.注册app01
`INSTALLED_APPS`添加`app01`

5.修改语言和时区
```
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
# 不使用国际时间
USE_TZ  = False
```

6.配置静态文件目录
```python
# 文件末尾添加
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static")
]
```

7.配置静态文件的URL
```python
# 这个路径指的是浏览器中url中的路径，STATICFILES_DIRS是指python查找文件的路径
STATIC_URL = '/static/'
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1444/  

