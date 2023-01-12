# nginx添加请求头作为日志

<!--more-->
** 在要收集的请求头前面加$http前缀即可 **

例如user_agent和referer

在日志就填写内容如下:
$http_user_agent
$http_referer

```nginx
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" ';
```

注: 如果请求头是xx-xx，需要写成$http_xx_xx


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2081/  

