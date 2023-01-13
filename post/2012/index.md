# django-配置mysql

<!--more-->
1.安装pymysql
```bash
pip install pymysql
```


2.修改settings.py
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'django_test',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```
> 更多参数: https://docs.djangoproject.com/zh-hans/2.2/ref/settings/#engine

3.修改项目的__init__.py(和settings.py同级目录)
```python
from pymysql import install_as_MySQLdb
install_as_MySQLdb()
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2012/  

