# alpine镜像修改时区时间

<!--more-->
dockerfile中添加如下内容即可：
```
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
&& apk update && apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo "Asia/Shanghai" > /etc/timezone \
&& apk del tzdata
```

or

```
FROM registry.cn-shanghai.aliyuncs.com/soulchild/oracle-jdk:8u212-debian
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ENV TZ 'Asia/Shanghai'
ADD ./target/xxx.jar /
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1118/  

