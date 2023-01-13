# VMware Fusion 端口映射

<!--more-->
打开配置文件
sudo vi /Library/Preferences/VMware\ Fusion/vmnet8/nat.conf

找到如下配置
[incomingtcp]
# Use these with care - anyone can enter into your VM through these...
# The format and example are as follows:
#&lt;external port number&gt; = &lt;VM's IP address&gt;:&lt;VM's port number&gt;
23 = 172.16.161.129:22 #将IP172.16.161.129虚拟机的22 端口映射到主机23端口

重启VM的网络服务
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --stop
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --start


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1491/  

