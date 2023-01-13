# ansible命令常用参数和Ad-hoc的使用格式

<!--more-->
<span style="color: #ff0000;"><strong>ansible命令的常用选项：</strong></span>

-m MODULE_NAME：指定要执行的模块的名称，如果不指定-m选项，默认是COMMAND模块。

-a MODULE_ARGS,：指定执行模块对应的参数选项。

-k：提示输入SSH登录的密码而不是基于密钥的验证

-K：用于输入执行su或sudo操作时需要的认证密码。

-b：表示提升权限操作。

--become-method：指定提升权限的方法，常用的有 sudo和su，默认是sudo。

--become-user：指定执行 sudo或su命令时要切换到哪个用户下，默认是root用户。

-B ：指定一个时间，命令运行时间超过时就结束此命令

-C：测试一下会改变什么内容，不会真正去执行，主要用来测试一些可能发生的变化

-f FORKS,：设置ansible并行的任务数。默认值是5

-i INVENTORY： 指定主机清单文件的路径，默认为/etc/ansible/hosts。

&nbsp;

<span style="color: #ff0000;"><strong>Ad-hoc执行：</strong></span>

ansible 主机或组   -m  模块名  -a   '模块参数'   ansible参数

<b>  </b>

<b>主</b><b>机和</b><b>组</b>：是在/etc/ansible/hosts 里进行指定的部分。也可以使用脚本从外部应用里获取的主机。动态Inventory(清单)

<b>模</b><b>块</b><b>名</b>：可以通过ansible-doc -l 查看目前安装的模块，默认不指定时，使用的是command模块，具体可以查看/etc/ansible/ansible.cfg 的“#module_name = command ” 部分，默认模块可以在该配置文件中进行修改；

<b>模</b><b>块参</b><b>数</b>：可以通过 “ansible-doc 模块名” 查看具体的用法及后面的参数；

<b>ansible</b><b>参</b><b>数</b>：可以通过ansible命令的帮忙信息里查看到，这里有很多参数可以供选择，如是否需要输入密码、是否sudo等。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/776/  

