# KVM快照管理常用命令

<!--more-->
快照目录：/var/lib/libvert/qemu/snapshot/

1.查看快照
<pre>virsh snapshot-list web01</pre>
&nbsp;

2.创建快照

--name  指定快照名称
<pre>virsh snapshot-create-as --name "initial system" web01</pre>
&nbsp;

3.恢复快照

--snapshotname     快照名称
<pre>virsh snapshot-revert web01 --snapshotname 'initial system'</pre>
&nbsp;

4.删除快照

--snapshotname     快照名称
<pre>virsh snapshot-delete web01 --snapshotname 'initial system'</pre>
&nbsp;

5.查看快照信息
<pre>virsh snapshot-info web01 --snapshotname 'init system'</pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/561/  

