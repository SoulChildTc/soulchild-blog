# Docker部署openvpn+otp+ldap


<!--more-->

```bash
docker run --name=openvpn \
        --env=LDAP_BIND_USER_DN=CN=Administrator,CN=Users,DC=soulchild,DC=cn \
        --env=LDAP_BIND_USER_PASS=LDAP_ADMIN_PASSWORD \
        --env=FAIL2BAN_MAXRETRIES=20 \
        --env=OVPN_SERVER_CN=PUBLIC_IP \
        --env=LDAP_URI=ldap://LDAP_ADDRESS \
        --env=OVPN_DNS_SERVERS=114.114.114.114 \
        --env='LDAP_FILTER=(objectClass=user)' \
        --env='OVPN_ROUTES=10.55.150.0 255.255.255.0,10.50.0.0 255.255.240.0,10.49.0.0 255.255.240.0,10.48.0.0 255.255.240.0' \
        --env=ENABLE_OTP=true \
        --env=OVPN_PROTOCOL=tcp \
        --env=FAIL2BAN_ENABLED=true \
        --env='LDAP_BASE_DN=OU=运维部,OU=研发中心,OU=xxx,DC=soulchild,DC=cn' \
        --env=LDAP_LOGIN_ATTRIBUTE=sAMAccountName \
        --env='OVPN_NETWORK=10.218.0.0 255.255.0.0' \
        --env=OVPN_IDLE_TIMEOUT=36000 \
        --volume=/etc/openvpn:/etc/openvpn \
        --volume=/etc/localtime:/etc/localtime:ro \
        --cap-add=NET_ADMIN \
        -p 61194:1194 \
        --restart=always \
        --detach=true \
        wheelybird/openvpn-ldap-otp:v1.8
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/709025259/  

