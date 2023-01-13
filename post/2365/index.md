# DNS服务bind转发配置简介

<!--more-->
## 1. 作为转发服务器需要开启递归查询
`recursion yes;`

## 2. 两种转发的配置
### 2.1 全局转发
本dns没有的区域，会全都转发给指定的DNS服务器
```
recursion yes;
forward first|only;
forwarders {
    223.5.5.5; 
    223.6.6.6;
};
```

### 2.2 区域转发
只对指定的区域做转发，如果同时配置了全局转发，这里优先级高于全局的配置
```
zone "soulchild.cn" {
    type forward;
    forward first|only;
    forwarders { 172.17.20.250; };
};
```

### first和only的区别
> `forward first`: 先使用forwarders指定的DNS服务器做解析，如果查询不到再使用本地DNS服务器做域名解析
> `forward only`: 只会使用forwarders指定的DNS服务器做解析，如果查询不到则返回DNS查询失败


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2365/  

