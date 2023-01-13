# rsync基本使用

<!--more-->
<span style="font-size: 12pt;">rsync注意：目录要求</span>
<div class="li"><span style="font-size: 12pt;">/home ： 表示将整个 /home 目录复制到目标目录</span></div>
<div class="li"><span style="font-size: 12pt;">/home/ ： 表示将 /home 目录中的所有内容复制到目标目录</span></div>
<div class="li"><span style="font-size: 12pt;"> </span></div>
&nbsp;

<span style="font-size: 12pt;">参数说明：</span>
<span style="font-size: 12pt;">-a, --archive               archive mode; equals -rlptgoD (no -H,-A,-X)</span>
<span style="font-size: 12pt;">    -rlptgoD(实际参数)</span>
<span style="font-size: 12pt;">        -r  --递归目录</span>
<span style="font-size: 12pt;">        -l  --links 传输链接文件 </span>
<span style="font-size: 12pt;">        -p  --perms 权限</span>
<span style="font-size: 12pt;">        -t  time  文件时间不变</span>
<span style="font-size: 12pt;">        -g  --group 文件所有组</span>
<span style="font-size: 12pt;">        -o  --owner  文件所有者</span>

<span style="font-size: 12pt;">-v 显示过程</span>

<span style="font-size: 12pt;">-P 显示传输进度百分百</span>

<span style="font-size: 12pt;">-z 传输的时候进行压缩</span>

<span style="font-size: 12pt;">-e "ssh -p22" 指定ssh端口号</span>

<span style="font-size: 12pt;">--delete  保持目标与原始目录一模一样  删除不同的部分</span>

<span style="font-size: 12pt;">排除</span>

<span style="font-size: 12pt;">--exclude=03.txt</span>
<span style="font-size: 12pt;">--exclude-from 根据提供的文件内容进行排除（文件内容一行一个路径即可）</span>

&nbsp;

<span style="font-size: 12pt;">使用格式：</span>

<span style="font-size: 12pt;">rsync 参数 要传输的文件或目录 目标路径</span>

<span style="font-size: 12pt;">举例：</span>

<span style="font-size: 12pt;">#将本地/etc/sysconfig 目录传输到目标服务器中</span>

<span style="font-size: 12pt;">rsync -avz /etc/sysconfig    172.16.1.31:/tmp</span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/190/  

