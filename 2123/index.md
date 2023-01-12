# python-GIL锁介绍进程线程效率比较

<!--more-->
```
"""
原理剖析:http://c.biancheng.net/view/5537.html
GIL的功能是：在CPython解释器中执行的每一个Python线程，都会先锁住自己(线程)，以阻止别的线程执行。
在cpython解释器中,同一个进程下开启的多线程，同一个时间只能有一个线程执行，无法利用多核优势。
也就是说由于全局解释器锁(GIL)的原因，cpython没有真正意义上的多线程
"""
# IO密集型适合多线程
# 计算密集型适合多进程

from multiprocessing import Process
from threading import Thread
import os
import time


########################################################################
# 计算密集型
# def work():
#     res = 1
#     for i in range(100000000):
#         res *= i
#     return res
#
#
# if __name__ == '__main__':
#     print("cpus", os.cpu_count())
#     start_time = time.time()
#     l = []
#     # 将计算任务，用多进程和多线程运行4次的时间比较
#     for i in range(4):
#         # 4个进程基本同时运行(cpu支持数量)，单进程运行需要4s，所以总时间在4s多一点，因为同一时间有4个进程同时运行
#         # w = Process(target=work)  # 运行时间4.5s
#
#         # 4个线程并发执行，每个线程之间由于有GIL锁的原因,线程会来回切换，实际上同一时间只有一个线程在执行。
#         # 由于cpu计算的时候并没有同时计算，所以单线程4s,4线程需要16s多一点
#         w = Thread(target=work)   # 运行时间16.3s
#         l.append(w)
#         w.start()
#
#     for i in l:
#         i.join()
#
#     print('运行结束%s' % (time.time() - start_time))

########################################################################
# IO密集型
def work():
    time.sleep(2)


if __name__ == '__main__':
    print("cpus", os.cpu_count())
    start_time = time.time()
    l = []
    # 将IO任务，用多进程和多线程运行400次的时间比较
    for i in range(400):  # 开启的数量越多，进程和线程的差距越明显
        # 开启400个进程,子进程需要复制主进程的资源,复制是有损耗的,所以单次运行时间是2秒,加上损耗将近1秒
        w = Process(target=work)  # 运行时间2.99s

        # 开启400个线程,线程的资源是共享主线程的,因为没有涉及到计算，运行时间取决于IO时间
        # 所以单次运行时间是2s,总时间在2s多一点
        # w = Thread(target=work)  # 运行时间2.02s
        l.append(w)
        w.start()

    for i in l:
        i.join()

    print('运行结束%s' % (time.time() - start_time))
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2123/  

