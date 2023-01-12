# nginx timeout

<!--more-->
### 1. proxy_connect_timeout
定义nginx与后端服务建立连接的超时时间。此超时通常不能超过75秒。默认60秒

### 2. proxy_read_timeout
后端服务给nginx响应的时间，规定时间内后端服务没有给nginx响应，连接会被关闭，nginx返回504 Gateway Time-out。默认60秒

### 3. proxy_send_timeout
定义nginx向后端服务发送请求的间隔时间(不是耗时)。默认60秒，超过这个时间会关闭连接



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2231/  

