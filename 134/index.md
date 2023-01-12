# linux系统使用密钥验证远程登录

<!--more-->
1.按照以下提示输入即可
<pre class="prettyprint linenums">root@localhost ~]# ssh-keygen -t rsa             //采用rsa的加密方式的公钥/私钥

 Generating public/private rsa key pair.
 Enter file in which to save the key (/root/.ssh/id_rsa): //询问输入私钥和公钥放在那里，直接回车
 Enter passphrase (empty for no passphrase): //这里可以给私钥设置密码
 Enter same passphrase again: //提示再次输入私钥密码，再次回车
</pre>
2.进入密钥目录
<pre class="prettyprint linenums">[root@localhost ~]# cd /root/.ssh
</pre>
3.ls查看文件可以看到以下两个文件
<pre class="prettyprint linenums">[root@localhost .ssh]# ls
id_rsa id_rsa.pub
</pre>
4.导入公钥到认证文件中
<pre class="prettyprint linenums">[root@localhost .ssh]# mv id_rsa.pub authorized_keys
</pre>
5.给认证文件修改权限600
<pre class="prettyprint linenums">[root@localhost .ssh]# chmod 600 authorized_keys
</pre>
6.将配置文件中PasswordAuthentication yes 改为 PasswordAuthentication no //禁止使用密码远程登录系统
<pre class="prettyprint linenums">[root@localhost .ssh]# vim /etc/ssh/sshd_config
</pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/134/  

