# KVM热添加内存和修改最大内存限制

<!--more-->
<span style="color: #ff0000; font-size: 14pt;"><strong>添加内存</strong></span>

立即生效，临时的。
<pre>virsh setmem web01-clone 1024M</pre>
&nbsp;

--config 不会立即不生效，在下一次启动生效
<pre>virsh setmem web01-clone 1024M --config</pre>
&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #ff0000;">修改最大内存限制</span></strong></span>

#关机

virsh shutdown web01-clone

#修改最大内存

virsh setmaxmem web01-clone 2048M

#查看结果

virsh dominfo web01-clone | grep -i max

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/584/  

