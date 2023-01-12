# kubernetes 1.20.7 二进制安装-初始化环境(二)

<!--more-->
## 所有节点执行

### 一、升级内核
```bash
# 导入公钥
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org

# 安装elrepo源
yum install -y https://www.elrepo.org/elrepo-release-7.el7.elrepo.noarch.rpm

# 查看kernel版本
yum --disablerepo=\* --enablerepo=elrepo-kernel list --showduplicates |  grep kernel-lt

# 安装新版kernel
yum --disablerepo=\* --enablerepo=elrepo-kernel install -y kernel-lt-5.4.125-1.el7.elrepo

# 删除旧版kernel相关包
yum remove kernel-headers-3.10.0-1160.15.2.el7.x86_64 kernel-tools-libs-3.10.0-1062.el7.x86_64 kernel-tools-3.10.0-1062.el7.x86_64

# 安装新版kernel相关包
yum --disablerepo=* --enablerepo=elrepo-kernel install -y kernel-lt-tools-5.4.125-1.el7.elrepo kernel-lt-tools-libs-5.4.125-1.el7.elrepo kernel-lt-headers-5.4.125-1.el7.elrepo

# 修改为默认内核
grub2-set-default 0

# 重启服务器
reboot
```

### 二、修改hosts
```bash
cat >> /etc/hosts << EOF
172.17.20.201 master01
172.17.20.202 master02
172.17.20.203 master03
172.17.20.210 node01
172.17.20.211 node02
172.17.20.212 node03
EOF
```

### 三、关闭防火墙和selinux
```bash
systemctl stop firewalld
setenforce 0
sed -i 's/^SELINUX=.\*/SELINUX=disabled/' /etc/selinux/config
```

### 四、关闭swap
```bash
swapoff -a
sed -i 's/.*swap.*/#&/' /etc/fstab
```

### 五、安装常用软件包
```bash
yum -y install bridge-utils chrony ipvsadm ipset sysstat conntrack libseccomp wget tcpdump screen vim nfs-utils bind-utils wget socat telnet sshpass net-tools sysstat lrzsz yum-utils device-mapper-persistent-data lvm2 tree nc lsof strace nmon iptraf iftop rpcbind mlocate ipvsadm
```

### 六、时间同步
```bash
yum install -y chrony
systemctl start chronyd
systemctl enable chronyd
```

### 七、修改资源限制
```bash
> /etc/security/limits.d/20-nproc.conf

cat >> /etc/security/limits.conf <<EOF
* soft noproc 65535
* hard noproc 65535
* soft nofile 65535
* hard nofile 65535
* soft memlock unlimited
* hard memlock unlimited
EOF
```

### 八、加载ipvs内核模块
```bash
cat > /etc/sysconfig/modules/ipvs.modules <<EOF 
#!/bin/bash 
modprobe -- ip_vs 
modprobe -- ip_vs_rr 
modprobe -- ip_vs_wrr 
modprobe -- ip_vs_sh 
modprobe -- nf_conntrack_ipv4  # 4.19内核已改名为nf_conntrack，这里报错可忽略
modprobe -- overlay
modprobe -- br_netfilter
EOF

chmod 755 /etc/sysconfig/modules/ipvs.modules 
bash /etc/sysconfig/modules/ipvs.modules 
lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

### 九、修改内核参数
```bash
cat > /etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
net.ipv4.ip_forward=1
vm.swappiness=0 # 禁止使用 swap 空间，只有当系统 OOM 时才允许使用它
vm.overcommit_memory=1 # 不检查物理内存是否够用
vm.panic_on_oom=0 # 内存不足时，开启OOM
fs.file-max=52706963 # 系统级打开最大文件句柄的数量
fs.nr_open=52706963 # 系统级打开最大进程的数量
net.netfilter.nf_conntrack_max=2310720  # 最大连接状态跟踪数量
EOF

sysctl -p /etc/sysctl.d/k8s.conf
```


### 十、免密配置(可选)
```bash
ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa

for i in `awk '/172/{print $1}' /etc/hosts | uniq`;do ssh-copy-id -i ~/.ssh/id_rsa.pub root@$i ;done
```








---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2457/  

