# python操作redis

<!--more-->
1.安装redis模块

2.代码
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-python">import redis

if __name__ == '__main__':
    try:
        # 创建连接对象
        sr = redis.Redis(host='10.0.0.200')

        # 设置一个kv值,(返回设置结果true，false)
        # res = sr.set('name', 'soulchild')
        # print(res)

        # 获取一个key对应的值
        # res = sr.get('name')
        # print(res)

        # 删除key（删除成功几个就返回几）
        # print(sr.delete('a', 'b', 'c'))

        # 获取所有key
        # res = sr.keys()
        # print(res)

        # 获取所有以n开头的key
        # res = sr.keys('n*')
        # print(res)
    except Exception as e:
        print(e)</code></pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1467/  

