# nginx map指令使用

<!--more-->
语法:`map string $variable { ... }`
配置字段:`http`

含义: 匹配第一个参数,将自己指定的结果赋值给第二个参数

举例:
如果`$http_user_agent`的值与`~Opera Mini`匹配成功，`$mobile`的值就是`1`。否则`$mobile`的值就是`0`
```
map $http_user_agent $mobile {
    default       0;
    "~Opera Mini" 1;
}
```
> 对于区分大小写的匹配，正则表达式应从`~`符号开始，对于不区分大小写的匹配，正则表达式应从`~*`符号开始。


map还支持以下特殊参数：
```
default value
如果源值不匹配任何指定的变体，则设置结果值。如果未指定default，则默认结果值为空字符串。
```

```
hostnames
指示源值是带有前缀或后缀的主机名(xxx.com,xxx.cn,www.xxx.cn)

使用hostnames后，匹配域名时可以使用通配符
*.xxx.com
xxx.com
xxx.*

#上面的配置也可以简写成#############
.xxx.com
xxx.*
```
最终在配置文件中呈现
```
map $http_referer $referer_ok {
    hostnames;
    .xxx.com 1;
    xxx.* 1;
    default 0;
}
```


```
include file
引入一个变量文件
```

```
volatile
指明该变量不可缓存
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2157/  

