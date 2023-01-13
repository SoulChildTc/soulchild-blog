# 记一次wordpress4.7迁移一系列问题！

<!--more-->
以前没事弄了一个阿里云虚拟主机玩，搭了个wordpress，后来虚拟主机到期，很长时间也不管，最近突然又想用博客记录东西，想着把以前的东西在拿出来继续用，幸好数据库和网站备份了。

开始恢复：

1.首先搭建好lamp环境

2.上传数据库和网站程序

将网站程序放到web根目录

mv htdocs-2017-6-13/* /var/www/html/

导入的时候需要注意wp的编码和mysql的一致性

[root@bogon ~]# mysql -uroot -p wordpress &lt; 22607_all.sql

可以查看wp-config.php文件中的编码

grep DB_CHARSET ./wp-config.php

define('DB_CHARSET', 'utf8');

[root@bogon html]# mysql -uroot -p -e "\s" | grep char
Enter password:
Server characterset:utf8
Db     characterset:utf8
Client characterset:utf8
Conn.  characterset:utf8

3.修改wp-config.php文件中数据库连接信息

4.此时打开发现首页正常访问，但是内页404，后台空白

404可以理解之前设置的伪静态，但是后台空白不知道怎么回事，百度了一下说是插件的问题，把插件目录临时改名就可以了

mv wp-content/plugins wp-content/pluginsbak

此时打开后台正常访问，但是。。。密码忘了

先去查下用户名

select user_login from wp_users;

然后修改密码

update wp_users set user_pass=md5("密码") where user_login='用户名';

5.成功登陆后台，<span style="white-space: normal;">将plugins目录改回来</span>

<span style="white-space: normal;">mv wp-content/pluginsbak wp-content/plugins</span>

将固定链接改为朴素解决内页404问题，或修改伪静态规则


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/354/  

