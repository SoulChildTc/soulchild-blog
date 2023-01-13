# KVM热添加网卡

<!--more-->
1.创建网卡

--type   网卡类型

--source   宿主机的网卡

--model    驱动模式

--persistent    保存至配置文件
<pre>virsh attach-interface web01-clone --type bridge --source br0 --model virtio --persistent</pre>
&nbsp;

查看接口信息：
<pre>virsh domiflist web01-clone</pre>
&nbsp;

删除网卡：
<pre>virsh detach-interface web01-clone --type bridge --mac 52:54:00:e9:8f:43 --persistent</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/578/  

