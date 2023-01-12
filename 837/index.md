# nginx中if指令的使用

<!--more-->
if指令用于判断一个条件，如果条件成立，则后面的大括号内的语句将执行

语法：if (condition) { … }

默认值：none

使用字段：server, location

在默认情况下，if指令默认值为空，可在nginx配置文件的server、location部分使用，另外，if指令可以在判断语句中指定正则表达式或通过nginx内置变量匹配条件等，相关匹配条件如下：

正则表达式匹配规则：

~ 表示区分大小写匹配

~* 表示不区分大小写匹配

!~和!~*分别表示区分大小写不匹配及不区分大小写不匹配

&nbsp;

文件及目录匹配：

-f和!-f用来判断是否存在文件

-d和!-d用来判断是否存在目录

-e和!-e用来判断是否存在文件或目录

-x和!-x用来判断文件是否可执行

&nbsp;

举例判断浏览器UA：
<pre class="pure-highlightjs"><code class="nginx">if ($http_user_agent ~* mac) {
        return 404;
}</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/837/  

