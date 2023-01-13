# xpath-基础

<!--more-->
## 一.xpath语法
`/`: 根节点开始查找
`//`: 从任意节点开始找
`.`: 当前节点
`..`: 上一级节点


### 属性查找
`//h2[@class="post-title"]`: 查找class属性为xxx的h2标签
`//div[@itemprop='articleBody']`: 查找itemprop属性为articleBody的div标签
`//h2[@class="post-title"]/a`: 查找class属性为post-title的h2标签，下面的所有a标签

### 获取标签的文本内容
`(//h2[@class="post-title"]/a)[2]/text()`: 获取标签的文本内容(当前标签的文本，不包括子标签)
`(//h2[@class="post-title"]/a)[2]//text()`: 获取标签的文本内容(包括子标签)

### 获取标签的属性值
`//h2[@class="post-title"]/a/@href`: 获取标签的属性值


### 属性+位置查找标签
`(//h2[@class="post-title"]/a)[2]`: 第二个a标签

### last
`(//h2[@class="post-title"]/a)[last()]`: ...最后一个a标签
`(//h2[@class="post-title"]/a)[last()-1]`: ...倒数第二个a标签

### position
`(//h2[@class="post-title"]/a)[position()>3]`: 获取第三个往后的a标签
`(//h2[@class="post-title"]/a)[position()>2][position()<5]`: 先从第三个开始找,再找4个标签。既获取第3-6个标签


### contains 包含
`//div[contains(@class,"article") and contains(@class,"mb15")]` # 获取div的class属性中包含article和mb15的标签
`//div[contains(@class,"article") or contains(@class,"mb15")]` # 获取div的class属性中包含article或mb15的标签

### 以xx开头xx结尾
`div[start-with(@class,'a')]` # 获取div的class属性中以a开头的标签
`div[ends-with(@class,'b')]` # 获取div的class属性中以a结尾的标签


## 二.python操作
```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
"""
@author:soulchild
@file:xpath_learn.py
@time:2020/11/16
"""
from lxml import etree
import requests

if __name__ == '__main__':
    # 一、加载本地html文件
    # tree = etree.parse('./xxx.html')

    # 二、加载网络资源
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36"}
    resp = requests.get('https://soulchild.cn', headers=headers).content.decode('utf-8')
    tree = etree.HTML(resp)
    ele = tree.xpath('//h2[@class="post-title"]/a/text()')
```









---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2075/  

