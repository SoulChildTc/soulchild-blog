# Ubuntu报“xxx is not in the sudoers fileThis incident...”错误解决方法

<!--more-->
<div align="left"><a href="http://www.linuxidc.com/topicnews.aspx?tid=2" target="_blank" rel="noopener">Ubuntu</a>下普通用户用sudo执行命令时报"xxx is not in the sudoers file.This incident will be reported"错误，解决方法就是在/etc/sudoers文件里给该用户添加权限。如下：</div>
<div align="left">1.切换到root用户下</div>
<div align="left">2./etc/sudoers文件默认是只读的，对root来说也是，因此需先添加sudoers文件的写权限,命令是:
chmod u+w /etc/sudoers</div>
<div align="left">3.编辑sudoers文件
vi /etc/sudoers
找到这行 root ALL=(ALL) ALL,在他下面添加xxx ALL=(ALL) ALL (这里的xxx是你的用户名)</div>
<div align="left">ps:这里说下你可以sudoers添加下面四行中任意一条
youuser            ALL=(ALL)                ALL
%youuser          ALL=(ALL)                ALL
youuser            ALL=(ALL)                NOPASSWD: ALL
%youuser          ALL=(ALL)                NOPASSWD: ALL</div>
<div align="left">第一行:允许用户youuser执行sudo命令(需要输入密码).
第二行:允许用户组youuser里面的用户执行sudo命令(需要输入密码).
第三行:允许用户youuser执行sudo命令,并且在执行的时候不输入密码.
第四行:允许用户组youuser里面的用户执行sudo命令,并且在执行的时候不输入密码.</div>
<div align="left">4.撤销sudoers文件写权限,命令:</div>
<div align="left">chmod u-w /etc/sudoers</div>
<br/>
<div style="text-align: left;" align="left">本文转自：<a href="http://www.linuxidc.com/Linux/2016-07/133066.htm" target="_blank" rel="noopener">http://www.linuxidc.com/Linux/2016-07/133066.htm</a></div>
<div align="left"></div>
<br/>



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/138/  

