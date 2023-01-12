# ansible安装配置并简单使用

<!--more-->
使用ansible需要先配置密钥认证，可参考<a href="https://www.soulchild.cn/204.html">https://www.soulchild.cn/204.html</a>

ansible在epel源中，需要先配置好源在进行安装。

yum install -y epel-release

yum install -y ansible

&nbsp;

安装完后修改/etc/ansible/ansible.cfg配置文件中的以下参数

host_key_checking= False

&nbsp;

# 主机列表文件

/etc/ansible/hosts

&nbsp;

[root@m01 ~]# egrep -v "^$|#" /etc/ansible/hosts

[soulchild]

172.16.1.7

172.16.1.31

172.16.1.41

&nbsp;

ansible使用参数：

-m:指定模块名

举例：

[root@m01 ~]# ansible soulchild -m ping    #soulchild需要改为对应的主机模块名，或者写all:代表所有主机


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/237/  

