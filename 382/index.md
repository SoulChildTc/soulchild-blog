# zabbix监控之利用percona-zabbix监控mysql数据库

<!--more-->
percona-zabbix插件下载地址：https://www.percona.com/downloads/

注意：使用percona需要安装php和php-mysql
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">安装：</span></strong></span></h3>
rpm -ivh percona-zabbix-templates-1.1.8-1.noarch.rpm

安装完后注意两个目录：

Scripts are installed to /var/lib/zabbix/percona/scripts    # 脚本目录

Templates are installed to /var/lib/zabbix/percona/templates    # 配置文件以及模板

&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">导入模板 配置zabbix自定义监控项：</span></strong></span></h3>
安装自带的模板和zabbix4.0不兼容，这边就使用别人修改好的模板了，也可以安装一个zabbix2.0版本导入后，升级到4.0版本，在导出就可以用了。

模板下载地址：<a href="https://pan.baidu.com/s/1P9vlJYU9ZEx6o3ktyBM7ng" target="_blank" rel="noopener">https://pan.baidu.com/s/1P9vlJYU9ZEx6o3ktyBM7ng</a> 提取码：uho1

把zbx_percona_mysql_template.xml模板导入到zabbix中。

到percona模板目录中把模板配置文件复制到zabbix_agent.d目录中,并重启zabbix-agent
<pre>cp userparameter_percona_mysql.conf /etc/zabbix/zabbix_agentd.d/
systemctl restart zabbix-agent</pre>
修改percona脚本/var/lib/zabbix/percona/scripts/ss_get_mysql_stats.php，修改为对应内容

$mysql_user = 'zabbix';

$mysql_pass = 'password';

$mysql_port = 3306;

$mysql_socket = '/var/lib/mysql/mysql.sock';

&nbsp;

测试脚本是否正常使用，正常取值，ok

/var/lib/zabbix/percona/scripts/get_mysql_stats_wrapper.sh kt

测试完记得删除生成的文件，因为手动执行时root用户，zabbix访问文件没有权限，需要让zabbix来生成这个文件

rm -f /tmp/localhost-mysql_cacti_stats.txt

&nbsp;
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">主机链接模板：</span></strong></span></h3>
链接模板：

配置==》主机==》zabbix server==》模板==》添加percona-mysql模板

添加完成后，在主机的应用集中可以看到MySQL，并有191个监控项

查看最新数据：

检测==》最新数据==》过滤出MySQL应用集

&nbsp;
<h3><span style="color: #ff0000; font-size: 12pt;"><strong>mysql主从监控项修改：</strong></span></h3>
监控项中MySQL running slave显示不支持

Value "ERROR 1045 (28000): Access denied for user 'zabbix'@'localhost' (using password: NO) 0" of type "string" is not suitable for value type "Numeric (unsigned)"

&nbsp;

手动执行一下脚本：
<pre>        sh get_mysql_stats_wrapper.sh running-slave</pre>
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)

0

用户名密码错误的原因，修改get_mysql_stats_wrapper.sh脚本中19行的内容，需要指定一个拥有SUPER,REPLICATION CLIENT权限的用户

RES=`HOME=~zabbix mysql -uroot -pxxx -e 'SHOW SLAVE STATUS\G'.......................................略

&nbsp;

此时监控项显示正常。

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/382/  

