# iptables状态机制(连接跟踪机制)

<!--more-->
本文引自: https://www.frozentux.net/iptables-tutorial/cn/iptables-tutorial-cn-1.1.19.html#STATEMACHINE，修改了部分内容，便于自己理解

### 一、概述
状态机制(连接跟踪)是iptables中特殊的一部分，状态机制可以让Netfilter知道某个特定连接的状态。

在iptables里，包是和 状态机制的四种不同状态有关的。它们是`NEW`，`ESTABLISHED`，`RELATED`和`INVALID`。 使用`-m --state`匹配操作，我们能很容易地控制 "谁或什么能发起新的会话"。

所有在内核中由Netfilter的特定框架做的连接跟踪称作conntrack（译者注：就是connection tracking 的首字母缩写）。conntrack可以作为模块安装，也可以作为内核的一部分。conntrack中有许多用来处理TCP、UDP或ICMP协议的部件。这些模块从数据包中提取详细的、唯一的信息，因此能保持对每一个数据流的跟踪。这些信息也告知conntrack流当前的状态。例如，UDP流一般由他们的目的地址、源地址、目的端口和源 端口唯一确定。

除了本地产生的包由OUTPUT链处理外，所有连接跟踪都是在`PREROUTING`链里进行处理的，意思就是， iptables会在`PREROUTING`链里从新计算所有的状态。如果我们发送一个流的初始化包，状态就会在`OUTPUT`链里被设置为`NEW`，当我们收到回应的包时，状态就会在PREROUTING链里被设置为ESTABLISHED。如果第一个包不是本地产生的，那就会在PREROUTING链里被设置为NEW状态。综上，所有状态的改变和计算都是在nat表中的PREROUTING链和OUTPUT链里完成的。



### 二、conntrack记录
我们先来看看怎样阅读`/proc/net/ip_conntrack`里的conntrack记录。这些记录表示的是当前被跟踪的连接。如果安装了`ip_conntrack`模块，`cat /proc/net/ip_conntrack`的显示类似下面这样：(新版本叫nf_conntrack) 
```
ipv4     2 tcp      6 299 ESTABLISHED src=192.168.10.252 dst=192.168.10.150 sport=59148 dport=22 src=192.168.10.150 dst=192.168.10.252 sport=22 dport=59148 [ASSURED] mark=0 secctx=system_u:object_r:unlabeled_t:s0 zone=0 use=2
ipv4     2 udp      17 9 src=0.0.0.0 dst=255.255.255.255 sport=68 dport=67 [UNREPLIED] src=255.255.255.255 dst=0.0.0.0 sport=67 dport=68 mark=0 secctx=system_u:object_r:unlabeled_t:s0 zone=0 use=2
```
conntrack模块维护的所有信息都包含在这个例子中了，通过它们就可以知道某个特定的连接处于什么状态。

第一列: 网络层协议名称
第二列: 可能是网络层的协议类型代码
第三列: 传输层协议名称
第四列: 传输层协议类型代码(可在/etc/protocols中查看)
第五列: 这条conntrack记录的生存时间秒，这个值会每秒递减，有新的流量进来后，这个值会重置回默认值。比如tcp的默认是432000，udp是30，每当进行通信或交换数据时都会重置此值。(/proc/sys/net/netfilter/nf_conntrack_tcp_timeout_established)or(sysctl -a |grep net.netfilter.nf_conntrack_tcp_)
`ESTABLISHED`: tcp状态信息，udp没有这一列。

后面的是请求地址和端口，有两对。第一对代表请求端，第二对代表响应端

`[ASSURED]`: 说明两个方向都有流量，在连接跟踪表满时，没有[ASSURED]的记录就要被删除。
`[UNREPLIED]`: 说明这个连接还没有收到任何响应


跟踪条目是存在内存中的，默认最大可保存65536条记录(/proc/sys/net/netfilter/nf_conntrack_max),超过后会发生丢包，`/var/log/messages`报错`kernel: nf_conntrack: table full, dropping packet`
###三、 数据包在用户空间的状态
iptables中的四种连接状态

#### `NEW`
NEW代表新连接的第一个包。

#### `ESTABLISHED`
只要我们发送并接到对端的应答，连接就是`ESTABLISHED`状态了。

#### `RELATED`
一个连接要想 是RELATED的，首先要有一个ESTABLISHED的连接。这个ESTABLISHED连接再产生一个主连接之外的连接，这个新的连接就是RELATED的了，当然前提是conntrack模块要能理解RELATED。ftp是个很好的例子，`FTP-data`连接 和 `FTP-control`连接 有 `RELATED`的关系。还有其他的例子，比如，通过IRC的DCC连接。有了这个状态，ICMP应答、FTP传输、DCC等才能穿过防火墙正常工作。注意，大部分还有一些UDP协议都依赖这个机制。这些协议 是很复杂的，它们把连接信息放在数据包里，并且要求这些信息能被正确理解。

#### `INVALID`
INVALID说明数据包不能被识别属于哪个连接或没有任何状态。有几个原因可以产生这种情况，比如，内存溢出，收到不知属于哪个连接的ICMP 错误信息。一般地，我们DROP这个状态的任何东西。








---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2337/  

