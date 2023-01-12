# 使用xtrbackup(innobackupex)增量备份mysql(二)

<!--more-->
增量备份仅针对于innodb引擎，对于myisam引擎依然是全备。

参数说明：

--user：数据库用户名

--password：数据库密码

--socket：连接本地数据库时使用的套接字文件路径

--incremental：指定增量备份路径

--incremental-basedir：指定基于哪个备份做增量备份

--parallel=2：指定线程数量

--apply-log：指定xtrabackup_logfile文件，一般情况下,在备份完成后，数据尚且不能用于恢复操作，因为备份的数据中可能会包含尚未提交的事务或已经提交但尚未同步至数据文件中的事务。因此，此时数据 文件仍处理不一致状态。--apply-log的作用是通过回滚未提交的事务及同步已经提交的事务至数据文件使数据文件处于一致性状态。

--redo-only：只重做已提交的事务，不回滚未提交的事务

--incremental-dir：指定增量备份的目录

&nbsp;
<h4><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">增量备份三个步骤：</span></strong></span></h4>
&nbsp;

1.全备（备份至 /data/backup/full/目录）

innobackupex --defaults-file=/etc/my.cnf --user=root --password=123456 --socket=/tmp/mysql.sock   /data/backup/full/

&nbsp;

2.第一次增量备份（基于全备）

innobackupex --defaults-file=/etc/my.cnf --user=root --password=123456 --scoket=/tmp/mysql.sock --incremental /data/backup/incremental <span style="color: #ff0000;">--incremental-basedir=/data/backup/full/2019-11-06_15-04-50</span> --parallel=2

&nbsp;

3.第二次增量备份（基于上一次的增量备份）

innobackupex --defaults-file=/etc/my.cnf --user=root --password=123456 --socket=/tmp/mysql.sock --incremental /data/backup/incremental/ <span style="color: #ff0000;">--incremental-basedir=/data/backup/incremental/2019-11-06_15-19-32/</span> --parallel=2

&nbsp;
<h4><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">增量备份的恢复：</span></strong></span></h4>
&nbsp;

1.应用事务日志的提交，不执行回滚
<pre class="line-numbers" data-start="1"><code class="language-bash">innobackupex --apply-log --redo-only /data/backup/full/2019-11-06_15-04-50/</code></pre>
&nbsp;

2.执行第一个增量备份的恢复
<pre class="line-numbers" data-start="1"><code class="language-bash">innobackupex --apply-log --redo-only /data/backup/full/2019-11-06_15-04-50/ --incremental-dir=/data/backup/incremental/2019-11-06_15-19-32/</code></pre>
&nbsp;

3.执行第二个增量备份的恢复（<strong><span style="color: #ff0000;">恢复最后一个增量备份的时候需要去掉redo-only参数</span></strong>）
<pre class="line-numbers" data-start="1"><code class="language-bash">innobackupex --apply-log /data/backup/full/2019-11-06_15-04-50/ --incremental-dir=/data/backup/incremental/2019-11-06_15-32-05/</code></pre>
&nbsp;

4.把所有合在一起的完全备份整体进行一次apply操作，回滚未提交的数据：
<pre class="line-numbers" data-start="1"><code class="language-bash">innobackupex --apply-log /data/backup/full/2019-11-06_15-04-50/</code></pre>
&nbsp;

5.将备份恢复到mysql数据文件目录
<pre class="line-numbers" data-start="1"><code class="language-bash">#模拟故障
mv /data/mysql{,2}
systemctl stop mysqld

#执行恢复，也可以执行cp -r命令手动恢复
innobackupex --defaults-file=/etc/my.cnf --copy-back --rsync /data/backup/full/2019-11-06_15-04-50/

#修改权限启动mysql
chown -R mysql.mysql mysql
systemctl start mysqld</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1083/  

