# Traefik Middleware配置详解(三)


<!--more-->

中间件是一种 在请求被发送到后端服务之前(或来自后端服务的应答被发送到客户端之前) 修改请求的方法。

在traefik中内置了两大类的中间件,分别是HTTP和TCP,下面介绍一些常用的中间件

## HTTP(kind: Middleware)

https://doc.traefik.io/traefik/middlewares/http/overview/#available-http-middlewares

- AddPrefix 添加请求前缀
- BasicAuth 添加 Basic Authentication 认证
- Buffering 设置请求和响应的buffer
- Chain 组合多个中间件作为一个中间件
- CircuitBreaker 避免向已经无法正常工作的服务发送请求，从而减少对其造成的负载和影响。如果检测到后端服务已经恢复正常，则断路器将关闭，从而重新允许请求通过。
- Retry 发生请求错误时重试
- ...

## TCP(kind: MiddlewareTCP)
https://doc.traefik.io/traefik/middlewares/tcp/overview/

- InFlightConn 限制同时连接的数量
- IPWhiteList	限制允许的客户端IP

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/traefik-middleware%E9%85%8D%E7%BD%AE%E8%AF%A6%E8%A7%A3%E4%B8%89/  

