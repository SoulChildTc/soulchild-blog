# yum只下载不安装

<!--more-->
两种方式：

方法1:
```bash
yum install -y --downloadonly --downloaddir=/tmp/jq jq
```

方法2:
```bash
yum install -y yum-utils
yumdownloader --destdir=/tmp/jq --resolve jq
```




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1924/  

