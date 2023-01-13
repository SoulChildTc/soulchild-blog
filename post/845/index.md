# nginx的rewrite中break和last区别

<!--more-->
配置文件，没有echo模块的话可以改成return测试。
```bash
server{
    listen 80;
    server_name test.com;
    access_log /tmp/test_nginx.log main;

    location /break/ {
        rewrite /break/(.*) /break/test/$1 break;
        location /break/test/ {
              echo "break-test";
        }
        echo "break";

    }

    location /last/ {
        rewrite /last/(.*) /test/$1 last;
        echo "last";
    }

    location /test/ {
        echo "test";
    }

}
```
访问结果

1.http://test.com/break/a.txt ->break

2.http://test.com/last/a.txt ->test

3.http://test.com/test/a.txt ->test


结论：

last：修改uri后，根据重写后的规则，重新发起一个内部请求，跳转到其他location。

break：修改uri后，在当前字段继续向下执行，但不会匹配其他location。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/845/  

