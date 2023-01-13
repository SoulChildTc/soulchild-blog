# iptables-模块&amp;规则记录

<!--more-->
### recent模块
这个模块会将匹配的规则中，源IP地址写到一个列表中，还支持通过创建时间来匹配这个列表中的IP。
存储的内容在`/proc/net/xt_recent/列表名称`

`--name name`
指定一个列表名称
`[!] --set`
将数据包的源IP添加到列表中。如果源地址已经在列表中，则更新现有条目(比如时间戳)。

`[!] --rcheck`
检查当前规则中数据包的源IP，是否存在于指定的列表中

`[!] --update`
检查当前规则中数据包的源IP，是否存在于指定的列表中，如果存在，还会更新时间戳

`[!] --remove`
检查当前规则中数据包的源IP，是否存在于指定的列表中，如果存在，则会删除这个地址

`[!] --seconds seconds`
\* 此选项必须与`--rcheck`或`--update`一起使用。

这个选项只会检查指定秒内的IP地址。

比如: `--rcheck --seconds 10`: 检查当前规则中数据包的源IP，是否存在于指定的列表中，这个IP必须是在10秒内被写入列表的

`[!] --hitcount hits`
\* 此选项必须与`--rcheck`或`--update`一起使用。

要求接收到的数据包大于等于指定的次数(命中次数)。
比如: `--rcheck --hitcount 3`: 只有源IP，第三次(或以上)存在于列表中才会匹配成功

这个选项也可以结合`--seconds`选项是使用。
比如: `--rcheck --hitcount 3 --seconds 10`: 只有源IP，第三次(或以上)存在于列表中,并且是10秒内的，才会匹配成功

`--rttl`:
\* 此选项必须与`--rcheck`或`--update`一起使用。

要求接收到的数据包TTL值和`--set`生效时设置的一样。

#### 手动操作列表中的IP
```
# 将指定的IP添加到列表中
echo xx.xx.xx.xx > /proc/net/ipt_recent/DEFAULT

# 删除指定的IP
echo -xx.xx.xx.xx > /proc/net/ipt_recent/DEFAULT

# 清空列表
echo clear > /proc/net/ipt_recent/DEFAULT
```

#### 模块本身参数的默认值：
`ip_list_tot=100`
每个列表保存的IP数量
`ip_pkt_list_tot=20`
每个ip的当前数据包计数(当前是第几个包)
`ip_list_hash_size=0`
哈希表大小，0表示根据ip_list_tot计算，其默认值为512
`ip_list_perms=0644`
ip列表文件权限`/proc/net/ipt_recent/*`
`debug=0`
设置为1，可以获得更多调试信息

**修改方法:**
```
# 1.停止iptables(如果需要保存别忘记保存规则)
service iptables stop

# 2.移除xt_recent模块
modprobe -r xt_recent

# 3.修改参数 vim /etc/modprobe.d/xt_recent.conf
options xt_recent ip_list_tot=1000 ip_pkt_list_tot=60

# 4.加载xt_recent模块
modprobe xt_recent

# 5.检查配置参数
grep -r '.*' /sys/module/xt_recent/parameters/

# 6.启动iptables
service iptables start
```


#### 使用示例：
eg1.每个IP只允许在5秒内建立2个基于tcp 80端口的连接
```
# 检查5秒内的ip列表中源IP是否存在2个
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --name webpool --rcheck --seconds 5 --hitcount 2  -j DROP

# 放行NEW状态的数据包，并记录至ip列表
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --name webpool --set -j ACCEPT

# 放行ESTABLISHED状态的数据包
iptables -A INPUT -p tcp --dport 80 -m state --state ESTABLISHED -j ACCEPT
```
eg2.在连接ssh前，先使用ping才能连接
```
# 匹配icmp请求包(包大小为29),并将源IP加入ip列表（sudo ping 192.168.10.150 -s 1）
iptables -I INPUT -p icmp --icmp-type 8 -m length --length 29 -m recent --name sshlogin --set -j REJECT --reject-with icmp-host-unreachable

# 允许10秒内存在于列表中的IP连接22端口
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --name sshlogin --rcheck --seconds 10 -j ACCEPT

# 允许ESTABLISHED状态的ssh连接
iptables -A INPUT -p tcp --dport 22 -m state --state ESTABLISHED -j ACCEPT
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2347/  

