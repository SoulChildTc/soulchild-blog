# 4个lvcreate命令例子

<!--more-->
原文链接：[https://linux.cn/article-5117-1.html](https://linux.cn/article-5117-1.html)

1.在名为vg_newlvm的卷组中创建15G大小的逻辑卷：
```lvcreate -L 15G vg_newlvm```

2.在名为vgnewlvm的卷组中创建大小为2500MB的逻辑卷，并命名为centos7newvol，这样就创建了块设备/dev/vgnewlvm/centos7newvol：
```lvcreate -L 2500 -n centos7_newvol vg_newlvm```

3.可以使用lvcreate命令的参数-l来指定逻辑卷扩展的大小。也可以使用这个参数以卷组的大小百分比来扩展逻辑卷。这下列的命令创建了centos7newvol卷组的50%大小的逻辑卷vgnewlvm:
```lvcreate -l 50%VG -n centos7_newvol vg_newlvm```


4.使用卷组剩下的所有空间创建逻辑卷
```lvcreate --name centos7newvol -l 100%FREE vgnewlvm```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1900/  

