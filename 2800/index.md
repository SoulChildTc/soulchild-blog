# mailx命令行发送邮件

<!--more-->
```bash
set from=xxx@qq.com
set smtp=smtp.qq.com
set smtp-auth-user=xxx@qq.com
set smtp-auth-password=xxx
set smtp-auth=login

echo "邮件内容" | mailx -s "邮件标题" xxx@qq.com
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2800/  

