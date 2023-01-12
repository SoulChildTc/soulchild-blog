# tomcat 配置basic auth认证

<!--more-->
打开项目目录中的web.xml文件，并找到&lt;auth-constraint&gt;所在位置，修改角色名.

主要分为三部分：

1.认证目录

2.角色名称

3.认证配置
<pre>&lt;security-constraint&gt;
 &lt;web-resource-collection&gt;
<span style="color: #ff0000;"> &lt;web-resource-name&gt;other&lt;/web-resource-name&gt;</span>
 <span style="color: #ff0000;">&lt;url-pattern&gt;/*&lt;/url-pattern&gt;</span>
 &lt;/web-resource-collection&gt;
 &lt;!-- no security constraint --&gt;
<span style="color: #ff0000;"> &lt;auth-constraint&gt;</span>
<span style="color: #ff0000;"> &lt;role-name&gt;soulchild&lt;/role-name&gt;</span>
<span style="color: #ff0000;"> &lt;/auth-constraint&gt;</span>
 &lt;/security-constraint&gt;

<span style="color: #ff0000;">&lt;login-config&gt;</span>
<span style="color: #ff0000;"> &lt;auth-method&gt;BASIC&lt;/auth-method&gt;</span>
<span style="color: #ff0000;"> &lt;realm-name&gt;xxxxx&lt;/realm-name&gt;</span>
<span style="color: #ff0000;"> &lt;/login-config&gt;</span></pre>
&nbsp;

修改tomcat-users.xml，要与上面修改的角色名称相同
<pre class="pure-highlightjs"><code class="xml">  &lt;role rolename="soulchild"/&gt;
  &lt;user username="admin" password="123" roles="soulchild"/&gt;</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/479/  

