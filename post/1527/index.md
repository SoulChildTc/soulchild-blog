# java程序开启远程debug

<!--more-->
启动时加入参数：

java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=30001 -jar xxx.jar

&nbsp;

使用IDEA调试参考：

https://blog.csdn.net/mimica247706624/article/details/80991656


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1527/  

