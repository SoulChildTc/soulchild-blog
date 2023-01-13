# KVM利用nfs热迁移

<!--more-->
环境：

KVM01：安装kvm、nfs、/opt/目录为磁盘文件目录

KVM02：安装kvm、nfs

&nbsp;

host解析：

10.0.0.11    kvm01

10.0.0.12    kvm02

&nbsp;

1.安装nfs(两台KVM都装)
<pre>yum install -y nfs-utils 
#服务端安装rpcbind
yum install -y rpcbind</pre>
&nbsp;

2.kvm01配置nfs
<pre>[root@kvm01 ~]# vim /etc/exports
#共享目录写虚拟磁盘文件目录
/opt 10.0.0.0/24(rw,rsync,no_root_squash)

[root@kvm01 ~]# systemctl start rpcbind
[root@kvm01 ~]# systemctl start nfs</pre>
&nbsp;

3.KVM02挂载目录
<pre>#注意挂载的目录要和原来的一致，否则会找不到磁盘文件
[root@kvm02 ~]# mount -t nfs 10.0.0.11:/opt /opt/</pre>
&nbsp;

4.开始迁移
<pre>#查看当前虚拟机状态
[root@kvm01 ~]# virsh list 
 Id Name State
----------------------------------------------------
 16 centos7 running</pre>
&nbsp;

--live    实时迁移

--verbose    显示进度

--unsafe    忽略安全
<pre>#迁移
virsh migrate --live --verbose centos7 qemu+ssh://10.0.0.12/system --unsafe</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/589/  

