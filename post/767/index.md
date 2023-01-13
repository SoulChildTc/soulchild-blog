# iptables的filter表常用操作

<!--more-->
参数说明：

<strong>-t table</strong>

用来指明使用的表，有三种选项: filter，nat，mangle。若未指定，则默认使用filter表。

&nbsp;

<strong>command</strong>

指定iptables 对我们提交的规则要做什么样的操作。命令都需要以chain作为参数。
<ul>
 	<li>-P (--policy) 定义默认策略。</li>
 	<li>-L (--list) 查看规则列表。</li>
 	<li>-A (--append) 在规则列表的最后增加规则。</li>
 	<li>-I (--insert) 在指定的位置插入规则。</li>
 	<li>-D (--delete) 从规则列表中删除规则。</li>
 	<li>-R (--replace) 替换规则列表中的某条规则。</li>
 	<li>-F (--flush) 清楚指定的规则。</li>
 	<li>-Z (--zero) 将指定链（如未指定，则认为是所有链）的所有计数器归零。</li>
 	<li>-X (--delete-chain) 删除指定用户自定义链。</li>
</ul>
&nbsp;

修改链的状态：

iptables -P INPUT DROP

&nbsp;

开放指定端口:

iptables -A INPUT -s 0/0 -p tcp -m tcp --dport 22 -j ACCEPT

删除规则：

iptables -D INPUT -s 0/0 -p tcp -m tcp --dport 22 -j ACCEPT

&nbsp;

信任来源IP：

iptables -A INPUT -s 10.0.0.0/24  -j ACCEPT

&nbsp;

开放回环地址访问：

iptables -A INPUT -i lo -j ACCEPT

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/767/  

