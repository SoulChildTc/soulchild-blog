# python-字符串基本操作

<!--more-->
### 1.查找
```python
s='asnd82nkldodkspby'
#find和index都是查找字符串的下标，find找不到会返回-1，index会抛出异常
s.find('n')  #2
s.index('n')  #2
```

### 2.字符串判断
startswith、endswith、isalpha、isdigit、isalnum、isspace
```python
#是否以h开头
'helloworld'.startswith('h')

#是否以d结尾
'helloworld'.endswith('d')

#是否全是字母
'helloworld'.isalpha()

#是否全是数字,只认正整数，不认小数、负数
'helloworld'.isdigit()

#是否全是字母数字
'helloworld'.isalnum()

#是否全是空格
'helloworld'.isspace()
```

### 3.统计字符串出现次数
```python
print('helloworld'.count('o'))
2
```

### 4.字符串替换
```python
# 将l替换为w，替换1次，不指定次数就全部替换
print('helloworld'.replace('l','w',1))
```

### 5.字符串分割
split、rsplit、partition、rpartition
```python
#split###################################################
s='python|java|golang|ruby|erlang|php'

# 以`|`分割3次，返回一个列表。不指定次数就全部分割
s.split('|',3)
# 结果：['python', 'java', 'golang', 'ruby|erlang|php']

# 从右边开始分割
s.rsplit('|',3)
# 结果：['python|java|golang', 'ruby', 'erlang', 'php']

#partition###############################################
url="www.soulchild.cn"
# 将字符串分割为三部分，分别是:'分割符前面的内容'、'分割符'、'分割符后面的内容'。
# 只会以最左边的分割符开始分割
url.partition('soulchild')
# 结果：('www.', 'soulchild', '.cn')

# 从右边开始分割
url.rpartition('soulchild')
```

### 6.修改大小写
- capitalize:首字母转换成大写
- upper:全部转换成大写 
- lower:全部转换成小写
- title:每个单词的首字母转换成大写
```python
# capitalize: 
print('hello world'.capitalize())
# 结果： Hello world

```

### 7.空格处理
- ljust: 在最右边用空格补够字符长度。默认是空格也可以自己指定fillchar参数
- rjust: 同上，但是会在最左边补
- center: 在两边补，字符串在中间
- lstrip: 去除左边空格,默认去除空格，也可以指定其他字符--chars参数
- rstrip: 去除右边空格,默认去除空格，也可以指定其他字符--chars参数
- strip: 首尾去除空格,默认去除空格，也可以指定其他字符--chars参数
```python
# hello有5个字符，我们要10个，所以在hello后面会补5个空格
print('hello'.ljust(10))

```

### 8.拼接可迭代对象
- join: 使用指定的字符串连接可迭代对象的每一个元素，生成一个新的字符串

```python
s=['python', 'java', 'golang', 'ruby', 'erlang', 'php']
# 使用/将列表的每一个元素连接起来
print('/'.join(s))
# 结果: python/java/golang/ruby/erlang/php
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1951/  

