# 快速生成https证书测试


<!--more-->

简单快捷用起来就是一个字 爽
```bash
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -out headers.ops.com.crt -keyout headers.ops.com.key -subj "/CN=ops.com" -addext "subjectAltName=DNS.1:ops.com,DNS.2:*.ops.com,DNS.3:*.headers.ops.com,IP.1:127.0.0.1" -nodes
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/%E5%BF%AB%E9%80%9F%E7%94%9F%E6%88%90https%E8%AF%81%E4%B9%A6%E6%B5%8B%E8%AF%95/  

