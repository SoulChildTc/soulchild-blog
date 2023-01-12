# dns服务bind配置

<!--more-->
1./etc/named.conf
```
listen-on port 53 { localhost; };
allow-query     { localhost;any; };
allow-transfer  { 172.17.10.151; }; // 配置只允许172.17.10.151，作为从服务器拉取配置
dnssec-enable no;
dnssec-validation no;
recursion yes;

```
> `recursion no; //使用迭代查询处理请求,当客户端请求解析时,本地有缓存或者有区域记录则会返回对应的信息,否则解析失败，因为我们不是根域,没有顶级域的信息，所以无法告知客户端寻找其他服务器。`

2.使用rndc命令管理bind
rndc使用的是953/tcp端口

rndc参数:
`reload`: 重新加载配置文件和所有zone
`reload zonename`: 重新加载单个zone
`retransfer zonename`: 重新传输单个zone，不检查序列号
`notify zonename`: 重新发送zone的通知消息
`reconfig`: 重新加载主配置文件
`querylog [ on | off ]`: 启用/禁用查询日志记录
`trace`: 将调试级别增加1
`trace LEVEL`: 修改调试级别
`notrace`: 修改调试级别为0
`flush`: 清空DNS所有缓存记录


### 正向解析
1./etc/named.rfc1912.zones
```
zone "soulchild.com" IN {
        type master;
        file "soulchild.com.zone";
        allow-update { none; }; // 不允许客户端注册这个zone记录。设置为any或其他ip表示允许，比如可以通过nsupdate动态更新解析记录。
};
```

2./var/named/soulchild.com.zone
```
$TTL 3H
@       IN SOA  @ 742899387.qq.com. (
                                        0       ; serial
                                        1D      ; refresh
                                        1H      ; retry
                                        1W      ; expire
                                        3H )    ; minimum
        NS      @
        A       172.17.0.150
websrv  A       1.1.1.1
websrv  A       2.2.2.2
websrv  A       3.3.3.3
www   1 CNAME   websrv
@       MX    10  mail1
mail1   A       4.4.4.4
$GENERATE 1-100  web$  A   10.0.0.$  ; 生成1-100的数字,web1对应10.0.0.1, web2对应10.0.0.2
```


### 反向解析
1./etc/named.rfc1912.zones
```
zone "0.17.172.in-addr.arpa" IN {
        type master;
        file "172.17.10.zone";
        allow-update { none; }; 
};
```

2./var/named/172.17.0.zone
```
$TTL 1D
@       IN SOA  @ rname.invalid. (
                                        0       ; serial
                                        1D      ; refresh
                                        1H      ; retry
                                        1W      ; expire
                                        3H )    ; minimum
        NS      @
        A       127.0.0.1
150     PTR     soulchild.com.
```

重新加载`rndc reload`
测试:`dig -x 172.17.0.150 @172.17.10.150`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2317/  

