# grep简单常用用法

<!--more-->
<h2><span style="color: #e53333; font-size: 12pt;"><strong>正则表达式</strong></span></h2>
\             转义符，将特殊字符进行转义，忽略其特殊意义
^            匹配行首，awk中，^则是匹配字符串的开始
$             匹配行尾，awk中，$则是匹配字符串的结尾
^$           表示空行
.              匹配除换行符\n之外的任意单个字符
[ ]            匹配包含在[字符]之中的任意一个字符
[^ ]          匹配[^字符]之外的任意一个字符
[ - ]          匹配[]中指定范围内的任意一个字符，例：[1-9][a-z]
?              匹配之前的项1次或者0次
+             匹配之前的项1次或者多次
*              匹配之前的项0次或者多次, .*
()             匹配表达式，创建一个用于匹配的子串
{ n }         匹配之前的项n次，n是可以为0的正整数
{n,}          之前的项至少需要匹配n次
{n,m}        指定之前的项至少匹配n次，最多匹配m次，n&lt;=m
|               或者，|两边的任意一项，ab(c|d)匹配abc或abd

特定字符:
[[:space:]]      空格
[[:digit:]]        [0-9]
[[:lower:]]       [a-z]
[[:upper:]]      [A-Z]
[[:alpha:]]       [a-Z]

<hr />

<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">grep参数说明：</span></strong></span></h2>
-n：显示行号

-v：取反

-E：使用扩展正则==egrep

-i：忽略大小写

-o：只输出匹配到的内容，匹配行中的其他内容不输出

-w：按照单词过滤

-r：遍历目录查找

-A n：输出匹配内容的后n行(包括匹配行)

-B n：<span style="white-space: normal;">输出匹配内容的前n行(包括匹配行)</span>

-C n：<span style="white-space: normal;">输出匹配内容的前后n行(包括匹配行)</span>

\&lt;：词首锚定，同\b

\&gt;：词尾锚定，同\b

<hr />

<h2><span style="color: #e53333; font-size: 12pt;"><strong>举例：</strong></span></h2>
<span style="color: #006600;"><strong>#过滤以m开头的行</strong></span>

[root@m01 ~]# grep '^m' passwd
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin

<span style="color: #006600;"><strong>#过滤以sync结尾的行</strong></span>

[root@m01 ~]# grep 'sync$' passwd
sync:x:5:0:sync:/sbin:/bin/sync

<span style="color: #006600;"><strong>#过滤空行，不显示空行</strong></span>

<span style="white-space: normal;">[root@m01 ~]# grep -v </span>'^$' passwd

<span style="color: #006600;"><strong>#显示匹配内容的前2行</strong></span>

[root@m01 ~]# grep -B2 '^m' passwd
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
<span style="color: #e53333;">m</span>ail:x:8:12:mail:/var/spool/mail:/sbin/nologin

<strong style="color: #006600; white-space: normal;">#显示匹配内容的后2行</strong>

[root@m01 ~]# grep -A2 '^m' passwd
<span style="color: #e53333;">m</span>ail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin

<strong style="white-space: normal; color: #006600;">#显示匹配内容的前后2行</strong>

[root@m01 ~]# grep -C2 '^m' passwd
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
<span style="color: #e53333;">m</span>ail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
<p style="white-space: normal;"><span style="color: #006600;"><strong>#过滤nologin，只显示匹配的内容</strong></span></p>
<p style="white-space: normal;">[root@m01 ~]# grep -o 'nologin' passwd
nologin
nologin
...</p>
<span style="color: #006600;"><strong>#过滤出sever的单词</strong></span>

[root@m01 ~]# grep -w 'server' /etc/ssh/sshd_config
# This is the sshd <span style="color: #e53333;">server </span>system-wide configuration file.  See
Subsystem sftp /usr/libexec/openssh/sftp-<span style="color: #e53333;">server</span>
# ForceCommand cvs <span style="color: #e53333;">server</span>

<span style="color: #006600;"><strong>#遍历/root目录中的文件，包含hello的内容</strong></span>
<div style="white-space: nowrap;">[root@m01 ~]# grep -r 'hello' /root/
/root/.bash_history:cowsay hello</div>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/360/  

