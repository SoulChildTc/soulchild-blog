# django-操作django-redis

<!--more-->
中文文档：https://django-redis-chs.readthedocs.io/zh_CN/latest/
## 1.安装django-redis
```pip install redis django-redis``` 

## 2.配置settings.py
```python
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "CONNECTION_POOL_KWARGS": {"max_connections": 100},
            "PASSWORD": "",
        }
    }
}
```

## 3.使用
```python
from django_redis import get_redis_connection

# 从连接池获取一个连接
redis_conn = get_redis_connection('default')

# 设置key
redis_conn.set()
# 获取key
redis_conn.get()

# 清除所有库的所有key
redis_conn.flushall()

# 清除当前库的所有key
redis_conn.flushdb()
```

## 4.将redis做为django的session存储
修改settings.py
```python
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2055/  

