# firewalld开放vrrp协议

<!--more-->

```firewall-cmd --direct --permanent --add-rule ipv4 filter INPUT 0 --in-interface eth1 --destination 224.0.0.18 --protocol vrrp -j ACCEPT```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2312/  

