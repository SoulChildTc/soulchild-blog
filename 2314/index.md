# bind SOA配置说明

<!--more-->
原文链接：https://blog.csdn.net/starxu85/article/details/3357652

Bind的SOA记录：每个Zone仅有一个SOA记录。SOA记录包括Zone的名字，一个技术联系人和各种不同的超时值。
例子：
```
$ORIGIN .
$TTL 3600       ; 1 hour
10235.com               IN SOA  ns1.abc.com.  root.ns1.abc.com. (
                                2007061402 ; serial
                                3600       ; refresh (1 hour)
                                900        ; retry (15 minutes)
                                1209600      ; expire (2 weeks)
                                3600         ; minimum (1 hour)
                                )
```


### 第三行
10235.com：代表当前域，可以用@代替
ns1.abc.com.：指定当前域的主DNS SERVER
root.ns1.abc.com.：管理员邮箱(`@`使用`.`代替),等同于root@ns1.abc.com.



###Serial 
数值Serial代表这个Zone的序列号。供Slave DNS判断是否从Master DNS获取新数据。每次Zone文件更新，都需要修改Serial数值。RFC1912 2.2建议的格式为YYYYMMDDnn 其中nn为修订号;
###Refresh
数值Refresh设置Slave DNS多长时间与Master Server进行Serial核对。目前Bind的notify参数可设置每次Master DNS更新都会主动通知Slave DNS更新，Refresh参数主要用于notify参数关闭时;
###Retry
数值Retry设置当Slave DNS试图获取Master DNS Serial时，如果Master DNS未响应，多长时间重新进行检查;
###Expire
数值Expire将决定Slave DNS在没有Master DNS的情况下权威地提供域名解析服务的时间长短;
###Minimum
否定答案的TTL,当服务器没有解析到域名时，设置客户端缓存时间
在8.2版本之前，由于没有独立的 $TTL 指令，所以通过 SOA 最后一个字段来实现。但由于 BIND 8.2 后出现了 $TTL  指令，该部分功能就不再由 SOA 的最后一个字段来负责，由 $TTL 全权负责



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2314/  

