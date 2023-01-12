# KVM qemu-img常用命令

<!--more-->
磁盘格式说明：

raw： 裸格式，占用空间比较大，不支持快照功能，性能较好，不方便传输。总50G,使用2G,实际占用宿主机空间50G

qcow2：cow （copy on write）占用空间小，支持快照，性能比raw差一点，方便传输。总50G,使用2G,实际占用宿主机空间2G

&nbsp;

1.查看虚拟磁盘信息
<pre>qemu-img info /data/web01.raw</pre>
&nbsp;

2.创建一块硬盘
<pre>#raw格式
qemu-img create /data/test.raw 1G
#qcow2格式
qemu-img create -f qcow2 /data/test.qcow2 1G</pre>
&nbsp;

3.扩容硬盘(qcow2只能增加不能缩小)
<pre>qemu-img resize /data/test.qcow2 +2G</pre>
&nbsp;

4.格式转换（转换后不会覆盖原文件）

-f：指定被转换格式

-O：转换后的格式

被转换磁盘文件路径

转换后的磁盘文件路径
<pre>#raw==&gt;qcow2
qemu-img convert -f raw -O qcow2 /data/web01.raw /data/web01.qcow2
#vmdk==&gt;qcow2
qemu-img convert -f vmdk -O qcow2 /data/web01.vmdk /data/web01.qcow2
#。。。。略</pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/556/  

