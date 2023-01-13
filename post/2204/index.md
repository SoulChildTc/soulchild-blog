# linux下静态路由修改命令

<!--more-->
原文链接：https://www.jianshu.com/p/b52d1e41a461

## 方法一(route)：

添加路由
`route add -net 192.168.0.0/24 gw 192.168.0.1`
`route add -host 192.168.1.1 dev eth0`

删除路由
`route del -net 192.168.0.0/24 gw 192.168.0.1`

>add 增加路由    del 删除路由
>-net 设置到某个网段的路由    gw 出口网关IP地址
>-host 设置到某台主机的路由  dev 出口网关物理设备名

增加默认路由：`route add default gw 192.168.0.1`

`route -n` 查看路由表

## 方法二(ip route)：

添加路由
`ip route add 192.168.0.0/24 via 192.168.0.1`
`ip route add 192.168.1.1 dev eth0`

删除路由
`ip route del 192.168.0.0/24 via 192.168.0.1`

>add 增加路由   del 删除路由
>via 网关出口 IP地址     dev 网关出口物理设备名

增加默认路由:`ip route add default via 192.168.0.1 dev eth0`

`ip route`查看路由信息

## 在linux下设置永久路由：
方法1：在/etc/rc.local里添加
```
route add -net 192.168.0.0/24 dev eth0
route add -net 192.168.1.0/24 gw 192.168.2.254
```
方法2：/etc/sysconfig/static-routes : (没有static-routes的话就手动建立一个这样的文件)
```
any net 192.168.0.0/24 gw 192.168.3.254
any net 10.250.228.128 netmask 255.255.255.192 gw 10.250.228.129
```


## 开启 IP 转发：
```
# echo "1" >/proc/sys/net/ipv4/ip_forward (临时)
# vi /etc/sysctl.conf --> net.ipv4.ip_forward=1 (永久开启)
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2204/  

