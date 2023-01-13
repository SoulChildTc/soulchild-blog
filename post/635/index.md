# docker中容器之间的通信之--link

<!--more-->
通过--link可以实现单向别名访问.

&nbsp;

1.在docker01中创建容器1
<pre># 创建一个容器命名为container1
docker run -d --name container1 busybox tail -f

# 查一下ip是172.17.0.2
docker inspect container1 | grep -i ipaddr</pre>
2.在docker01中创建容器2

#可以多次使用

--link [name or id]:alias
<pre>#创建第二台容器，链接容器1并设置别名c1
docker run -it --link container1:c1 busybox

# ping测试
/ # ping c1
PING c1 (172.17.0.2): 56 data bytes
64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.135 ms
^C
--- c1 ping statistics ---
1 packets transmitted, 1 packets received, 0% packet loss
round-trip min/avg/max = 0.135/0.135/0.135 ms
/ # ping container1
PING container1 (172.17.0.2): 56 data bytes
64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.118 ms
64 bytes from 172.17.0.2: seq=1 ttl=64 time=0.158 ms
^C
--- container1 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.118/0.138/0.158 ms

</pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/635/  

