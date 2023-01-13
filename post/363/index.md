# shell中sh、source、. 、.杠、执行脚本的区别

<!--more-->
1.sh

不需要脚本执行权限，父shell不会继承脚本（子shell）中的变量

2.  ./

需要脚本拥有执行权限，<span style="white-space: normal;">父shell不会继承脚本（子shell）中的变量</span>

3.source和.是一样的

父shell继承<span style="white-space: normal;">脚本（</span>子shell）中的变量


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/363/  

