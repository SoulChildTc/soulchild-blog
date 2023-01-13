# KVM热添加硬盘和扩容现有硬盘

<!--more-->
<span style="color: #800080; font-size: 14pt;"><strong>一、热添加</strong></span>

&nbsp;

<span style="color: #ff0000;"><strong>1.创建一块硬盘</strong></span>
<pre>qemu-img create -f qcow2 /data/web01-clone-add01.qcow2 1G</pre>
&nbsp;

<span style="color: #ff0000;"><strong>2.添加硬盘到虚拟机</strong></span>

指定主机名称

指定磁盘文件

指定目标设备

--subdriver  指定磁盘文件类型

--persistent  同时保存至配置文件(不加次参数为临时修改)
<pre>virsh attach-disk web01-clone /data/web01-clone-add01.qcow2 vdb --subdriver=qcow2 --persistent</pre>
&nbsp;

移除硬盘可以使用
<pre>virsh detach-disk web01-clone vdb --persistent</pre>
&nbsp;

<strong><span style="color: #ff0000;">3.查看</span></strong>

进系统查看或者在宿主机中查看

宿主机：
<pre>virsh domblklist web01-clone</pre>
&nbsp;

进系统：
<pre>fdisk -l</pre>
&nbsp;

&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #800080;">二、扩容已有硬盘</span></strong></span>

1.卸载硬盘(虚拟机操作)
<pre>umount /dev/vdb</pre>
&nbsp;

2.移除硬盘(宿主机操作)
<pre>virsh detach-disk web01-clone vdb</pre>
&nbsp;

3.扩容(+nG代表增加nG容量，不写+号代表扩容至nG)
<pre>qemu-img resize /data/web01-clone-add01.qcow2 +1G</pre>
&nbsp;

4.添加硬盘至虚拟机
<pre> virsh attach-disk web01-clone /data/web01-clone-add01.qcow2 vdb --subdriver qcow2</pre>
&nbsp;

5.进入虚拟机系统，重新挂载
<pre>mount /dev/vdb /mnt

# ext文件系统
resize2fs /dev/vdb

#xfs文件系统
xfs_growfs /dev/vdb</pre>
此时df -Th查看硬盘容量已经扩容成功


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/573/  

