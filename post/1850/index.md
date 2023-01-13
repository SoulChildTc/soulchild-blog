# python操作redis-sentinel

<!--more-->
```python
# -*- coding: utf-8 -*-

import redis
from redis.sentinel import Sentinel

# 连接哨兵服务器(主机名也可以用域名)
sentinel = Sentinel([('10.0.0.30', 26379),
                     ('10.0.0.30', 26379),
                     ('10.0.0.30', 26379),
                     ],
                    socket_timeout=0.5)

# 获取主服务器地址
master = sentinel.discover_master('mymaster')
print('主服务器地址:', master)

# 获取从服务器地址
slave = sentinel.discover_slaves('mymaster')
print('从服务器地址:', slave)

# 获取主服务器连接实例
master = sentinel.master_for('mymaster', socket_timeout=0.5, db=15)
print('主服务器连接实例：', master)

# 获取从服务器进行读取（默认是round-roubin）
slave = sentinel.slave_for('mymaster', socket_timeout=0.5, db=15)

def test(i):
    input("任意键继续...")

    w_ret = master.set('foo', i)
    print('set结果:', w_ret)


    r_ret = slave.get('foo')
    print('get结果:',r_ret.decode())



for i in range(1,100):
    test(i)

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1850/  

