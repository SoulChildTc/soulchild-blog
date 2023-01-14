# centos7修改网卡名

<!--more-->
主要参数：
<pre class="line-numbers" data-start="1"><code class="language-bash">net.ifnames=0 biosdevname=0</code></pre>
&nbsp;

&nbsp;

1.修改网卡名称
<pre class="line-numbers" data-start="1"><code class="language-bash">vim /etc/sysconfig/network-scripts/ifcfg-ens33</code></pre>
&nbsp;

删除UUID，mac地址。修改下面两个参数为新的网卡名：

NAME=eth0

DEVICE=eth0

&nbsp;

2.修改网卡配置文件名称
<pre class="line-numbers" data-start="1"><code class="language-bash">mv /etc/sysconfig/network-scripts/ifcfg-{ens33,eth0}
</code></pre>
&nbsp;

3.修改grub文件中GRUB_CMDLINE_LINUX
<pre class="line-numbers" data-start="1"><code class="language-bash">vim /etc/default/grub
net.ifnames=0 biosdevname=0</code></pre>
&nbsp;

<img src="images/6d110be13a8ba3e2efce934cfecedbb7.png "6d110be13a8ba3e2efce934cfecedbb7"" />

&nbsp;

4.更新grub
<pre>grub2-mkconfig -o /boot/grub2/grub.cfg</pre>
然后重启系统就可以了


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/599/  

