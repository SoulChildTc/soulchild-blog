# centos系统基础优化

<!--more-->
1.修改ssh

/etc/ssh/sshd_config

UseDNS no

GSSAPIAuthentication no

&nbsp;

2.关闭selinux,NetworkManager. 设置iptables

systemctl stop NetworkManager

systemctl disable NetworkManager

sed -i 's#SELINUX=enforcing#SELINUX=disabled#' /etc/selinux/config

&nbsp;

3.配置yum源

centos7：

curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

curl -o /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo

&nbsp;

centos6：

curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo

curl -o /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-6.repo

&nbsp;

4.安装常用软件

yum install -y vim tree wget bash-completion wget lsof nmap nc lrzsz telnet bind-utils psmisc net-tools ntpdate

5.时间同步

ntpdate ntp1.aliyun.com &amp;&gt;/dev/null


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/759/  

