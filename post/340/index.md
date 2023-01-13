# mysql防止误操作,开启-U参数

<!--more-->
[root@db01 ~]# mysql --help | grep "\-U"
-U, --safe-updates  Only allow UPDATE and DELETE that uses keys.

-U, --i-am-a-dummy  Synonym for option --safe-updates, -U.

<span style="font-family: -apple-system, &quot;font-size:16px; white-space: normal;">说明：在mysql命令加上选项-U后，当执行UPDATE或DELETE时，没有WHERE或LIMIT关键字的时候，mysql程序就会拒绝执行</span>

&nbsp;

例如：执行以下内容时 拒绝执行

mysql -uroot -p -S /data/3306/mysql.sock -U

mysql&gt; update test set name='soul';
ERROR 1175 (HY000): You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column

&nbsp;

将mysql -U制作成别名，永久生效需要追加到/etc/profile文件中

<span style="white-space: normal;">[root@db01 ~]# </span>alias mysql="mysql -U"

此时登录mysql，不加-U，依然会有安全提示

[root@db01 ~]# mysql -uroot -p -S /data/3306/mysql.sock

<span style="white-space: normal;">mysql&gt; update test set name='soul';</span><br style="white-space: normal;" /><span style="white-space: normal;">ERROR 1175 (HY000): You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column</span>

<span style="color: #e53333;">注:<span style="background-color: #e53333; color: #000000;">此方法只有在本地登录时才起作用</span></span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/340/  

