# docker中macvlan网络

<!--more-->
实现不同宿主机中的容器通信

&nbsp;

1.创建macvlan网络

--driver 指定网络类型macvlan

--subnet 指定一个网段(根据真实环境填写)

--gateway 指定网关(根据真实环境填写)

-o parent=eth0 指定宿主接口

macvlan_1 自定义的网络名称
<pre>docker network create --driver macvlan --subnet 10.0.0.0/24 --gateway 10.0.0.254 -o parent=eth0 macvlan_1</pre>
&nbsp;

2.创建容器

docker01：
<pre>docker run -it --network macvlan_1 --ip=10.0.0.1 busybox</pre>
&nbsp;

docker02：
<pre>docker run -it --network macvlan_1 --ip=10.0.0.2 busybox</pre>
&nbsp;

此时，两个容器可以互通，也都可以ping通外网，但是不能ping通自己的宿主机。

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/666/  

