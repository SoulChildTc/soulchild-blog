# Centos6关闭ipv6

<!--more-->
1./etc/sysconfig/network 新增如下一行
<pre class="prettyprint linenums" >
NETWORKING_IPV6=off
</pre>
2. 在 /etc/modprobe.d/dist.conf增加以下内容
<pre class="prettyprint linenums" >
alias net-pf-10 off
options ipv6 disable=1
</pre>
3. 关闭ip6iptables自启
<pre class="prettyprint linenums" >
chkconfig ip6tables off
</pre>
4.reboot重启


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/92/  

