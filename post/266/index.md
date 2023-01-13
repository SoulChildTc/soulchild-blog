# centos7-mysql5.7.20免安装版配置初始化

<!--more-->
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>下载地址：https://cdn.mysql.com/archives/mysql-5.7/mysql-5.7.20-linux-glibc2.12-x86_64.tar</strong></span>
<h2><span style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 12pt;"><strong><span style="color: #ff0000;"> 解压</span></strong></span>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"> tar xf mysql-5.7.20-linux-glibc2.12-x86_64.tar</span>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>  </strong></span>
<span style="font-family: tahoma, arial, helvetica, sans-serif; font-size: 12pt;"><strong><span style="color: #ff0000;"> 删除无用压缩包</span></strong></span>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"> rm -rf mysql-5.7.20-linux-glibc2.12-x86_64.tar</span>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"> rm -rf mysql-test-5.7.20-linux-glibc2.12-x86_64.tar.gz</span>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">  </span></h2>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>解压mysql</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">tar zxvf mysql-5.7.20-linux-glibc2.12-x86_64.tar.gz</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>创建安装目录</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">mkdir -p /server/tools/</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>将解压的mysql移动到安装目录</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">mv mysql-5.7.20-linux-glibc2.12-x86_64 /server/tools/mysql</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>添加环境变量，在文件末尾添加</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">vim /etc/profile</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">export PATH=/server/tools/mysql/bin:$PATH</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>使配置生效</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">source /etc/profile</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>创建mysql用户</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">useradd mysql -M -s /sbin/nologin</span>

&nbsp;
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>创建mysql数据存放目录</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">mkdir -p /data/mysql</span>

&nbsp;
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>设置目录权限</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">chown -R mysql.mysql /server/tools/mysql</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">chown -R mysql.mysql /data/mysql</span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>安装依赖包</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">yum install -y libaio-devel</span>

&nbsp;
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>删除mariadb</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">yum remove mariadb-libs</span>

<span style="font-size: 12pt;"><strong><span style="font-family: tahoma, arial, helvetica, sans-serif;">初始化数据（5.7以上版本）</span></strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">mysqld --initialize-insecure --user=mysql --basedir=/server/tools/mysql --datadir=/data/mysql</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">(5.7以下版本)/server/tools/mysql/scripts/mysql_install_db --user=mysql --basedir=/server/tools/mysql --datadir=/data/mysql</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>参数说明：</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>--initialize：开启安全策略</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>--initialize-insecure：关闭安全策略</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> 安全策略：</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> 1.密码长度:12位以上</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> 2.密码复杂度</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> 3.密码默认过期时间180天</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> 4.初始化后会生成一个临时密码</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>--user：指定mysql用户</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>--basedir：mysql安装目录</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong>--datadir：数据存放目录</strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>创建修改my.cnf配置文件</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">[root@db01 ~]# cat /etc/my.cnf </span>

&nbsp;

&nbsp;
<pre class="line-numbers" data-start="1"><code class="language-bash">[mysqld]
basedir=/application/mysql
datadir=/data/mysql
socket=/tmp/mysql.sock
server_id=1
port=3306

[mysql]
socket=/tmp/mysql.sock
prompt=master-[\\d]&gt;


[mysqld_safe]
log-error=/var/log/mysql.log</code></pre>
&nbsp;

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>添加启动脚本(centos6)</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">cp /server/tools/mysql/support-files/mysql.server /etc/init.d/mysqld</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">service mysqld start</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"> </span>
<h2><span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif; color: #ff0000;"><strong>使用systemd管理(centos7)</strong></span></h2>
<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">vi /etc/systemd/system/mysqld.service</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"> [Unit]</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">Description=MySQL Server</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">Documentation=man:mysqld(8)</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">After=network.target</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">After=syslog.target</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">[Install]</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">WantedBy=multi-user.target</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">[Service]</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">User=mysql</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">Group=mysql</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">ExecStart=/server/tools/mysql/bin/mysqld --defaults-file=/etc/my.cnf</span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;">LimitNOFILE = 5000 </span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>

<span style="font-size: 12pt; font-family: tahoma, arial, helvetica, sans-serif;"><strong> </strong></span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/266/  

