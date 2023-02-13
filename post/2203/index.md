# iptables共享网络

<!--more-->
主机1:
公网地址: 10.0.0.14
内网地址: 172.16.0.1


主机2
内网地址: 172.16.0.10


主机1配置
```
iptables -t nat -A POSTROUTING -s 172.16.0.0/24 -j SNAT --to-source 10.0.0.14

# 开启ipv4流量转发
echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
sysctl -p
```

主机2配置
```
# 修改网关
route add default gw 172.16.0.1
```
> 删除网关: route del -net 0.0.0.0/0 gw 172.16.0.1


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2203/  

