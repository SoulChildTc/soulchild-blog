# 调整swap分区使用优先级

<!--more-->
swappiness的数值决定如何使用swap。

```swappiness=0```表示尽量使用物理内存，然后在使用swap空间

```swappiness＝100```表示尽量使用swap分区

1.查看当前swappiness值

```cat /proc/sys/vm/swappiness```

2.修改swappiness的值

vim /etc/sysctl.conf

```vm.swappiness=30```

3.使配置生效

```sysctl -p```
　　


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1825/  

