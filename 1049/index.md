# 使用xtrbackup(innobackupex)全量备份mysql(一)

<!--more-->
版本对应关系：

mysql 5.1 – xtrabackup2.0

mysql5.6 --xtrabackup 2.2

mysql5.7 --xtrabackup2.4

mysql8.0 --xtrabackup8.0

&nbsp;

xtrbackup工具下载安装：

2.4：

https://www.percona.com/downloads/Percona-XtraBackup-2.4/LATEST/

8.0：

https://www.percona.com/downloads/Percona-XtraBackup-LATEST/

&nbsp;

yum方式安装：
<pre class="line-numbers" data-start="1"><code class="language-bash">wget https://www.percona.com/redir/downloads/percona-release/redhat/1.0-13/percona-release-1.0-13.noarch.rpm
rpm -ivh percona-release-1.0-13.noarch.rpm
yum install percona-xtrabackup-24</code></pre>
&nbsp;

直接下载安装：
<pre class="line-numbers" data-start="1"><code class="language-bash">wget https://www.percona.com/downloads/XtraBackup/Percona-XtraBackup-2.4.4/binary/redhat/7/x86_64/percona-xtrabackup-24-2.4.4-1.el7.x86_64.rpm
yum localinstall percona-xtrabackup-24-2.4.4-1.el7.x86_64.rpm</code></pre>
&nbsp;

<hr />

<span style="color: #ff0000;">innobackupex的常用选项：</span>

--default-files：可通过此选项指定其它的配置文件；但是使用时<span style="color: #ff0000;">必须放于所有选项的最前面</span>

--host：指定数据库服务器地址

--port：指定连接到数据库服务器的哪个端口

--socket：连接本地数据库时使用的套接字文件路径

--no-timestamp：在使用innobackupex进行备份时，可使用--no-timestamp选项来阻止命令自动创建一个以时间命名的目录；如此一来，innobackupex命令将会创建一个BACKUP-DIR目录来存储备份数据

--incremental：指定增量备份路径

--incremental-basedir：指定基于哪个备份做增量备份

--apply-log：指定xtrabackup_logfile文件，一般情况下,在备份完成后，数据尚且不能用于恢复操作，因为备份的数据中可能会包含尚未提交的事务或已经提交但尚未同步至数据文件中的事务。因此，此时数据 文件仍处理不一致状态。--apply-log的作用是通过回滚未提交的事务及同步已经提交的事务至数据文件使数据文件处于一致性状态。

--redo-only：只重做已提交的事务，不回滚未提交的事务

--use-memory：在“准备”阶段可提供多少内存以加速处理，默认是100M

--copy-back：指定恢复数据目录，数据库服务器的数据目录

--compact：压缩备份

--stream={tar|xbstream}：对备份的数据流式化处理

--parallel=2：指定线程数

&nbsp;
<h3><span style="color: #ff0000;">全备份：</span></h3>
&nbsp;

1）创建备份用户
<pre class="line-numbers" data-start="1"><code class="language-bash">grant reload,lock tables,replication client,create tablespace,super on *.* to bakuser@'172.16.213.%' identified by '123456';
</code></pre>
&nbsp;

2）进行全库备份
<pre class="line-numbers" data-start="1"><code class="language-bash">innobackupex --defaults-file=/etc/my.cnf --user=bakuser --password=123456  --socket=/tmp/mysql.sock  /data/backup/full/
</code></pre>
使用innobakupex备份时，其会调用xtrabackup备份所有的InnoDB表，复制所有关于表结构定义的相关文件(.frm)、以及MyISAM、MERGE、CSV和ARCHIVE表的相关文件，同时还会备份触发器和数据库配置信息相关的文件。这些文件会被保存至一个以时间戳命名的目录中。

&nbsp;
<h3><span style="color: #ff0000;">全备恢复：</span></h3>
&nbsp;
<pre class="line-numbers" data-start="1"><code class="language-bash">1.停止数据库
systemctl stop mysqld

2.模拟故障
 mv /data/mysql  /data/mysql.bak

3.创建目录
mkdir -p /data/mysql

4.开始恢复
#innodb引擎需要执行，应用事务日志的提交和回滚
innobackupex --apply-log /data/backup/full/2019-11-04_19-09-48/

#恢复，也可以执行cp -r命令手动恢复
innobackupex --default-file=/etc/my.cnf --copy-back /data/backup/full/2019-11-04_19-09-48/

#赋予权限
chown -R mysql.mysql /data/mysql</code></pre>
&nbsp;
<h3><span style="color: #ff0000;">指定库备份：</span></h3>
&nbsp;

指定单库：

--databases=wordpress

指定多库,使用空格分隔：

--databases="wordpress emlog"
<pre class="line-numbers" data-start="1"><code class="language-bash">innobackupex --defaults-file=/etc/my.cnf --user=bakuser --password=123456  --socket=/tmp/mysql.sock  --databases=wordpress /data/backup/blog/</code></pre>
&nbsp;
<h3><span style="color: #ff0000;">指定库恢复：</span></h3>
&nbsp;
<pre class="line-numbers" data-start="1"><code class="language-bash">1.模拟故障
mysql&gt;   delete from admin where id=3;

2.停止数据库
systemctl stop mysqld

3.innodb引擎需要执行，应用事务日志的提交和回滚
innobackupex --apply-log /data/backup/blog/2019-11-06_17-27-50

#恢复
cp -r /data/backup/blog/2019-11-06_17-27-50/emlog/ /data/mysql/</code></pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1049/  

