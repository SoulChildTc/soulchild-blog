# cp，mv等花括号用法

<!--more-->
<span style="color: #ff0000;"><strong>格式：</strong></span>

{要替换的字符串,替换后的字符串}：左花括号要放在需要替换的字符串前面

&nbsp;

<strong><span style="color: #ff0000;">例如：</span></strong>

test.txt改为ceshi.txt

mv {test,ceshi}.txt

&nbsp;

将1.txtb改为1.txt

mv 1.txt{b,}

&nbsp;

将1.txt改为1.txtb

mv 1.txt{,b}

&nbsp;

将1.txt改为123.txt

mv {1,123}.txt

&nbsp;

<span style="white-space: normal;">将1.txt改为test.txt</span>

mv {1,test}.txt


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/375/  

