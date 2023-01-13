# django-中间件

<!--more-->
## django1.x的使用方法
### 1.在应用目录下建立middleware.py

```
# 类名可以自定义
class TestMiddleware:
    """中间件类"""

    # 中间件函数名是固定的
    def __init__(self):
        """服务重启之后，接收第一个请求时调用"""
        print('____init中间件____')

    def process_request(self, request):
        """产生request的时候调用，在url匹配之前"""
        print('____request中间件____')

    def process_view(self, request, *args, **kwargs):
        """url匹配后,视图函数调用前"""
        print('____view中间件____')

    def process_response(self, request, response):
        """视图函数调用后，返回给客户端前调用"""
        return response

    def process_exception(self, request, exception):
        """视图函数发生异常时，调用次函数"""
        # return HttpResponse(exception1)
        print('process_exception---Test1')
```

### 2.注册中间件，修改settings.py,在MIDDLEWARE_CLASSES中添加如下内容
```python
'booktest.middleware.TestMiddleware',
```
> 注意中间件加载是有顺序的,从上到下执行

## django2.x以上的版本

### 1.在应用目录下建立middleware.py
```
from django.utils.deprecation import MiddlewareMixin

# 类名可以自定义
class TestMiddleware(MiddlewareMixin):
    """中间件类"""

    def __init__(self, get_response):
        """当 Web 服务器启动时，__init__() 只被调用一次"""
        super().__init__(get_response)
        print('____init中间件____')

    def process_request(self, request):
        """产生request的时候调用，在url匹配之前"""
        print('____request中间件____')

    def process_view(self, request, view_fun, *args, **kwargs):
        """url匹配后,视图函数调用前"""
        print('____view中间件____')

    def process_response(self, request, response):
        """视图函数调用后，返回给客户端前调用"""
        print('____response中间件____')
        return response

    def process_exception(self, request, exception):
        """视图函数发生异常时，调用次函数"""
        # return HttpResponse(exception1)
        print('process_exception---Test1')
```

### 2.注册中间件，修改settings.py,在MIDDLEWARE中添加如下内容
```python
'booktest3.middleware.TestMiddleware',
```
> 注意中间件加载是有顺序的,从上到下执行


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2053/  

