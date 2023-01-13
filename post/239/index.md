# ansible常用模块的简单使用

<!--more-->
<strong><span style="font-size: 14px; color: #e53333;"><span style="color: #000000; font-size: 16px;">ansible模块使用官方文档：</span><a href="https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html" target="_blank" rel="noopener">https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html</a>
</span></strong>

&nbsp;

<strong><span style="font-size: 14px; color: #e53333;"># command模块常用选项(默认模块，<strong>此模块只能执行一些简单的命令，需要目标主机拥有python环境</strong>)</span></strong>

<strong>creates</strong>：一个文件名，当该文件存在，则该命令不执行，反正，则执行。

<strong>chdir</strong>：在执行指令之前，先切换到该指定的目录

<strong>removes</strong>：一个文件名，当该文件存在时，则该选项执行，反之，不执行。

举例：
<pre>[root@m01 ~]# ansible all -m command -a "hostname"
因为command是默认模块，所以也可以写成：
[root@m01 ~]# ansible all -a "hostname"</pre>
<pre>#sshd.pid文件不存在执行service start sshd,存在就不执行
[root@m01 ~]# ansible all -a 'creates=/run/sshd.pid service start sshd'

#切换目录，然后在执行pwd
[root@m01 ~]# ansible all -m command -a "chdir=/opt pwd"</pre>
&nbsp;

<strong><span style="color: #e53333; font-size: 14px;"># shell模块(使用方法同command模块,需要目标主机拥有python环境)</span></strong>
<pre>[root@m01 ~]# ansible all -m shell -a "hostname &gt;&gt; /tmp/hostname.txt"</pre>
&nbsp;

<span style="color: #ff0000;"><strong># raw模块（使用方法同command模块,目标主机无需拥有python环境）</strong></span>

没有creates，chdir，removes这三个选项

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;"># script模块(远程执行脚本)</span></strong>

#直接写本地脚本路径即可
<pre>[root@m01 scripts]# ansible all -m script -a "./yum.sh"</pre>
&nbsp;

<strong><span style="color: #e53333; font-size: 14px;"># file模块(<strong><span style="color: #e53333; font-size: 14px;">设置文件符号链接和目录的属性，或删除文件/符号链接/目录<strong><span style="color: #e53333; font-size: 14px;">)</span></strong></span></strong></span></strong>

<strong>force</strong>：需要在两种情况下强制创建软链接，一种是源文件不存在但之后会建立的情况下；另一种是目标软链接已存在,需要先取消之前的软链，然后创建新的软链，有两个选项：yes|no

<strong>group</strong>：定义文件/目录的属组

<strong>mode</strong>：定义文件/目录的权限

<strong>owner</strong>：定义文件/目录的属主

<strong>path</strong>：必选项，定义文件/目录的路径

<strong>recurse</strong>：递归的设置文件的属性，只对目录有效 yes | no

<strong>src</strong>：要被链接的源文件的路径，只应用于state=link的情况

<strong>dest</strong>：被链接到的目标路径，只应用于state=link的情况

<strong>state</strong>： 有如下几个选项：

<strong>directory</strong>：表示目录，如果目录不存在，则创建目录。

<strong>link</strong>：创建软链接

<strong>hard</strong>：创建硬链接

<strong>touch</strong>：如果文件不存在，则会创建一个新的文件，如果文件或目录已存在，则更新其最后修改时间

<strong>absent</strong>：删除目录、文件或者取消链接文件。

&nbsp;
<pre># 创建目录
[root@m01 scripts]# ansible all -m file -a "path=/root/soulchild state=directory"

#在root目录下创建soulchild目录，设置所有者和组为nobody，权限为644，递归设置权限
[root@m01 scripts]# ansible all -m file -a 'path=/root/soulchild owner=nobody group=nobody mode=644 recurse=yes'

# 创建软连接
[root@m01 scripts]# ansible all -m file -a "src=/etc/hosts dest=/root/hosts state=link"
</pre>
&nbsp;

<span style="color: #ff0000;"><strong># copy模块(将文件从本地复制到远程主机)</strong></span>

copy模块包含如下选项：

<strong>backup</strong>：在覆盖之前将原文件备份，备份文件包含时间信息。有两个选项：yes|no

<strong>content</strong>：用于替代”src”参数,可以直接设定指定文件的值

<strong>dest</strong>：必选项。要将源文件复制到的远程主机的绝对路径，如果源文件是一个目录，那么该路径也必须是个目录

<strong>directory_mode</strong>：递归的设定目录的权限，默认为系统默认权限

<strong>force</strong>：如果目标主机包含该文件，但内容不同，如果设置为yes，则强制覆盖，如果为no，则只有当目标主机的目标位置不存在该文件时，才复制。默认为yes

<strong>src</strong>：要复制到远程主机的文件在本地的地址，可以是绝对路径，也可以是相对路径。如果路径是一个目录，它将递归复制。在这种情况下，如果路径使用”/”来结尾，则只复制目录里的内容，如果没有使用”/”来结尾，则包含目录在内的整个内容全部复制，类似于rsync。

<strong>validate</strong>：复制到目标位置之前先运行的验证命令。要验证的文件的路径通过“%s”传入。使用：validate='visudo -cf %s'

其他参数：所有的file模块里的选项都可以在这里使用

&nbsp;
<pre>#将本地的show.sh发送到所有主机的/root目录下
[root@m01 ~]# ansible all -m copy -a "src=/server/scripts/show.sh dest=/root"

#将本地的show.sh发送到所有主机的/root目录下，并设置所有者和权限
[root@m01 ~]# ansible all -m copy -a "src=/server/scripts/show.sh dest=/root owner=nobody group=nobody mode=755"
</pre>
&nbsp;

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;"># yum模块(安装删除软件包)</span></strong>

name:软件包的名称

state:
<ul>
 	<li>   absent:删除软件</li>
 	<li>   installed:安装</li>
 	<li>   latest:更新</li>
 	<li>   present:安装，同installed(默认)</li>
 	<li>   removed:删除软件</li>
</ul>
&nbsp;

# 批量删除软件

[root@m01 scripts]# ansible all -m yum -a "name=cowsay state=removed"

&nbsp;

# 批量安装软件

[root@m01 scripts]# ansible all -m yum -a "name=cowsay state=installed"

&nbsp;

<strong><span style="color: #e53333; font-size: 14px;"># cron模块(添加定时任务)</span></strong>

minute:0-59

hour:0-23

day:1-31

month:1-12

weekday:0-6===&gt;周日-周六

<strong>可以用*，  */2这种形式，不写为*</strong>

name:描述，添加任务需要填写(删除时按照次名称删除)

job:要执行的命令

state:

absent:删除

present:添加(默认)

user:指定指定用户，默认为root

&nbsp;

# 每天00:00开始备份etc目录

[root@m01 scripts]# ansible all -m cron -a 'name="backup etc" minute=00 hour=00 job="tar zcf /tmp/etc-`date +%Y%m%d-%H%M`.tar.gz /etc &gt; /dev/null 2&gt;&amp;1" state=present'

&nbsp;

# 删除指定任务

[root@m01 scripts]# ansible all -m cron -a "name='backup etc' state=absent"

&nbsp;

<strong><span style="color: #e56600; font-size: 14px;">每个模块官方都有更详细的例子和使用参数，这里只写一些简单的举例</span></strong>

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/239/  

