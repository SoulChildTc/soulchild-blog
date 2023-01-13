# SVN常用知识

<!--more-->
启动服务：

-d：后台启动

-r：递归目录

/opt/svn-repo：项目总目录
<pre>svnserve -d -r /opt/svn-repo/</pre>
&nbsp;

创建项目：
<pre>svnadmin create /opt/svn-repo/项目名称</pre>
&nbsp;

拉取代码：
<pre>svn checkout svn://ip/项目名称</pre>
&nbsp;

<hr />

设置项目登录权限

"write"为可读可写，"read"为只读，"none"表示无访问权限。

1.在svn服务器的项目目录中，修改配置文件，开启登录验证

vim /opt/svn-repo/项目名称/conf/svnserve.conf
<pre class="prettyprint prettyprinted"><span class="pun">[</span><span class="pln">general</span><span class="pun">]</span><span class="pln">
anon</span><span class="pun">-</span><span class="pln">access </span><span class="pun">=</span><span class="pln"> none
auth</span><span class="pun">-</span><span class="pln">access </span><span class="pun">=</span><span class="pln"> write
password</span><span class="pun">-</span><span class="pln">db </span><span class="pun">=</span> <span class="pln">passwd
authz</span><span class="pun">-</span><span class="pln">db </span><span class="pun">=</span> <span class="pln">authz</span></pre>
2.添加用户

vim /opt/svn-repo/项目名称/conf/passwd
<pre>[users]
# harry = harryssecret
# sally = sallyssecret
user1 = 123</pre>
&nbsp;

3.设置用户权限

[项目名称:路径]

用户名 = 权限
<pre>[项目名称:/]
user1 = rw</pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/791/  

