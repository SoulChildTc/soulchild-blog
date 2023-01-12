# openvpn仅路由内网

<!--more-->
备忘
```bash
# 将路由信息推送到客户端
push "route 172.30.0.0 255.255.254.0"   
# 注释掉下面这行                                                                        
# push "redirect-gateway def1 bypass-dhcp"
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2865/  

