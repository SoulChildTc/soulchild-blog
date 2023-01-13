# maven配置阿里云仓库加速

<!--more-->
编辑conf/settings.xml

在&lt;mirrors&gt;&lt;/mirrors&gt;中添加如下内容
<pre class="pure-highlightjs"><code class="xml">    &lt;mirror&gt;
        &lt;id&gt;nexus-aliyun&lt;/id&gt;
        &lt;mirrorOf&gt;*&lt;/mirrorOf&gt;
        &lt;name&gt;Nexus aliyun&lt;/name&gt;
        &lt;url&gt;http://maven.aliyun.com/nexus/content/groups/public&lt;/url&gt;
    &lt;/mirror&gt; </code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/488/  

