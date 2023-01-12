# gitlab备份恢复

<!--more-->
<span style="font-size: 12pt;"><strong>备份：</strong></span>

1) 修改默认存放备份站点目录，然后进行重新加载配置文件。
<pre>vim /etc/gitlab/gitlab.rb

gitlab_rails['backup_path'] = "/data/gitlab/backups" #修改备份路径
gitlab_rails['backup_keep_time'] = 604800 #备份保留7天

[root@gitlab-ce ~]# gitlab-ctl reconfigure</pre>
&nbsp;

2)手动执行备份命令，会将备份的结果存储 至/data/gitlab/backups目录中
<pre>gitlab-rake gitlab:backup:create</pre>
&nbsp;

<span style="font-size: 12pt;"><strong>恢复gitlab数据：</strong></span>

1) 停止数据写入服务
<pre>gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq</pre>
&nbsp;

2) 恢复数据(不需要备份的_gitlab_backup.tar)
<pre>gitlab-rake gitlab:backup:restore BACKUP=1566444436_2019_08_21_12.0.3</pre>
&nbsp;

3) 启动服务
<pre>gitlab-ctl start unicorn
gitlab-ctl start sidekiq</pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/797/  

