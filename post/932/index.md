# apache配置https和http跳转

<!--more-->
开启模块支持：

修改http.conf文件，去掉注释
<pre>
LoadModule ssl_module modules/mod_ssl.so
LoadModule socache_shmcb_module modules/mod_socache_shmcb.so
Include conf/extra/httpd-ssl.conf
</pre>
若未安装 mod_ssl.so 模块，可通过执行<code>yum install mod_ssl</code> 命令安装或编译模块安装。

&nbsp;

修改以下参数：
<table border="0" cellspacing="0" cellpadding="0" align="center">
<thead>
<tr>
<td>配置文件参数</td>
<td>说明</td>
</tr>
</thead>
<tbody>
<tr>
<td>SSLEngine on</td>
<td>启用SSL功能</td>
</tr>
<tr>
<td>SSLCertificateFile</td>
<td>证书文件</td>
</tr>
<tr>
<td>SSLCertificateKeyFile</td>
<td>私钥文件</td>
</tr>
<tr>
<td>SSLCertificateChainFile</td>
<td>证书链文件</td>
</tr>
</tbody>
</table>
&nbsp;

vim /usr/local/apache2/conf/extra/httpd-ssl.conf
<pre><code><span class="hljs-section">&lt;VirtualHost 0.0.0.0:443&gt;</span>
     <span class="hljs-attribute"><span class="hljs-nomarkup">DocumentRoot</span></span> <span class="hljs-string">"/var/www/html"</span> 
     <span class="hljs-comment">#填写证书名称</span>
     <span class="hljs-attribute"><span class="hljs-nomarkup">ServerName</span></span> www.domain.com 
     <span class="hljs-comment">#启用 SSL 功能</span>
     <span class="hljs-attribute">SSLEngine</span> <span class="hljs-literal">on</span> 
     <span class="hljs-comment">#证书文件的路径</span>
     <span class="hljs-attribute">SSLCertificateFile</span> /etc/httpd/ssl/2_www.domain.com.crt 
     <span class="hljs-comment">#私钥文件的路径</span>
     <span class="hljs-attribute">SSLCertificateKeyFile</span> /etc/httpd/ssl/3_www.domain.com.key 
     <span class="hljs-comment">#证书链文件的路径</span>
     <span class="hljs-attribute">SSLCertificateChainFile</span> /etc/httpd/ssl/1_root_bundle.crt 
<span class="hljs-section">&lt;/VirtualHost&gt;</span></code></pre>
&nbsp;
<h3 id="http-.E8.87.AA.E5.8A.A8.E8.B7.B3.E8.BD.AC-https-.E7.9A.84.E5.AE.89.E5.85.A8.E9.85.8D.E7.BD.AE.EF.BC.88.E5.8F.AF.E9.80.89.EF.BC.89">HTTP 跳转 HTTPS</h3>
开启模块：

修改http.conf文件，去掉注释
<pre class="line-numbers" data-start="1"><code class="language-bash">LoadModule rewrite_module modules/mod_rewrite.so
</code></pre>
&nbsp;

添加跳转配置
<pre><code><span class="hljs-section">&lt;Directory "/var/www/html"&gt;</span> 
<span class="hljs-comment"># 新增</span>
<span class="hljs-attribute"><span class="hljs-nomarkup">RewriteEngine</span></span> <span class="hljs-literal">on</span>
<span class="hljs-attribute"><span class="hljs-nomarkup">RewriteCond</span></span> <span class="hljs-variable">%{SERVER_PORT}</span> !^443$
<span class="hljs-attribute"><span class="hljs-nomarkup">RewriteRule</span></span> ^(.*)?$ https://<span class="hljs-variable">%{SERVER_NAME}</span><span class="hljs-variable">%{REQUEST_URI}</span><span class="hljs-meta"> [L,R]</span>
<span class="hljs-section">&lt;/Directory&gt;</span></code></pre>
&nbsp;

重启apache服务
<pre>apache graceful</pre>
&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/932/  

