# debian-libreoffice镜像

<!--more-->
```bash
FROM debian:stable

ENV TZ=Asia/Shanghai
COPY fonts/ /usr/share/fonts
COPY sources.list /etc/apt/

RUN apt update && apt install -y libreoffice python3-pip; exit 0 && apt autoclean && rm -fr /var/cache/*
```

sources.list
```
deb http://mirrors.163.com/debian/ buster main contrib non-free
# deb-src http://mirrors.163.com/debian/ buster main contrib non-free
deb http://mirrors.163.com/debian/ buster-updates main contrib non-free
# deb-src http://mirrors.163.com/debian/ buster-updates main contrib non-free
deb http://mirrors.163.com/debian/ buster-backports main contrib non-free
# deb-src http://mirrors.163.com/debian/ buster-backports main contrib non-free
deb http://mirrors.163.com/debian-security buster/updates main contrib non-free
# deb-src http://mirrors.163.com/debian-security buster/updates main contrib non-free
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2210/  

