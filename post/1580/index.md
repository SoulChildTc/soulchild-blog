# 修改limit配置限制linux最大文件描述符和最大进程数

<!--more-->
## 临时修改
命令：
```bash
ulimit[-aHS][-c<core文件上限>][-d<数据节区大小>][-f<文件大小>][-m<内存大小>][-n<文件数目>][-p<缓冲区大小>][-s<堆叠大小>][-t<CPU时间>][-u<程序数目>][-v<虚拟内存大小>]

```
参数：
- `-a` 显示目前资源限制的设定。</li>
- `-c` core文件上限 　设定core文件的最大值，单位为区块。
- `-d` 数据节区大小 　程序数据节区的最大值，单位为KB。
- `-f` 文件大小 　shell所能建立的最大文件，单位为区块。
- `-H` 设定资源的硬性限制，也就是管理员所设下的限制。严格的设定，必定不能超过这个设定的数值
- `-m` 内存大小 　指定可使用内存的上限，单位为KB。
- `-n` 文件数目 　指定同一时间最多可开启的文件数。
- `-p` 缓冲区大小 　指定管道缓冲区的大小，单位512字节。
- `-s` 堆叠大小 　指定堆叠的上限，单位为KB。
- `-S` 设定资源的软限制。警告的设定，可以超过这个设定值，但是若超过则有警告信息
- `-t` CPU时间 　指定CPU使用时间的上限，单位为秒。
- `-u` 程序数目 　用户最多可开启的程序数目。
- `-v` 虚拟内存大小 　指定可使用的虚拟内存上限，单位为KB。


```bash
# 显示系统资源的设置
ulimit -a

# 设置最大文件打开数
ulimit -n 10240

# 设置单一用户程序上限
ulimit -u 65535
```


## 永久修改-修改配置文件：
vim /etc/security/limits.conf
```bash
* soft noproc 65535
* hard noproc 65535
* soft nofile 65535
* hard nofile 65535
* soft memlock unlimited
* hard memlock unlimited
xx - nofile 65535
```

centos7还需要修改
vim /etc/security/limits.d/20-nproc.conf
```bash
*          soft    nproc     4096
root       soft    nproc     unlimited
```
说明：

`*` 代表针对所有用户

`soft` 代表软限制：-S ：soft limit ，警告的设定，可以超过这个设定值，但是若超过则有警告信息

`hard` 代表硬限制：-H ：hard limit ，严格的设定，必定不能超过这个设定的数值

`-` 代表软硬同时设置

`noproc` 是代表最大进程数

`nofile` 是代表最大文件打开数

`memlock` 代表可以锁定其地址空间的内存量

`unlimited` 无限制







---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1580/  

