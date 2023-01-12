# python-装饰器

<!--more-->
## 装饰器原则：
1.不改变原有代码
2.不改变调用方式
3.不改变原函数返回值

## 例如：

一个普通的函数
```python
import time
def web(s):
    time.sleep(2)
    print(s)

```

### 一、 下面用装饰器实现计算此函数的运行时间
```python
def timer(f):
    def inner(*args, **kwargs):
        start = time.time()
        result = f(*args, **kwargs)
        end = time.time()
        print("{}函数执行了{}s.".format(f.__name__, stop - start))
        return result
    return inner


@timer  # 相当于web=timer(web)
def web(s):
    time.sleep(2)
    print(s)
    return True


print(web('哒哒哒哒哒哒'))  # 相当于执行inner('哒哒哒哒哒哒')
```
> 上面的装饰器本身是没有参数的，下面我我们定义一个有参数的装饰器

### 二、 在调用装饰器的时候获取指定单位的时间
```python
import time
def timer(unit="s"):
    def wrapper(f):
        def inner(*args, **kwargs):
            start = time.time()
            result = f(*args, **kwargs)
            stop = time.time()
            exec_time = stop - start
            if unit == 's':
                print("{}函数执行了{}s.".format(f.__name__, int(exec_time)))
            elif unit == 'ms':
                print("{}函数执行了{:.1f}ms.".format(f.__name__, exec_time * 1000))

            return result

        return inner

    return wrapper


@timer(unit='ms')  # timer(unit='ms')执行结果是wrapper,相当于@wrapper,然后就是web=wrapper(web).web=inner
def web(s):
    time.sleep(2)
    print(s)
    return True


print(web('哒哒哒哒哒哒'))  # inner('哒哒哒哒哒哒'),inner的父级函数有unit这个参数，所以可以实现显示不同单位的时间
```
> 上面的装饰器基本没有什么大问题了，但是函数是有它的属性的，比如__name__、__doc__。我们可以使用下面的方式修改
```python
import time
from functools import wraps  # 导入模块
def timer(unit="s"):
    def wrapper(f):
        @wraps(f)    # 在内部的函数中使用wraps装饰器就可以了
        def inner(*args, **kwargs):
            start = time.time()
            result = f(*args, **kwargs)
            stop = time.time()
            exec_time = stop - start
            if unit == 's':
                print("{}函数执行了{}s.".format(f.__name__, int(exec_time)))
            elif unit == 'ms':
                print("{}函数执行了{:.1f}ms.".format(f.__name__, exec_time * 1000))

            return result

        return inner

    return wrapper


@timer(unit='ms')  # timer(unit='ms')执行结果是wrapper,相当于@wrapper,然后就是web=wrapper(web).web=inner
def web(s):
    time.sleep(2)
    print(s)
    return True


print(web('哒哒哒哒哒哒'))  # inner('哒哒哒哒哒哒'),inner的父级函数有unit这个参数，所以可以实现显示不同单位的时间


```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1320/  

