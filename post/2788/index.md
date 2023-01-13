# openssl查看证书

<!--more-->
### 查看证书
```bash
echo | openssl s_client -servername xxx.com -connect soulchild.cn:443 2>/dev/null | sed -n '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p'
```


### 过期时间
```bash
echo | openssl s_client -servername xxx.com -connect soulchild.cn:443 2>/dev/null | openssl x509 -noout -dates 
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2788/  

