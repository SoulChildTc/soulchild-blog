# alpine缺少FontConfiguration报空指针

<!--more-->
报错
```bash
Caused by: java.lang.NullPointerException: null
        at sun.awt.FontConfiguration.getVersion(FontConfiguration.java:1264)
        at sun.awt.FontConfiguration.readFontConfigFile(FontConfiguration.java:219)
        at sun.awt.FontConfiguration.init(FontConfiguration.java:107)
        at sun.awt.X11FontManager.createFontConfiguration(X11FontManager.java:774)
        at sun.font.SunFontManager$2.run(SunFontManager.java:431)
        at java.security.AccessController.doPrivileged(Native Method)
        at sun.font.SunFontManager.<init>(SunFontManager.java:376)
```


安装ttf-dejavu

dockerfile
```dockerfile
FROM openjdk:8u212-jdk-alpine
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk update && apk add ttf-dejavu tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo "Asia/Shanghai" > /etc/timezone \
&& apk del tzdata && rm -rf /var/cache/apk/*
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2086/  

