# nginx反向代理加斜杠和不加斜杠的问题

<!--more-->
nginx反向代理的时候加`/`和不加`/`区别很大，情况也有很多种，容易忘记记混，这里记录一些情况


### 默认情况下
```
    location / {
        proxy_pass http://127.0.0.1:8888; 
        # 访问: http://localhost/test/1  ==> http://127.0.0.1:8888/test/1
    }
```

### location和proxy_pass不同地方加`/`
```
    location /test01 {
        proxy_pass http://127.0.0.1:8888;
        # localhost/test01/123  ==> 127.0.0.1:8888/test01/123
    }

    location /test02/ {
        # 注意不会匹配localhost/test02
        proxy_pass http://127.0.0.1:8888;
        # localhost/test02/123  ==> 127.0.0.1:8888/test02/123
    }

    location /test03/ {
        # 注意不会匹配localhost/test03
        proxy_pass http://127.0.0.1:8888/;
        # localhost/test03/     ==>  127.0.0.1:8888/
        # localhost/test03/123  ==>  127.0.0.1:8888/123
    }

    location /test04 {
        proxy_pass http://127.0.0.1:8888/;
        # localhost/test04aaa   ==>  127.0.0.1:8888/aaa
        # localhost/test04/123  ==>  127.0.0.1:8888//123
    }
```

### proxy_pass带后缀的
```
    location /test06 {
        proxy_pass http://127.0.0.1:8888/uri;
        # localhost/test06     ==>  127.0.0.1:8888/uri
        # localhost/test06/     ==>  127.0.0.1:8888/uri/
        # localhost/test06aaa  ==>  127.0.0.1:8888/uriaaa
        # localhost/test06/aaa ==>  127.0.0.1:8888/uri/aaa
    }
    location /test07 {
        proxy_pass http://127.0.0.1:8888/uri/;
        # localhost/test07     ==>  127.0.0.1:8888/uri/
        # localhost/test07/     ==>  127.0.0.1:8888/uri//
        # localhost/test07aaa  ==>  127.0.0.1:8888/uri/aaa
        # localhost/test07/aaa ==>  127.0.0.1:8888/uri//aaa
    }
    location /test08/ {
        proxy_pass http://127.0.0.1:8888/uri;
        # localhost/test08/    ==>  127.0.0.1:8888/uri
        # localhost/test08/aaa ==>  127.0.0.1:8888/uriaaa
        # localhost/test08/aaa/ ==>  127.0.0.1:8888/uriaaa/
    }
    location /test09/ {
        proxy_pass http://127.0.0.1:8888/uri/;
        # localhost/test09/     ==> 127.0.0.1:8888/uri/
        # localhost/test09/aaa  ==> 127.0.0.1:8888/uri/aaa
        # localhost/test09/aaa/ ==> 127.0.0.1:8888/uri/aaa/
    }
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2326/  

