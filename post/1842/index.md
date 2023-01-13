# 断电导致generating rdsosreport.txt系统无法启动

<!--more-->
generating “/run/initramfs/rdsosreport.txt”
entering emergencymode. exit the shell to continue
type “journalctl” to view system logs.
you might want to save “/run/initramfs/rdsosreport.txt” to a usb stick or /boot after mounting them and attach it to a bug report。


解决方法：
```
xfs_repair /dev/mapper/centos-root -L
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1842/  

