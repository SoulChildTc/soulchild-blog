# ssh批量分发公钥简易脚本

<!--more-->
#非交互生成密钥对,生成前确认.ssh目录下没有同名文件，否则会提示是否覆盖

[root@m01 ~]# ssh-keygen -t rsa -f /root/.ssh/id_rsa -P ""

&nbsp;

参数：

-t:指定算法

-f:指定文件路径以及文件名

-P:设置密码。""为空密码

&nbsp;

sshpass -pmima ssh-copy-id -i /root/.ssh/id_rsa.pub -oStrictHostkeyChecking=no root@$n

参数：

sshpass

-p:指定密码

&nbsp;

ssh-copy-id

-i:指定公钥文件路径

-oStrictHostkeyChecking=no:临时关闭真实性提示

&nbsp;

#使用脚本需要先在/tmp/ip_list文件中写好IP，

[root@m01 scripts]# cat ssh-copy-id.sh
<pre class="pure-highlightjs"><code class="bash">#!/bin/bash
if [ -f "/root/.ssh/id_rsa" ];then
echo "密钥已存在"
exit
#rm -f /root/.ssh/id_rsa*
fi
ssh-keygen -t dsa -f /root/.ssh/id_rsa -P "" &gt;/dev/null 2&gt;&amp;1

for ip in `cat /tmp/ip_list`
do
  sshpass -pmima ssh-copy-id -i /root/.ssh/id_rsa.pub -oStrictHostkeyChecking=no root@$ip &gt; /dev/null 2&gt;&amp;1
  [ $? -eq 0 ] &amp;&amp; echo "$ip已分发完成" || echo "$ip分发失败"
done</code></pre>
&nbsp;

[root@m01 scripts]# pssh -ih /tmp/ip_list hostname
[1] 23:07:41 [SUCCESS] 172.16.1.7
web01
[2] 23:07:41 [SUCCESS] 172.16.1.41
backup
[3] 23:07:41 [SUCCESS] 172.16.1.31
nfs01


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/233/  

