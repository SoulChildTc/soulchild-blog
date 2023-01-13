# django3.1使用pymysql报错  mysqlclient 1.4.0 or newer is required; you have 0.10.1.

<!--more-->
raise ImproperlyConfigured('mysqlclient 1.4.0 or newer is required; you have %s.' % Database.__version__)
django.core.exceptions.ImproperlyConfigured: mysqlclient 1.4.0 or newer is required; you have 0.10.1.


修改__init__.py(settings.py同级目录下)
```python
import pymysql
pymysql.install_as_MySQLdb()
pymysql.version_info = (1, 4, 13, "final", 0)
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2028/  

