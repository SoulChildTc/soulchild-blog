# shell中$*和$@的区别

<!--more-->
<span style="font-size: 12pt;">set 1 2 3</span>
<span style="font-size: 12pt;"> 不加引号-----每个参数视为独立参数</span>
<span style="font-size: 12pt;"> [root@m01 ~]# for i in $*;do echo $i ;done</span>
<span style="font-size: 12pt;"> 1</span>
<span style="font-size: 12pt;"> 2</span>
<span style="font-size: 12pt;"> 3</span>

<span style="font-size: 12pt;">[root@m01 ~]# for i in $@;do echo $i ;done</span>
<span style="font-size: 12pt;"> 1</span>
<span style="font-size: 12pt;"> 2</span>
<span style="font-size: 12pt;"> 3</span>

<span style="font-size: 12pt;">加引号-----$*把所有参数当做一个整体， $@和不加引号一样</span>
<span style="font-size: 12pt;"> [root@m01 ~]# for i in "$*";do echo $i ;done</span>
<span style="font-size: 12pt;"> 1 2 3</span>

<span style="font-size: 12pt;"> [root@m01 ~]# for i in "$@";do echo $i ;done</span>
<span style="font-size: 12pt;"> 1</span>
<span style="font-size: 12pt;"> 2</span>
<span style="font-size: 12pt;"> 3</span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/371/  

