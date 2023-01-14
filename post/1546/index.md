# nginx配置限流

<!--more-->
## 三种实现方式：

limit_conn_zone
limit_req_zone
ngx_http_upstream_module



## 安装压测工具
```
yum install -y httpd-tools

# 10个连接发送1000个请求

ab -c 10 -n 1000 http://192.168.2.200/
```


## 配置nginx限流
### 第一种：limit_conn_zone限制连接数，特别是来自单个IP地址的连接数。
并非所有连接都会被计数。仅包含服务器正在处理的请求并且已读取整个请求头时，才对连接进行计数。

** 在http字段中添加：**
`limit_conn_zone $binary_remote_addr zone=addr:10m;`

含义：
> `$binary_remote_addr`: 使用这个标识来确认用户身份唯一性,$binary_remote_addr变量的大小对于IPv4地址始终为4字节，对于IPv6地址始终为16字节。存储状态在64位平台上总是占用64字节。一个1兆字节的区域可以保留大约1.6万个64字节状态。如果区域存储已用尽，服务器将把错误返回给所有请求。
>`zone`: 指定一个共享内存区域名称为addr，大小为10m。当超过此限制时，服务器将返回错误


** 在server字段添加：**
`limit_conn addr 1;`

含义：每个ip只允许1个连接,使用的是addr共享区域


** 测试：**
`ab -c 1 -n 10 http://192.168.2.200/`一个连接发送10个请求

访问正常
<img src="images/2b291f676588d1934a41ec97d0cf554a.png "2b291f676588d1934a41ec97d0cf554a"" />


`ab -c 2 -n 10 http://192.168.2.200/` 2个连接发送10个请求

其中有1个访问是失败的

<img src="images/d959feb814b7156290fa6658cb20e8c2.png "d959feb814b7156290fa6658cb20e8c2"" />


### 第二种：limit_req_zone，用于限制单一的IP地址的请求的处理速率。
在http字段中添加：

`limit_req_zone $binary_remote_addr zone=addr_req:10m rate=1r/s;`

含义：
> `$binary_remote_addr` ：同上
> `zone`: 指定一个共享内存区域名称，大小为10m。当超过此限制时，服务器将返回错误
> `rate`: 代表每秒处理1个请求



在server字段添加：

limit_req zone=addr_req burst=5;

含义：
`zone`:使用的是addr_req共享区域
`burst=5`:代表超出频率的访问请求会放到缓冲区，最多放5个，超过这5个的请求会直接报503的错误。



测试：

`ab -c 10 -n 10 http://192.168.2.210/` 10个连接发送10个请求，我们限制的是每秒1个请求，第一个请求会被处理，后面的请求会放到缓冲区，超过5个会返回错误。所以会有6个请求是成功的。

<img src="images/87894c16ffd030789e46af6185dd85e7.png "87894c16ffd030789e46af6185dd85e7"" />


<img src="images/61259367a550ab13b98df3ccfa69ac1f.png "61259367a550ab13b98df3ccfa69ac1f"" />


### 第三种：ngx_http_upstream_module模块的max_conns(在nginx 1.11.5版本以后可用)
限制nginx到后端服务器的连接数，默认为0，无限制。
在upstream中每个主机后面配置 max_conns=2

测试：

ab -c 3 -n 10 http://192.168.2.210/

<img src="images/fee75e0c20dbec06b8662b2ec058367d.png "fee75e0c20dbec06b8662b2ec058367d"" />

<img src="images/2941c31d93f98bb9cd47bb9884ca4b2d.png "2941c31d93f98bb9cd47bb9884ca4b2d"" />




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1546/  

