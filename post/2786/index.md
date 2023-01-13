# grafana匿名登陆

<!--more-->
https://grafana.com/docs/grafana/latest/auth/overview/#anonymous-authentication

配置如下
```bash
[auth]
disable_login_form = true

[auth.anonymous]
enabled = true

# 匿名权限相关配置
org_role = Editor
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2786/  

