# KVM虚拟机修改虚拟机名称2种方法

<!--more-->
方法1：自带命令修改
<pre>#先关机 
virsh shutdown centos7
#修改名称 
virsh domrename centos7 web01</pre>
最好保证虚拟机名称和磁盘文件一致，顺便修改一下磁盘文件名称
<pre>#修改磁盘文件名称
mv /data/centos2.raw /data/web01.raw
#修改配置文件中磁盘文件的路径名称
virsh edit web01
&lt;source file='/data/web01.raw'/&gt;
#开机
virsh start web01</pre>
&nbsp;

方法2：修改配置文件

先关机
<pre>virsh shutdown centos7</pre>
修改配置文件中&lt;name&gt;&lt;/name&gt;,删除uuid，修改磁盘文件路径。原文件可自行备份
<pre>vim /etc/libvirt/qemu/centos7.xml</pre>
修改磁盘文件名称
<pre>mv /data/centos2.raw /data/web01.raw</pre>
修改配置文件名称
<pre>mv /etc/libvirt/qemu/{centos7,web01}.xml</pre>
删除虚拟机
<pre>virsh undefine centos7</pre>
导入虚拟机
<pre>virsh define /etc/libvirt/qemu/web01.xml</pre>
开机
<pre>virsh start web01</pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/545/  

