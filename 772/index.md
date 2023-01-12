# ansible配置文件参数参考

<!--more-->
/etc/ansible/ansible.cfg

&nbsp;

#inventory= /etc/ansible/hosts   该参数表示资源清单inventory文件的位置，资源清单就是一些Ansible需要连接管理的主机列表

&nbsp;

#library= /usr/share/my_modules/   Ansible的操作动作，无论是本地或远程，都使用一小段代码来执行，这小段代码称为模块，这个library参数就是指向存放Ansible模块的目录

&nbsp;

#remote_tmp= ~/.ansible/tmp   指定远程执行的路径

&nbsp;

#local_tmp= ~/.ansible/tmp   ansible管理节点的执行路径

&nbsp;

#forks= 5   forks 设置默认情况下Ansible最多能有多少个进程同时工作，默认设置最多5个进程并行处理。具体需要设置多少个，可以根据控制主机的性能和被管理节点的数量来确定。

&nbsp;

#poll_interval= 15   轮询间隔

&nbsp;

#sudo_user= root   sudo使用的默认用户 ，默认是root

&nbsp;

#ask_sudo_pass = True  是否需要用户输入sudo密码

&nbsp;

#ask_pass= True   是否需要用户输入连接密码

&nbsp;

#remote_port= 22  这是指定连接对端节点的管理端口，默认是22，除非设置了特殊的SSH端口，不然这个参数一般是不需要修改的

#module_lang= C  这是默认模块和系统之间通信的计算机语言,默认为’C’语言.

&nbsp;

host_key_checking= False  跳过ssh首次连接提示验证部分，False表示跳过。

&nbsp;

#timeout= 10  连接超时时间

&nbsp;

#module_name= command   指定ansible默认的执行模块

&nbsp;

#nocolor= 1    默认ansible会为输出结果加上颜色,用来更好的区分状态信息和失败信息.如果你想关闭这一功能,可以把’nocolor’设置为‘1’:

&nbsp;

#private_key_file=/path/to/file.pem  在使用ssh公钥私钥登录系统时候，使用的密钥路径。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/772/  

