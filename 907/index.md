# shell中变量的替换和删除

<!--more-->
<table>
<tbody>
<tr>
<td valign="top" width="250">变量表达式</td>
<td valign="top" width="500">说明</td>
</tr>
<tr>
<td valign="top" width="189">${变量#关键字}</td>
<td valign="top" width="379">若变量内容从头开始的数据符合“关键字”，则将符合的最短数据删除</td>
</tr>
<tr>
<td valign="top" width="189">${变量##关键字}</td>
<td valign="top" width="379">若变量内容从头开始的数据符合“关键字”，则将符合的最长数据删除</td>
</tr>
<tr>
<td valign="top" width="189">${变量%关键字}</td>
<td valign="top" width="379">若变量内容从尾向前的数据符合“关键字”，则将符合的最短数据删除</td>
</tr>
<tr>
<td valign="top" width="189">${变量%%关键字}</td>
<td valign="top" width="379">若变量内容从尾向前的数据符合“关键字”，则将符合的最长数据删除</td>
</tr>
<tr>
<td valign="top" width="189">${变量/旧字符串/新字符串}</td>
<td valign="top" width="379">若变量内容符合“旧字符串”，则第一个旧字符串会被新字符串替换</td>
</tr>
<tr>
<td valign="top" width="189">${变量//旧字符串/新字符串}</td>
<td valign="top" width="379">若变量内容符合“旧字符串”，则全部的旧字符串会被新字符串替换</td>
</tr>
</tbody>
</table>
&nbsp;

&nbsp;

#&amp;##举例：
<pre class="line-numbers" data-start="1"><code class="language-bash">[root@apache ~]# echo $str
123/456/78/9/1

#从前往后匹配，删除匹配的最短的内容--&gt;“123/”
[root@apache ~]# echo ${str#*/}
456/78/9/1

#从前往后匹配，删除匹配的最长的内容--&gt;“123/456/78/9/” 
[root@apache ~]# echo ${str##*/} 1 
</code></pre>
&nbsp;

%&amp;%%举例：
<pre class="line-numbers" data-start="1"><code class="language-bash">[root@apache ~]# echo $str
123/456/78/9/1

#从后向前匹配，删除匹配最短的部分--&gt;“/1”
[root@apache ~]# echo ${str%/*} 
123/456/78/9

#从后向前匹配，删除匹配最长的部分--&gt;“/456/78/9/1”
[root@apache ~]# echo ${str%%/*}
123
</code></pre>
&nbsp;

/&amp;//举例：
<pre class="line-numbers" data-start="1"><code class="language-bash">[root@apache ~]# echo $str
123/123/234/123/1

#替换123为000
[root@apache ~]# echo ${str/123/000}
000/123/234/123/1

#替换所有123为000
[root@apache ~]# echo ${str//123/000}
000/000/234/000/1</code></pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/907/  

