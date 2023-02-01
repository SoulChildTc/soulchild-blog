# 快速部署openldap测试


<!--more-->

openldap服务端
```bash
docker run \
  --publish 389:389 \
  --publish 636:636 \
  --name ldap-service \
  --hostname ldap-service \
	--env LDAP_ORGANISATION="SoulChild Blog" \
	--env LDAP_DOMAIN="soulchild.cn" \
	--env LDAP_ADMIN_PASSWORD="admin" \
  --volume /data/slapd/database:/var/lib/ldap \
	--volume /data/slapd/config:/etc/ldap/slapd.d \
	--detach osixia/openldap:1.5.0
```

phpldapadmin
```bash
docker run \
  --publish 443:443 \
  --name phpldapadmin-service \
  --hostname phpldapadmin-service \
  --link ldap-service:ldap-host \
  --env PHPLDAPADMIN_LDAP_HOSTS=ldap-host \
  --detach osixia/phpldapadmin:0.9.0
```

登录信息
> DN: cn=admin,dc=soulchild,dc=cn
> 
> Password: admin

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/%E5%BF%AB%E9%80%9F%E9%83%A8%E7%BD%B2openldap%E6%B5%8B%E8%AF%95/  

