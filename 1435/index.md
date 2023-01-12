# linux登陆提示信息

<!--more-->
<span style="font-family: tahoma, arial, helvetica, sans-serif;">1、<strong>/etc/issue</strong> 本地登录前的显示</span>

<span style="font-family: tahoma, arial, helvetica, sans-serif;">2、<strong>/etc/issue.net</strong> 使用网络登陆前显示</span>

<span style="font-family: tahoma, arial, helvetica, sans-serif;">3、<strong>/etc/motd   </strong>登陆后显示</span>

&nbsp;
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">\d          //本地端时间的日期；
\l          //显示当前tty的名字即第几个tty；
\m          //显示硬体的架构 (i386/i486/i586/i686...)；
\n          //显示主机的网路名称；
\o          //显示 domain name；
\r          //当前系统的版本 (相当于 uname -r)
\t          //显示本地端时间的时间；
\u          //当前有几个用户在线。
\s          //当前系统的名称；
\v          //当前系统的版本。</code></pre>
&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1435/  

