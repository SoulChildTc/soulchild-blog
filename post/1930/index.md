# 容器中文字体问题,使用aspose.word转换pdf中文乱码

<!--more-->
使用aspose.word 转换pdf中文乱码
Dockerfile
```bash
FROM openjdk:8u212-jdk-alpine
RUN mkdir /usr/share/fonts
COPY fonts/ /usr/share/fonts
RUN apk add mkfontscale mkfontdir && cd /usr/share/fonts;mkfontscale && cd /usr/share/fonts;mkfontdir;rm -fr /var/cache/apk/*
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1930/  

