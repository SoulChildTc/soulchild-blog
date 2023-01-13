# sed命令的使用

<!--more-->
<h2><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">命令格式：</span></strong></span></h2>
sed [options] 'command' file(s)

sed [options] '要操作的行 内置命令'  file

or

<span style="white-space: normal;">sed [options] '/正则表达式/内置命令'  file</span>

正则也可以不用/，用#@~特殊符号也可以

选项参数

-e 允许多项编辑
-n 取消默认的输出
-i 直接修改对应文件
-r 支持扩展元字符

内置命令参数

a      在当前行后添加一行或多行

c       在当前行进行替换修改

d      在当前行进行删除操作

i       在当前行之前插入文本

p      打印匹配的行或指定行

n      读入下一输入行，从下一条命令进行处理

!       对所选行以外的所有行应用命令

<span style="white-space: normal;">w      将匹配的内容写入到一个新的文件中</span>

h      把模式空间里的内容重定向到暂存缓冲区

H      把模式空间里的内容追加到暂存缓冲区

g      取出暂存缓冲区的内容，将其复制到模式空间，覆盖该处原有内容

G      取出暂存缓冲区的内容，将其复制到模式空间，追加在原有内容后面

s       替换命令标志

g      行内全局替换

i       忽略替换大小写

&nbsp;

举例（加-i才会修改文件）：

-e：先删除1-9行 在进行内容替换

sed -e '1,9d' -e 's#root#admin#g' passwd
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">p：p和-n一般一起使用</span></strong></span></h2>
打印包含halt的行

sed -n  '/halt/<span style="color: #e53333;">p</span>' passwd

打印第二行的内容

sed -n  '2<span style="color: #e53333;">p</span>' passwd

打印最后一行的内容

sed -n  '$<span style="color: #e53333;">p</span>' passwd
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">a：<span style="white-space: normal;">在当前行后添加一行或多行</span></span></strong></span></h2>
在第3行的下一行添加指定内容

sed '3<span style="color: #e53333;">a</span> content' test.conf
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">c：<span style="white-space: normal;">在当前行进行替换修改</span></span></strong></span></h2>
修改第七行的内容

sed '7<span style="color: #e53333;">c</span> SELINUX=Disabled' /etc/selinux/config

也可以使用正则，找出以SELINUX=开头的内容的行，修改为执行内容

sed '/^SELINUX=/<span style="color: #e53333;">c</span> SELINUX=Disabled' /etc/selinux/config
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">d：删除行</span></strong></span></h2>
删除第二行的内容

sed '2<span style="color: #e53333;">d</span>' test.conf

删除最后一行的内容

sed '$<span style="color: #e53333;">d</span>' test.conf

使用正则删除包含mail的行

sed /mail/<span style="color: #e53333;">d</span> test.conf
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">i：<span style="white-space: normal;">在当前行之前插入文本</span></span></strong></span></h2>
在第三行插入的上一行添加指定内容

sed '3i content;' passwd
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">w：将匹配的内容写入到一个新的文件中</span></strong></span></h2>
将包含root的行，写入新的文件当中

sed -n '/root/w newfile' passwd
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">n：对下一行进行操作</span></strong></span></h2>
删除包含root行的下一行

sed '/root/{n;d}' passwd

替换root行下一行的内容

sed -n '/root/{n;s#login#aaaaaaa#;p}' passwd
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">!：</span><span style="white-space: normal; color: #e53333;">对所选行以外的所有行应用命令</span></strong></span></h2>
<span style="white-space: normal;">删除除了第三行的所有内容</span>

sed '3!d' /etc/hosts
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">s：替换字符串，i：忽略大小写，g：行中所有匹配内容都替换</span></strong></span></h2>
将所有root修改为admin，忽略大小写

sed 's/root/admin/gi' passwd

&amp;代表前面匹配到的内容，下面命令的作用就是在nologin结尾的行后面添加test

sed 's/nologin$/&amp;test/' passwd
<h2><span style="font-size: 12pt;"><strong><span style="color: #e53333;">后向引用:在正则部分加括号，第一个括号匹配的内容为\1，第二个为\2    </span><span style="color: #e53333;">......，&amp;代表正则表达式整体匹配的内容</span></strong></span></h2>
查找出eth1网卡的ip地址

ip a s eth1 | sed -n 3p | sed 's#.*et (.*)/.*#\1#'

指定行批量添加注释。^匹配的是行首，替换为#&amp;，即为在行首添加#号

sed '2,5s/^/#&amp;/' test.conf

匹配内容添加注释，在root所在行的行首添加注释

sed '/root/s/^/#&amp;/' test.conf


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/365/  

