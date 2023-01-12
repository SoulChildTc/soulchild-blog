# find -mtime的含义

<!--more-->
find -mtime +N/-N/N


`-mtime n` : 在n天之前的当天被修改文件
> 比如今天是1月10日, -mtime 3,就代表1月7号当天被修改的文件

`-mtime +n` : 在n天之前（不含n天本身）被修改的文件
> 比如今天是1月10日, -mtime +3,就代表1月7号之前被修改的文件(不包括1月7号)

`-mtime -n` : 在n天之内（含n天本身）被修改的文件
> 比如今天是1月10日, -mtime -3,就代表1月7号之内被修改的文件(包括1月7号)


## n的含义是：n\*24小时，系统计算也是按照小时来计算的，所以有时候会发现是当天的文件，但是没有找到，因为他是按照当前的时间往前推n\*24小时的


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2098/  
