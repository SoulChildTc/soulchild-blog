# python-协程

<!--more-->
## 串行执行程序
```python
import time
import random

def producer():
    res = []
    for i in range(9999990):
        res.append(i)
    return res


def consumer(c):
    x = 0
    for i in c:
        x += i

    return x


start = time.time()
res = producer()
print(consumer(res))
print(time.time() - start)
```
## yield并发执行程序
```python
def producer(g):
    res = ""
    for i in range(9999990):
        res = g.send(i)
    return res


def consumer():
    num = 0
    while True:
        x = yield num  # x是send发送来的值
        num += x


start = time.time()
c1 = consumer()
next(c1)
print(producer(c1))
print(time.time() - start)
```


上面的两种方式执行结果是串行比较快
因为下面的并发执行中没有遇到IO,在两个函数之间交替运行,cpu频繁进行上下文切换，反而会降低速度

上面的串行中只切换一次,所以上面的串行比并发快在上下文切换上了。



>虽然上面用了多任务交替运行，但是没有遇到IO其实是没必要切换的.
>但是目前只是使用yield的话，并不能 识别到有IO操作 再做切换操作


## 使用greenlet模块,可以简化函数间切换的操作，但也不能解决IO问题
```python
from greenlet import greenlet

def test1():
    print(12)
    gr2.switch()  # 切换到gr2 
    print(34)


def test2():
    print(56)
    gr1.switch()  # 切换到gr1
    print(78)


gr1 = greenlet(test1)
gr2 = greenlet(test2)
gr1.switch()  # 执行过程 test1[print(12)] --> test2[print(56)] --> test1[print(34)] 程序结束

# 下面的执行效率比yield要慢很多，不知道为什么
X = 0
NUM = 0

def producer(area):
    global X
    for i in range(area):  # 9999990
        X = i
        g2.switch()

def consumer():
    global NUM
    while True:
        NUM += X
        g1.switch()


# 不可以传函数参数
g1 = greenlet(producer)
g2 = greenlet(consumer)

start = time.time()
# 切换到g1运行,可以传参
g1.switch(9999990)
print(NUM)
print(time.time() - start)
```

## Gevent模块
```python
import gevent
from gevent import monkey

# 默认不支持阻塞其他IO操作[默认支持gevent.sleep(3)],要支持其他IO操作需要打补丁。
monkey.patch_all()


def eat(name):
    print("%s eat 1 " % name)
    # gevent.sleep(3)
    time.sleep(2)
    print("%s eat 2 " % name)


def play(name):
    print("%s play 1 " % name)
    time.sleep(3)
    print("%s play 2 " % name)


# 创建协程任务，gevent遇到阻塞就会切换执行协程任务
g1 = gevent.spawn(eat, "soulchild")
g2 = gevent.spawn(play, "soulchild")
print("ok")
for i in range(5):
    print(i)
    # 模拟IO阻塞,这时g1和g2会被调用
    time.sleep(0.1)
# 模拟IO阻塞,这时g1和g2会被调用
gevent.joinall([g1, g2])

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2023/  

