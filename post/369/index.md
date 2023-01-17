# 重定向2>,&>;,1>,>....标准错误和标准输出

<!--more-->
2>:标准错误

> or 1>：标准输出

&>：标准输出和标准错误

2>&1: 将标准错误输出到标准输出

 

 

标准错误重定向到error.log，标准输出重定向到/dev/null

ll 2> error.log > /dev/null

 

 

标准错误和标准输出都重定向到/dev/null

ll > /dev/null 2>&1

or

ll > /dev/null 2> /dev/null

or

ll &> /dev/null


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/369/  

