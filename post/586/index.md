# KVM热添加CPU和配置文件修改cpu

<!--more-->
一、添加
<pre>virsh setvcpus we01-clone 4</pre>
&nbsp;

二、通过配置文件添加
<pre>#关机
virsh shutdown web01-clone

#编辑配置文件
virsh edit web01-clone</pre>
&lt;vcpu placement='static' current='2'&gt;4&lt;/vcpu&gt;

#current:当前cpu数量

#4：最大数量限制
<pre>#开机
virsh start web01-clone</pre>
&nbsp;

查看：
<pre>#查看物理CPU个数
cat /proc/cpuinfo| grep "physical id"| wc -l

#查看每个物理CPU的核心数
cat /proc/cpuinfo| grep "cpu cores"| uniq

#查看逻辑cpu个数
lscpu | grep 'CPU(s):' | head -n 1</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/586/  

