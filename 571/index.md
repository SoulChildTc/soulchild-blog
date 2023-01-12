# KVM虚拟机修改网卡为桥接网络

<!--more-->
1.查看虚拟网卡
<pre>brctl show</pre>
&nbsp;

2.创建网桥
<pre>virsh iface-bridge eth0 br0</pre>
取消时可以使用
<pre>virsh iface-unbridge br0</pre>
&nbsp;

3.关机修改配置文件
<pre>virsh shutdown web01-clone-2
virsh edit web01-clone-2</pre>
修改为如下参数：

&lt;interface type='bridge'&gt;

&lt;source bridge='br0'/&gt;

&nbsp;

4.开机
<pre>virsh start web01-clone-2</pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/571/  

