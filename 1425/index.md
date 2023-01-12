# 启用虚拟内存swap

<!--more-->
创建虚拟内存设备（2g）

mkdir /<span class="hljs-built_in">swap</span>

dd if=/dev/zero of=/swap/swap2g bs=1024k count=2000

mkswap /swap/swap2g

chmod 600 /swap/swap2g

swapon /swap/swap2g

&nbsp;

查看swap分区信息

swapon -s

cat /proc/swaps

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1425/  

