# gitlab ci 拉取代码出现hung up unexpectedly

<!--more-->
```bash
fatal: git fetch-pack: expected shallow list
fatal: The remote end hung up unexpectedly
```

升级git
```bash
yum install -y \
https://repo.ius.io/ius-release-el7.rpm \
https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

yum install -y git236
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2891/  

