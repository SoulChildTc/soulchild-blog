# python-re模块常用方法

<!--more-->
```python

import re

s = '''href="https://soulchild.cn/1976.html">python-lambda匿名函数</a></li><li><a 
href="https://soulchild.cn/1974.html">python-三元表达式、列表字典集合推导式、生成器表达式</a></li><li><a 
href="https://soulchild.cn/1971.html">prometheus-配置文件-rules(三)</a></li><li><a 
href="https://soulchild.cn/1965.html">prometheus-配置文件-scrape_configs、relabel_config等抓取相关配置(二)</a></li><li><a 
href="https://soulchild.cn/1963.html">prometheus-配置文件-global、rule_files、remote_read|write(一)</a></li><li><a 
href="https://soulchild.cn/1962.html">prometheus-二进制部署</a></li><li><a 
href="https://soulchild.cn/1958.html">prometheus-指标类型</a></li><li><a 
href="https://soulchild.cn/1956.html">python-字符串格式化</a></li><li><a 
href="https://soulchild.cn/1951.html">python-字符串基本操作</a></li> '''

# match#############################################################################
# # 从开头匹配(正则一定要匹配到文本的开头部分，否则匹配失败),只匹配一次
# m1 = re.match(r'href="(?P<url>.*?)">(?P<title>.*?)</', s)
#
# 返回找到的字符串位置(起始,结束)
# print(m1.span())
# 返回匹配到的第一个分组的起始和结束位置
# print(m1.span(1))
#
# # 获取匹配的结果.0代表匹配的整体内容，1是第一个分组，即第一个括号内匹配到的内容
# print(m1.group(0))
# print(m1.group(1))
# print(m1.group(2))
#
# # 元组的形式一次性展现匹配的全部内容
# print(m1.groups("a"))
#
# # 字典的形式展现匹配的内容。需要分组中指定名称,格式为(?P<key>pattern)
# print(m1.groupdict())

# search#############################################################################
# 只查找一次(和上面的区别是不用必须匹配开头的部分)
# m2 = re.search(r'(?P<url>http.*?)">(?P<title>.*?)</', s)

# 用法和match一致
# print(m2.groups())

# findall#############################################################################
# re.findall() 直接返回匹配到的内容列表
# m3 = re.findall(r'(?P<url>http.*?)">(?P<title>.*?)</', s)
# # 直接返回匹配到的内容列表
# print(m3)

# finditer#############################################################################
# re.finditer() 返回匹配到的match对象,迭代器形式
m4 = re.finditer(r'(?P<url>http.*?)">(?P<title>.*?)</', s)
# match对象的操作方法，参考re.match
print(next(m4).groups())

# sub#############################################################################
# 替换字符串，也可以指定替换次数
# res = re.sub(r'http.*?html', "替换链接", s)
# print(res)

# 还可以对匹配到的内容做处理后再进行替换
# 将匹配到的内容传给lambda函数,切割出指定部分在替换
res = re.sub(r'http.*?html', lambda x: "/" + x.group().rsplit('/')[-1], s)
print(res)

# compile#######################################################################################
# compile可以实现一个正则多次复用
# 使用指定的表达式生成一个表达式对象
p1 = re.compile(r'(?P<url>http.*?)">(?P<title>.*?)</')

# 使用这个表达式对象来匹配文本。
print(p1.findall(s))

s2 = 'http://soulchild.cn">阿就是看到你家</'
print(p1.search(s2).groups())
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1984/  

