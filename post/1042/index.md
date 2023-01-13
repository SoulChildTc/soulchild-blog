# 获取变量长度和变量切片

<!--more-->
获取变量长度：
<pre class="line-numbers" data-start="1"><code class="language-bash">[root@soulchild ~]# content=soulchild
[root@soulchild ~]# echo ${content}
soulchild

#加井号
[root@soulchild ~]# echo ${#content}
9

#使用expr
[root@soulchild ~]# expr length ${content}
9

#使用awk
[root@soulchild ~]# echo $content | awk '{print length}'
9</code></pre>
&nbsp;

变量切片：
<pre class="line-numbers" data-start="1"><code class="language-bash">#从第四个字符开始取值，取5个字符
[root@soulchild ~]# echo ${content:4:5}
child</code></pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1042/  

