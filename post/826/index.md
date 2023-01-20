# 使用LVM扩容分区

<!--more-->

## 将sdb分区容量扩容至根分区
### 1.查看当前分区情况：
![87844-tq1enj2xju.png](https://soulchild.cn/usr/uploads/2020/07/4018579267.png)

### 2.给sdb创建两个分区(fdisk适用于2TB以下的硬盘，超过2T使用parted)
![09915-i631rgd3a6.png](https://soulchild.cn/usr/uploads/2020/07/3924601455.png)

### 3.创建PV
```
# 创建PV
pvcreate /dev/sdb1 /dev/sdb2

#查看PV
pvdisplay
pvscan
pvs
```

### 4.扩展VG
![73706-ojr3egs2nrk.png](https://soulchild.cn/usr/uploads/2020/07/3514792186.png)
```
# 查看vg
vgs
# 扩展VG
vgextend centos /dev/sdb1
```

### 5.扩展LV
```
使用-l 100%VG这个参数以卷组的大小百分比来扩展逻辑卷
lvextend -l 100%VG /dev/mapper/centos-root
```
### 6.扩展文件系统
```
xfs_growfs /dev/mapper/centos-root
```
>centos6使用：resize2fs /dev/mapper/centos-root

### 7.验证大小
```
lsblk
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/826/  

