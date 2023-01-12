# nginx配置Websocket反向代理

<!--more-->
**要将客户机和服务器之间的连接从HTTP/1.1转换为WebSocket，需要使用HTTP/1.1中提供的协议交换机制。**

**但是有一个微妙之处：由于“Upgrade”是一个逐跳的报头，它不会从客户端传递到代理服务器。通过正向代理，客户端可以使用CONNECT方法来避免这个问题。但是这不适用于反向代理，因为客户端不知道任何代理服务器，并且需要在代理服务器上进行特殊处理。**

**从版本1.3.13开始,nginx实现了一种特殊的操作模式，如果代理服务器返回代码为101（交换协议）的响应,并且客户端通过请求中的“Upgrade”报头请求协议交换，则允许在客户端和代理服务器之间建立隧道。**

如上所述，包括“Upgrade”和“Connection”在内的逐跳报头不会从客户端传递到代理服务器，因此，为了让被代理服务器知道客户端将协议切换到WebSocket的意图，必须传递这些报头：
```
location /chat/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

一个更复杂的示例，其中发送到代理服务器的请求中“Connection”请求头的值取决于客户端请求头中是否存在“Upgrade”字段：
```
http {
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        ...

        location /chat/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
        }
    }
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1866/  

