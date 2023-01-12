# python-paramiko简单使用

<!--more-->
```python
# -*- coding: utf-8 -*-
import paramiko

# 通过用户名密码连接

# # 创建ssh客户端
# ssh_client = paramiko.SSHClient()
# # 自动同意yes
# ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy)
# # 建立连接
# ssh_client.connect(hostname="10.0.0.237", username="root", password="123", timeout=3)
# # 执行命令
# stdin, stdout, stderr = ssh_client.exec_command('read -p "内容:" a ; echo $a')
# # 标准输入，实现远端交互
# # stdin.write("给read的内容\n")
# stdin.write(input("你输入什么我就返回什么：") + "\n")
# print(stdout.read().decode("utf8"))
# ssh_client.close()

# 通过私钥连接
# ssh_client = paramiko.SSHClient()
# private_key = paramiko.RSAKey.from_private_key_file("./id_dsa")
# ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy)
# ssh_client.connect(hostname="10.0.0.200", username="root",pkey=private_key)
# stdin, stdout, stderr = ssh_client.exec_command('read -p "内容:" a ; echo $a')
# stdin.write("我输入的内容\n")
# print(stdout.read().decode())
# ssh_client.close()


# sftp传输文件
# transport = paramiko.Transport(("10.0.0.200",22))
# transport.connect(username="root",password="123")
# sftp_client = paramiko.SFTPClient.from_transport(transport)
# sftp_client.get('/root/init.sh','./aa.s1h')
# sftp_client.put('./mem.py','mem.py')
# sftp_client.close()
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1991/  

