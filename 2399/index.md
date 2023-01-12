# openssl-实现简单https服务快速测试证书

<!--more-->
需要用到`openssl s_server`命令
查看man手册帮助`man s_server`

常用命令:
```bash
openssl s_server -accept 443 -www -cert soulchild.com.crt -key soulchild.com.key
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2399/  

