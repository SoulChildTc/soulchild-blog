# python-取出中间的文本

<!--more-->
```python
|________|_________|____________|________|______|
         { 左边文本 }             {右边文本}

def get_mid_str(s, start_str, stop_str):
    # 查找左边文本的结束位置
    start_pos = s.find(start_str)
    if start_pos == -1:
        return None
    start_pos += len(start_str)
    # 查找右边文本的起始位置
    stop_pos = s.find(stop_str, start_pos)
    if stop_pos == -1:
        return None

    # 通过切片取出中间的文本
    return s[start_pos:stop_pos]


txt = r'''<h2 class="post-title" itemprop="name headline">
<a itemtype="url" href="https://soulchild.cn/1971.html">
prometheus-配置文件-rules(三)</a></h2>
'''

print(get_mid_str(txt, 'href="', '">'))
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1980/  

