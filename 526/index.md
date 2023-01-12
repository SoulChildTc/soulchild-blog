# KVM管理软件libvirt常用命令

<!--more-->
以虚拟机名称为centos7举例：

&nbsp;

1.查看主机列表
<pre>virsh list --all</pre>
2.编辑配置文件
<pre>#虚拟机配置文件
virsh edit centos7

#网络配置文件
virsh net-edit default</pre>
3.开机，关机、重启、关闭电源
<pre>virsh start centos7
virsh shutdown centos7
virsh reboot centos7
virsh destroy centos7</pre>
4.导出查看虚拟机配置文件
<pre>virsh dumpxml centos7 &gt; /backup/centos7.xml
</pre>
5.移除导入虚拟机
<pre>#移除
virsh undefine centos7
#导入
virsh define /backup/centos7.xml</pre>
5.挂起、恢复虚拟机
<pre>#挂起
virsh suspend centos7
#恢复（恢复时需要注意时间同步问题）
virsh resume centos7</pre>
6.查看vnc端口号
<pre>virsh vncdisplay centos7</pre>
7.修改虚拟机名称
<pre>#先关机
virsh shutdown centos7
#修改名称
virsh domrename centos7 web01</pre>
8.开机和取消开机启动，前提：systemctl enable libvirtd
<pre># 开机启动
virsh autostart centos7
# 取消开机启动
virsh autostart --disable centos7

实际上是将配置文件软链接到/etc/libvirt/qemu/autostart/目录下</pre>
9.通过console连接虚拟机
<pre>virsh console centos7</pre>
10.通过磁盘文件控制系统文件
<pre>virt-cat 1.qcow2 /etc/passwd #查看虚拟磁盘里的文件
virt-edit 1.qcow2 /etc/passwd #编辑虚拟磁盘里的文件，虚拟机必须处于关机状态
virt-df -h 1.qcow2 #查看虚拟磁盘使用情况
virt-copy-out 1.qcow2 /etc/passwd /tmp/ #拷贝虚拟磁盘中的 passwd 文件到 /tmp 目录下
virt-copy-in 1.qcow2 /tmp/1.txt /root/ #拷贝本地的 1.txt 文件到虚拟磁盘的 /root/ 目录下
</pre>
11.查看支持安装的系统版本
<pre>virt-install --os-variant list</pre>
&nbsp;

待补充。。。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/526/  

