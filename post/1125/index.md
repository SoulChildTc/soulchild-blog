# mongodb Failed to set up listener: SocketException: Permission denied

<!--more-->
tmp目录没有权限导致

使用mongodb参数--nounixsocket
<pre>mongod --config /etc/mongod.conf --nounixsocket --fork</pre>
&nbsp;

或者修改tmp目录权限

如果无法修改，可以尝试chattr -i /tmp


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1125/  

