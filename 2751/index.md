# Dapr安装记录

<!--more-->
安装dapr-cli
```bash
wget https://github.91chifun.workers.dev/https://github.com//dapr/cli/releases/download/v1.5.0/dapr_linux_amd64.tar.gz

tar xf dapr_linux_amd64.tar.gz

mv dapr /usr/local/bin/
```


在kubernetes中安装dapr
```bash
dapr init -k --enable-mtls=false
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2751/  

