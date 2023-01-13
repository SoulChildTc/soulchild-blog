# 使用strongswan搭建ipsec隧道

<!--more-->
https://www.tecmint.com/setup-ipsec-vpn-with-strongswan-on-debian-ubuntu/

```bash
yum install -y strongswan
```

修改/etc/strongswan/ipsec.conf

left
```bash
conn atou
 left=172.30.1.140
 leftsubnet=172.30.0.1/23
 right=对端公网ip
 rightsubnet=10.23.40.0/24
 leftid=ali
 rightid=ucloud
 esp=3des-sha
 type=tunnel
 leftauth=psk
 rightauth=psk
 keyexchange=ikev2
 auto=start
```

right
```bash
conn utoa
 left=10.23.40.38
 leftsubnet=10.23.40.0/24
 right=对端公网ip
 rightsubnet=172.30.0.1/23
 leftid=ucloud
 rightid=ali
 esp=3des-sha
 type=tunnel
 leftauth=psk
 rightauth=psk
 keyexchange=ikev2
 auto=start
```


/etc/strongswan/ipsec.secrets
```
ucloud ali : PSK "123@123"
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2855/  

