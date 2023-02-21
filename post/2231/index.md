# nginx timeout

<!--more-->

### keepalive_timeout 75s 20s
默认75s, 表示当客户端和 Nginx 之间的连接空闲 75 秒时，Nginx 将关闭连接。但如果客户端在75 秒内发送了新的请求，Nginx 将重置计时器，保持tcp连接打开状态。
第二个参数是可选的，在响应报头中设置一个值`Keep-Alive：Timeout=20`。

## nginx -> backend
### 1. proxy_connect_timeout(连接)
定义nginx与后端服务建立连接的超时时间。此超时通常不能超过75秒。默认60秒

### 2. proxy_read_timeout(响应)
后端服务给nginx响应的时间，规定时间内后端服务没有给nginx响应，连接会被关闭，nginx返回504 Gateway Time-out。默认60秒

### 3. proxy_send_timeout(请求)
定义nginx向后端服务发送请求的间隔时间(不是耗时)。默认60秒，超过这个时间会关闭连接, 这个要大于`proxy_read_timeout`

## client -> nginx
### 1. client_body_timeout
定义客户端发送body的超时时间，如果客户端在该时间内没有将body发送完毕，Nginx 将会关闭连接。

### 2. client_header_timeout
定义客户端发送header的超时时间，如果客户端在该时间内没有发送完header，Nginx 将会关闭连接。

### 3. send_timeout(响应)
定义 Nginx 向客户端发送响应内容的超时时间，如果 Nginx 在该时间内没有将响应发送完毕(开始发送response到response发送完毕的时间)，Nginx 将会关闭连接。

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2231/  

