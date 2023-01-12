# python-字符串格式化

<!--more-->
## 方式一： %格式化
常用的一些：
- %s: 字符串
  1. %10s:使用空格在左边补齐10个字符
  2. %-10s:使用空格在右边补齐10个字符
  3. %.3s:只保留前3个字符
- %d: 整数
  1. %3d:使用空格在左边补齐10位数
  2. %-3d:使用空格在右边补齐10位数
  3. %03d:使用0补齐3位数。比如5补齐后就是005
- %f: 浮点数
  1. %.2f:小数点后保留2位（四舍五入）
  2. %6.2f:在数值前面用空格补齐6位数，小数点后保留2位（四舍五入）
  3. %-6.2f:在数值后面用空格补齐6位数，小数点后保留2位（四舍五入）
  
### 1.直接使用
```python
# 直接百分号使用
'你好啊，我是%s,今天是%d月%d日' % ('soulchild',8,31)

# 添加别名
'你好啊，我是%(name)s,今天是%(month)d月%(day)d日' % {'name':'soulchild','month':8,'day':31}
```

### 2.填充补齐
```python
# %-10s：表示使用空格在右边补齐10个字符
s=['python', 'java', 'golang', 'ruby', 'erlang', 'php']
for i,k in enumerate(s):
    print('%-10s%d' %(k,i))

# 结果：
python    0
java      1
golang    2
ruby      3
erlang    4
php       5

##########################################################
# %10s：表示使用空格在左边补齐10个字符
s=['python', 'java', 'golang', 'ruby', 'erlang', 'php']
for i,k in enumerate(s):
    print('%10s%d' %(k,i))

# 结果：
    python0
      java1
    golang2
      ruby3
    erlang4
       php5

##########################################################
# %05d：表示使用0在前面补齐5位数
s=['python', 'java', 'golang', 'ruby', 'erlang', 'php']
for i,k in enumerate(s):
    print('%-10s%05d' %(k,i))

# 结果：
python    00000
java      00001
golang    00002
ruby      00003
erlang    00004
php       00005

```

## 方式二：format格式化
使用`{}`占位
格式：
- {}:----------按照顺序填充
- {索引}: ----------按指定位置填充
- {name}: ----------按照名称或字典key
- {:b}{:d}{:o}{:x}{.3f}: ----------b:二进制、d:十进制 o:8八进制 x:十六进制 .3f:保留3位小数(四舍五入)
- {:,}: ----------千位分隔符的方式显示数值。例如:100,000
- {:0>4.1f}: ----------0>:使用0左边填充,可以自定义填充符。4:总长度。.1f:保留1位小数(四舍五入)
  - <，在右边填充
  - \>，在左边填充
  - ^，在两边填充
- {!r}: ----------!r:不使用转意符，相当于r'abc\ndef'

```python
# 按顺序填充
print('你好啊，我是{},今天是{}月{}日'.format('soulchild',8,31))
# 你好啊，我是soulchild,今天是8月31日

# 按指定位置填充
print('你好啊，我是{1},今天是{0}月{2}日,{2}日是星期一'.format(8,'soulchild','31'))
# 你好啊，我是soulchild,今天是8月31日,31日是星期一

# 按照名称填充
print('你好啊，我是{name},今天是{month}月{day}日'.format(name='soulchild',month=8,day=31))
# 你好啊，我是soulchild,今天是8月31日

# 通过字典的方式填充
info = {'name': 'soulchild', 'month': 8, 'day': 31}
print('你好啊，我是{name},今天是{month}月{day}日'.format(**info))
# 你好啊，我是soulchild,今天是8月31日


# 千位分隔符的方式显示数值
print('我有多少钱？你去数吧：{:,}'.format(100000123120000))
我有多少钱？你去数吧：100,000,123,120,000

# 0>4：长度不满足4的话，在数值的前面用0进行补齐，.1f:保留1位小数(四舍五入)
print('已下载{:0>4.1f}%'.format(5.21))

# 不解析转义符
print('内容:{0}\n原内容{0!r}'.format('soul\nchild'))
内容:soul
child
原内容'soul\nchild'
```


















---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1956/  

