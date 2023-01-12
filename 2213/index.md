# vmware esxi密码破解重置

<!--more-->
1.用centos6光盘启动，进入救援(恢复)模式。

2.进入shell模式

3.挂载分区
```bash
mkdir /mnt/sda5
mount /dev/sda5 /mnt/sda5
```

4.将含有shadow文件的压缩文件copy出来
`cp /mnt/sda5/state.tgz /tmp/`

5.解压state.tgz,得到local.tgz,再次解压

```
tar xf state.tgz
tar xf local.tgz
```

6.解压完成后得到一个etc目录,shadow文件在etc目录中.将root密码部分删掉
`vi etc/shadow`

7.还原压缩包
```
# 删除原包
rm -rf state.tgz local.tgz

# 将etc压缩为local.tgz
tar zcf local.tgz etc

# 将local.tgz压缩为state.tgz
tar zcf state.tgz local.tgz

# 将state.tgz放回原位置
cp state.tgz /mnt/test
```

8.`reboot`重启


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2213/  

