# KVM完整克隆和链接克隆

<!--more-->
<span style="color: #ff0000;"><strong>1.完整克隆</strong></span>

--auto-clone  从原始客户机配置中自动生成克隆名称和存储路径。

-o    原始虚拟机(该虚拟机需要在挂起和关机的状态)

-n    新的虚拟机名称
<pre>virt-clone --auto-clone -o web01 -n web01-clone</pre>
&nbsp;

<span style="color: #ff0000;"><strong>2.链接克隆</strong></span>

1.创建一个链接磁盘

-f   指定磁盘文件格式类型

-b  执行链接磁盘文件路径
<pre>qemu-img create -f qcow2 -b /data/web01.qcow2 /data/web01-clone-2.qcow2

</pre>
&nbsp;

2.查看链接磁盘的信息：
<pre>[root@kvm01 ~]# qemu-img info /data/web01-clone-2.qcow2 
image: /data/web01-clone-2.qcow2
file format: qcow2
virtual size: 10G (10737418240 bytes)
disk size: 196K
cluster_size: 65536
backing file: /data/web01.qcow2
Format specific information:
 compat: 1.1
 lazy refcounts: false</pre>
&nbsp;

3.导出母机的配置文件，并修改磁盘文件路径
<pre>virsh dumpxml web01 &gt; /etc/libvirt/qemu/web01-clone-2.xml</pre>
修改后的内容，UUID和mac地址需要手动删除
<pre>egrep 'qcow2|name&gt;' /etc/libvirt/qemu/web01-clone-2.xml
 &lt;name&gt;web01-clone-2&lt;/name&gt;
 &lt;driver name='qemu' type='qcow2'/&gt;
 &lt;source file='/data/web01-clone-2.qcow2'/&gt;</pre>
&nbsp;

4.导入、开机
<pre>virsh define /etc/libvirt/qemu/web01-clone-2.xml
virsh start web01-clone-2</pre>
&nbsp;

5.连接、测试
<pre>#查看配置文件，检查qcow2磁盘路径，还有原始磁盘文件
virsh dumpxml web01-clone-2 | grep -C 2 qcow2

#查看端口号，使用vnc连接
virsh vncdisplay web01-clone-2</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/564/  

