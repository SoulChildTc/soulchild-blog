# python-互斥锁死锁与递归锁

<!--more-->
```python
from threading import Thread, Lock, RLock
import time

# 互斥锁死锁
# mutexA = Lock()
# mutexB = Lock()
# class MyThread(Thread):
#     def run(self):
#         self.f1()
#         self.f2()
#
#     def f1(self):
#         mutexA.acquire()
#         print("%s 拿到了A锁" % self.name)
#
#         mutexB.acquire()
#         print("%s 拿到了B锁" % self.name)
#         mutexB.release()
#
#         mutexA.release()
#
#     def f2(self):
#         mutexB.acquire()
#         print("%s 拿到了B锁" % self.name)
#         time.sleep(0.1)
#
#         mutexA.acquire()
#         print("%s 拿到了A锁" % self.name)
#         mutexA.release()
#
#         mutexB.release()
#
#
# for i in range(4):
#     t = MyThread()
#     t.start()
#
"""
上面的互斥锁死锁流程
1、
Thread-1 拿到了A锁  -->  Thread-1 拿到了B锁  --> Thread-1 释放B锁  --> Thread-1 释放A锁  -->  
Thread-1 拿到了B锁  -->  sleep   (此时A锁处于释放状态,B锁被占有)

2、
Thread-2 拿到了A锁  -->  Thread-2需要拿B锁，但是B锁在Thread-1上(所以拿不到),需要等待Thread-1释放B锁

3、
Thread-1的sleep结束，需要拿A锁，但是A锁在Thread-2上(所以拿不到),需要等待Thread-2释放A锁

Thread-1和Thread-2都在等待对方释放锁，所以锁死了.解决上面的问题需要用到递归锁RLock

[Thread-1拿到B锁，想要拿A锁，Thread-2拿着A锁，想要B锁]

"""

##########################################################################################


"""
递归锁：
递归锁同一时刻只能被一个线程占用，一个线程可以acquire多次。
递归锁有一个初始计数器,值为0,每次acquire计数器就会加1,每次release就减1,计数器为0才会释放锁.
只有它的计数为0的时候,才能被别的线程抢夺.所以在锁完全释放之前，不会被其他线程抢走，就不会存在死锁的问题了。
"""

# 递归锁
mutexA = mutexB = RLock()


class MyThread(Thread):
    def run(self):
        self.f1()
        self.f2()

    def f1(self):
        mutexA.acquire()
        print("%s 拿到了A锁" % self.name)

        mutexB.acquire()
        print("%s 拿到了B锁" % self.name)
        mutexB.release()

        mutexA.release()

    def f2(self):
        mutexB.acquire()
        print("%s 拿到了B锁" % self.name)
        time.sleep(0.1)

        mutexA.acquire()
        print("%s 拿到了A锁" % self.name)
        mutexA.release()

        mutexB.release()


for i in range(4):
    t = MyThread()
    t.start()
"""
上看的操作其实就是一把锁，只不过有两个名字
"""
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1992/  

