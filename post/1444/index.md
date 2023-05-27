# django-创建项目

<!--more-->
### 安装django

```bash
pip install django
```

1.创建一个项目

```bash
django-admin startproject test
```

2.创建一个APP

```bash
cd test
python startapp app01
```

### 修改settings.py

1.注册app01
`INSTALLED_APPS`添加`app01.apps.App01Config`

2.修改语言和时区

```python
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
# 不使用国际时间
USE_TZ  = False
```

3.配置静态文件目录

```python
# 文件末尾添加
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static")
]
```

4.配置静态文件的URL

```python
# 这个路径指的是浏览器中url中的路径，STATICFILES_DIRS是指python查找文件的路径
STATIC_URL = '/static/'
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1444/  

