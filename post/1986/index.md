# python-re正则修饰符

<!--more-->
常用的标志位:
- re.M
多行匹配
- re.S
让`.`可以匹配换行符
- re.I
忽略大小写
> 使用多个标志位可以用`or`,`|`。例如re.search(r'xxx', s2, re.S|re.I)

```python
# # re.S:让"."可以匹配换行符
# s2 = "soul\nchild"
# m5 = re.search(r'l.c', s2, re.S)
# print(m5)
# # print(m5.groups())


##################################################################
# 正常情况下，多行字符串会被当作一个整体。
# re.M：开启多行匹配，一行一个整体,会影响^和$。
s3 = """00 74
28 99
387"""

# # 匹配以数字开头的内容
# m6 = re.findall(r'^\d+', s3)
# # 默认只能匹配一个00
# print(m6)  # ['00']
# # 开启多行匹配
# m6 = re.findall(r'^\d+', s3, re.M)
# print(m6)  # ['00', '28', '387']

# 匹配以数字结尾的内容
# # 默认只能匹配一个387
# m6 = re.findall(r'\d+$', s3)
# print(m6)  # ['387']
# # 开启多行匹配
# m6 = re.findall(r'\d+$', s3, re.M)
# print(m6)  # ['74', '99', '387']


```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1986/  

