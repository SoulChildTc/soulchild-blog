# pgsql创建库、用户、授权

<!--more-->
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">
#创建用户角色
CREATE USER user_name WITH PASSWORD '123456';

#创建数据库设置所有者
CREATE DATABASE database_name OWNER user_name;

#将database_name数据库授权给user_name用户
GRANT ALL PRIVILEGES ON DATABASE database_nname TO user_name;</code></pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1432/  

