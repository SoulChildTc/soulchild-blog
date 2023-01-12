# 僵尸进程与孤儿进程

<!--more-->
```python
"""
僵尸进程是当子进程比父进程先结束，而父进程又没有回收子进程，释放子进程占用的资源，此时子进程将成为一个僵尸进程。
"""
from multiprocessing import Process
import os
import time

# def task(n):
#     print('%s is running' % os.getpid())
#     # 获取父pid
#     print('ppid is %s' % os.getppid())
#     time.sleep(n)
#     print('%s is done' % os.getpid())
#
#
# if __name__ == '__main__':
#     p = Process(target=task, args=(10,))
#     p.start()
#     print('主', os.getpid())
#     time.sleep(10000)

# 运行上面的示例，可以实现僵尸进程,进程状态变成了"Z"
# ps aux | grep [3]8194
# soulchild        38194   0.0  0.0        0      0   ??  Z     9:00AM   0:00.00 (Python)


"""
孤儿进程指的是在其父进程执行完成或被终止后仍继续运行的一类进程。
这些孤儿进程将被init进程(进程号为1)所收养，并由init进程对它们完成状态收集管理工作。
"""

import os

mpid = os.getpid()
ppid = os.getppid()
print("我是主进程，主进程id：%s,父进程id:%s" % (mpid, ppid))
# fork会生成一个子进程,后续代码主进程和子进程都会执行
# pid的值有两个：
# 在父进程中pid的值为子进程的pid
# 在子进程中pid的值为0
pid = os.fork()

if pid == 0:
    print("我是子进程，子进程id:%s,父进程id:%s" % (os.getpid(), os.getppid()))
    time.sleep(1)
    print("我是子进程，子进程id:%s,父进程id:%s" % (os.getpid(), os.getppid()))
else:
    print("我是主进程，主进程id:%s,父进程id:%s,我的子进程id:%s" % (os.getpid(), os.getppid(), pid))

# 上面的代码需要在命令行中执行,在pycharm中执行看不出效果

# 执行结果
# [soulchild@MBP ~]$ python3 03-僵尸进程孤儿进程.py
# 我是主进程，主进程id：38979,父进程id:12937
# 我是主进程，主进程id:38979,父进程id:12937,我的子进程id:38980
# 我是子进程，子进程id:38980,父进程id:38979
# [soulchild@MBP ~]$ 我是子进程，子进程id:38980,父进程id:1

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2139/  

