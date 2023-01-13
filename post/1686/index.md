# filebeat字段过滤和加工

<!--more-->
查看过滤之前的字段：

<img src="images/46f5a5911c14cb77f8d40b1ba1a771eb.png" />

&nbsp;

修改filebeat配置文件，添加如下内容，删除掉不要的字段
<pre class="pure-highlightjs"><code class="null">processors:
 - drop_fields:
     fields:
     - beat
     - host
     - input
     - source
     - offset
     - prospector</code></pre>
&nbsp;

<img src="images/f3a714a4c69654f7f56b0ce5c773bc11.png" />


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1686/  

