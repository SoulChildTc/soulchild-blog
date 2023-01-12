# 使用sshpass实现非交互连接服务器

<!--more-->
```bash
[root@m01 ~]#    ssh 172.16.1.7 hostname
The authenticity of host '172.16.1.7 (172.16.1.7)' can't be established.
ECDSA key fingerprint is SHA256:qI7TJf59/RPaLxO+x7DZN88pU7WFjuZ2yYpPKvJmicg.
ECDSA key fingerprint is MD5:af:2a:5a:5e:f9:d1:83:1e:e6:17:bc:a8:6d:0b:c4:e5.
Are you sure you want to continue connecting (yes/no)?
```


-oStrictHostKeyChecking=no:解决第一次登陆提示（如上）



## sshpass工具需要单独安装，它可以为ssh相关命令提供密码

## sshpass在epel源中，需要先配置epel源在进行安装，也可以安装ansible(自带sshpass)或者使用源代码安装
```bash
[root@m01 ~]# yum install -y epel-release

[root@m01 ~]# yum install -y sshpass

[root@m01 ~]# sshpass -p123456 -oStrictHostKeyChecking=no ssh root@172.16.1.41 hostname

backup
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/206/  

