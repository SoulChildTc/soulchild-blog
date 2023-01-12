# git记住账号密码

<!--more-->
<pre class="line-numbers" data-start="1"><code class="language-bash">设置记住密码（默认15分钟）
git config --global credential.helper cache

自定义时间（1小时）
git config credential.helper 'cache --timeout=3600'

添加全局记住账号密码
git config --global credential.helper store

密码发生改变后重置密码
git config --system --unset credential.helper

</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1337/  

