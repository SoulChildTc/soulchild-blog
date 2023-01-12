# awk命令使用

<!--more-->
原文链接：[http://www.ruanyifeng.com/blog/2018/11/awk.html](http://www.ruanyifeng.com/blog/2018/11/awk.html)
## 基本用法
awk是一行一行处理数据的
```
# 格式
$ awk 动作 文件名

# 示例
$ echo 'this is a test' | awk '{print $1}'
this
```


## 常见变量
`0`: 完整的内容
`$n`: 分割后的内容$1就是第一部分.$2就是第二部分
`FILENAME`：当前文件名
`FS`：字段分隔符，默认是空格和制表符。也可以`-F`参数来修改
`RS`：行分隔符，用于分割每一行，默认是换行符。
`OFS`：输出字段的分隔符，用于打印时分隔字段，默认为空格。
`ORS`：输出记录的分隔符，用于打印时分隔记录，默认为换行符。
`OFMT`：数字输出的格式，默认为％.6g。(%f 后面如果不满6位小数就补0,%g 不补0不显示)

`NF`: NF代表当前有多少列(小技巧:$NF代表最后一列的内容）
打印第一列和倒数第二列,`,`代表使用空格分割显示
```
awk -F ':' '{print $1, $(NF-1)}' /etc/passwd
root /root
bin /bin
daemon /sbin
adm /var/adm
```

`NR`: 当前处理的是第几行


## 函数
toupper()：字符转换为大写
tolower()：字符转为小写
length()：返回字符串长度
substr()：返回子字符串
sin()：正弦
cos()：余弦
sqrt()：平方根
rand()：随机数

`awk`内置函数的完整列表，可以查看[手册](https://www.gnu.org/software/gawk/manual/html_node/Built_002din.html#Built_002din)

```bash
awk -F ':' '{ print toupper($1) }' /etc/passwd
ROOT
BIN
DAEMON
ADM
```

## 条件
awk允许指定输出条件，只输出符合条件的行。

输出条件要写在动作的前面。
```bash
awk '条件 动作' 文件名
```

请看下面的例子。

```
$ awk -F ':' '/usr/ {print $1}' /etc/passwd
root
daemon
bin
sys
```
上面代码中，print命令前面是一个正则表达式，只输出包含usr的行。


下面的例子只输出奇数行，以及输出第三行以后的行。
```bash
# 输出奇数行
$ awk -F ':' 'NR % 2 == 1 {print $1}' /etc/passwd
root
bin
sync

# 输出第三行以后的行
$ awk -F ':' 'NR >3 {print $1}' /etc/passwd
sys
sync
```

下面的例子输出第一个字段等于指定值的行。
```bash
awk -F ':' '$1 == "root" {print $1}' /etc/passwd
root

# 或者
awk -F ':' '$1 == "root" || $1 == "bin" {print $1}' /etc/passwd
root
bin
```

## if 语句
awk提供了if结构，用于编写复杂的条件。
```bash
$ awk -F ':' '{if ($1 > "m") print $1}' /etc/passwd
root
sys
sync
```
上面代码输出第一个字段的第一个字符大于m的行。

if结构还可以指定else部分。
```bash
awk -F ':' '{if ($1 > "m") print $1; else print "---"}' demo.txt
root
---
---
sys
sync
```

## 预处理BEGIN和后处理END
```
# 格式
awk 'BEGIN{处理前} {处理中} END{处理后}' /etc/passwd

# 示例
awk -F: 'BEGIN{print "处理前"} {print $1,"处理中"} END{处理后}' /etc/passwd
```

## 循环
```bash
awk '{total = 0 for (var = 1; var < 5; var++){total += $var}
avg = total / 3 print "Average:",avg }' testfile

```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2117/  

