# ip命令管理Network Namespace相关操作

<!--more-->
### 一、基本命令
```bash
# 创建ns
ip netns add newns

# 删除ns
ip netns delete newns

# 查看ns
ip netns ls

# 在指定的ns中执行命令
ip netns exec newns ip

# 进入指定ns的shell
ip netns exec newns bash -rcfile <(echo "PS1='newns > '")

# 修改网卡名
ip netns exec newns ip link set dev 网卡名 name 新网卡名

# 启动网卡
ip link set dev lo up

# 创建veth设备
ip link add 网卡名1 type veth peer name 网卡名2

# 将peer1网卡分配到指定的ns中
ip link set 网卡名 netns ns名

# 创建网桥
ip link add 网卡名 type bridge

# 为网卡配置ip
ip addr add dev 网卡名 192.168.1.10/24 

# 将网卡桥接到网桥网卡中
ip link set 网卡名 master 网桥网卡名

# 查看桥接设备
brctl show
```

### 二、实现两个namespace的通信
1.创建两个ns
```bash
ip netns add ns1
ip netns add ns2
```

2.创建一对veth网卡设备(每对veth设备都是互相连通的)
```bash
# 创建ns1网卡，类型为veth对等设备，对等设备的名称是ns2
ip link add ns1 type veth peer name ns2
```
> 通过`ethtool -S veth设备名` 可以查看到网卡索引，通过`ip a |grep '^索引'`可以看到网卡信息。
> 使用ip a可以看到ns2@ns1和ns1@ns2两个网卡设备

3.分配veth设备到不同的namespace
```bash 
# 前面的ns1是网卡名,后面的ns1是namespace名称
ip link set ns1 netns ns1
ip link set ns2 netns ns2
```
> 注意: 分配后在默认的network namespace中就看不到我们创建的一对veth网卡设备了,因为他们已经被分配到其他的namespace中

4.为两个namespace的veth网卡设置ip并启动网卡
```bash
# 设置ip
ip netns exec ns1 ip addr add dev ns1 192.168.1.10/24 
ip netns exec ns2 ip addr add dev ns2 192.168.1.11/24

# 启动网卡
ip netns exec ns1 ip link set lo up
ip netns exec ns1 ip link set ns1 up
ip netns exec ns2 ip link set lo up
ip netns exec ns2 ip link set ns2 up
```
5.ping测试
```bash
# ns1 ping ns2
ip netns exec ns1 ping 192.168.1.11

# ns2 ping ns1
ip netns exec ns2 ping 192.168.1.10
```

### 三、模拟docker使用网桥实现不同namespace的通信
1.创建两个ns
```bash
ip netns add ns3
ip netns add ns4
```
2.创建bridge类型的网卡(网桥相当于交换机)
```bash
ip link add mydocker0 type bridge
```

3.创建、分配、桥接veth设备
```bash
# 创建veth设备(一端放在ns3里，另一端和mydocker0桥接)
ip link add ns3 type veth peer name ns3tomydocker0

# 分配其中一块veth设备到ns3中
ip link set ns3 netns ns3

# 将另一块veth设备桥接到mydocker0中
ip link set ns3tomydocker0 master mydocker0
```

同理也需要为ns4做同样的操作
```bash
# 创建veth设备(一端放在ns4里，另一端和mydocker0桥接)
ip link add ns4 type veth peer name ns4tomydocker0

# 分配其中一块veth设备到ns4中
ip link set ns4 netns ns4

# 将另一块veth设备桥接到mydocker0中
ip link set ns4tomydocker0 master mydocker0
```
> 通过`bridge link`可以查看桥接状态

4.为两个namespace的veth网卡设置ip并启动网卡
```bash
# 为ns3和ns4中的网卡设置ip
ip netns exec ns3 ip addr add dev ns3 192.168.2.10/24 
ip netns exec ns4 ip addr add dev ns4 192.168.2.11/24

# 启动ns3和ns4中的网卡
ip netns exec ns3 ip link set lo up
ip netns exec ns3 ip link set ns3 up
ip netns exec ns4 ip link set lo up
ip netns exec ns4 ip link set ns4 up

# 启动ns3和ns4对端的网卡
ip link set ns3tomydocker0 up
ip link set ns4tomydocker0 up
```

5.启动mydocker0网桥
```bash
ip link set mydocker0 up
```

6.ping测试
```bash
ip netns exec ns3 ping 192.168.2.11
ip netns exec ns4 ping 192.168.2.10
```
> 上面的配置不能让ns内部访问外网,要访问外网需要给mydocker0配置ip地址，ns内部配置路由规则指向mydocker0,在宿主机添加iptables snat.

操作如下
```bash
# 给docker0配置IP
ip addr add dev mydocker0 192.168.2.1/24
# 配置ns3、ns4的默认网关为docker0
ip netns exec ns3 route add -net default gw 192.168.2.1
ip netns exec ns4 route add -net default gw 192.168.2.1

# 配置SNAT，访问外部网络
iptables -t nat -I POSTROUTING -s 192.168.2.0/24 -j MASQUERADE

# 配置DNS
mkdir -p /etc/netns/ns3 && echo "nameserver 223.5.5.5" | tee -a /etc/netns/ns3/resolv.conf
mkdir -p /etc/netns/ns4 && echo "nameserver 223.5.5.5" | tee -a /etc/netns/ns4/resolv.conf
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2745/  

