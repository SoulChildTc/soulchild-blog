# linux查看组内成员

<!--more-->
<pre class="line-numbers" data-start="1"><code class="language-bash">groupname=nginx &amp;&amp; cat /etc/passwd | grep `grep ${groupname} /etc/group | awk -F: '{print $3}'` | awk -F: '{print $1}' &amp;&amp; unset groupname</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/873/  

