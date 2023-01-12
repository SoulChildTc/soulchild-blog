# python-切片

<!--more-->
拿字符串举例：
```s="helloworld"```

切片语法：
```s[start:end:step]```

- 从0切到5:
```s[0:5]```：hello
- 从1切到最后
```s[1:]```：elloworld
- 从开头开始切3位
```s[:3]：```：hel
- 从第一位切到倒数第五位
```s[1:-5]```：ello
- 指定步长为2
```s[2:8:2]```：loo
- 倒着取
```s[-2:2:-1]```：lrowol
- 反转
```s[::-1]```：dlrowolleh


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1948/  

