# ssh密钥认证

<!--more-->
~/.ssh/目录文件说明：

authorized_keys:记录公钥的文件，对端的私钥和此文件中的公钥匹配成功即可登录

id_rsa : 生成的私钥文件

id_rsa.pub ： 生成的公钥文件

目录文件权限：

1) .ssh目录：700

2) .ssh/authorized_keys文件：600

#生成秘钥对

[root@m01 ~]# ssh-keygen  -t dsa

Generating public/private dsa key pair.
Enter file in which to save the key (/root/.ssh/id_dsa):
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
。。。。。。省略

#将公钥发送到其他服务器中

-i:指定公钥文件

[root@m01 ~]# ssh-copy-id  -i /root/.ssh/id_dsa.pub   root@172.16.1.41

#测试远程执行命令

[root@m01 ~]# ssh 172.16.1.41 hostname

backup


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/204/  

