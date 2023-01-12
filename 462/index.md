# Centos6 搭建smokeping

<!--more-->
安装前准备

1）关闭iptables以及selinux

2）时间同步

cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

ntpdate ntp1.aliyun.com

&nbsp;

下载地址：

fping:

wget http://fping.org/dist/fping-3.10.tar.gz

echoping:

wget https://fossies.org/linux/misc/old/echoping-6.0.2.tar.gz

smokeping:

wget http://pkgs.fedoraproject.org/repo/pkgs/smokeping/smokeping-2.6.9.tar.gz/0c2361b734866dd37facf2af3f8f7144/smokeping-2.6.9.tar.gz

&nbsp;

1、安装依赖包：
<pre class="pure-highlightjs"><code class="bash">yum install -y vim wget perl perl-Net-Telnet perl-Net-DNS perl-LDAP perl-libwww-perl perl-IO-Socket-SSL perl-Socket6 perl-Time-HiRes perl-ExtUtils-MakeMaker rrdtool rrdtool-perl curl httpd httpd-devel gcc make wget libxml2-devel libpng-devel glib pango pango-devel freetype freetype-devel fontconfig cairo cairo-devel libart_lgpl libart_lgpl-devel popt popt-devel libidn libidn-devel screen</code></pre>
&nbsp;

2、解压、编译安装fping
<pre class="line-numbers" data-start="1"><code class="language-bash">tar xf fping-3.10.tar.gz
cd fping-3.10
./configure
make &amp;&amp; make install
cd ~</code></pre>
&nbsp;

3、解压、编译安装echoping
<pre class="line-numbers" data-start="1"><code class="language-bash">tar xf echoping-6.0.2.tar.gz
cd echoping-6.0.2
./configure
make &amp;&amp; make install
cd ~</code></pre>
&nbsp;

4、解压、编译安装smokeping
<pre class="line-numbers" data-start="1"><code class="language-bash">tar xf smokeping-2.6.9.tar.gz
cd smokeping-2.6.9
./setup/build-perl-modules.sh /usr/local/smokeping/thirdparty #如果有failed需要多敲几遍此命令，以保证完全安装
./configure --prefix=/usr/local/smokeping
/usr/bin/gmake install</code></pre>
&nbsp;

5、配置 smokeping
<pre class="line-numbers" data-start="1"><code class="language-bash">mkdir /usr/local/smokeping/htdocs/cache 
mkdir /usr/local/smokeping/data
mkdir /usr/local/smokeping/var
touch /var/log/smokeping.log
chown apache:apache /usr/local/smokeping/htdocs/cache 
chown apache:apache /usr/local/smokeping/data 
chown apache:apache /usr/local/smokeping/var
chown apache:apache /var/log/smokeping.log
chmod 600 /usr/local/smokeping/etc/smokeping_secrets.dist
cd /usr/local/smokeping/htdocs
cp smokeping.fcgi.dist smokeping.fcgi
cd /usr/local/smokeping/etc
cp config.dist config</code></pre>
&nbsp;

6、更改配置文件

vim /usr/local/smokeping/etc/config

主要修改如下内容：

cgiurl = http://127.0.0.1/smokeping.cgi

imgcache = /usr/local/smokeping/htdocs/cache

*** Database ***

#step = 300

step = 60 #此处建议改为 60 ， 一分钟采集一次数据

pings = 20

108行的fping路径修改为

binary = /usr/local/sbin/fping

&nbsp;

7、编辑apache配置文件

vim /etc/httpd/conf/httpd.conf

在DocumentRoot "/var/www/html" 这一行(在292行左右)之下添加如下内容：
<pre class="line-numbers" data-start="1"><code class="language-bash">Alias /cache "/usr/local/smokeping/htdocs/cache"
Alias /cropper "/usr/local/smokeping/htdocs/cropper"
Alias /smokeping "/usr/local/smokeping/htdocs"
&lt;Directory "/usr/local/smokeping/htdocs"&gt;
AllowOverride None
AddHandler cgi-script .fcgi .cgi
Options ExecCGI
&lt;IfModule dir_module&gt;
DirectoryIndex smokeping.fcgi
&lt;/IfModule&gt;
Order allow,deny
Allow from all
&lt;/Directory&gt;</code></pre>
&nbsp;

8、图像浏览界面的中文支持

安装字体

yum -y install wqy-zenhei-fonts.noarch

编辑smokeping的配置文件

vim /usr/local/smokeping/etc/config

第49行添加

charset = utf-8 #添加此行

&nbsp;

9、在Web页面增加验证用户名和密码

vim /etc/httpd/conf/httpd.conf

在&lt;Directory "/usr/local/smokeping/htdocs"&gt;下增加以下内容
<pre class="line-numbers" data-start="1"><code class="language-bash">AuthName "Smokeping"
AuthType Basic
AuthUserFile /usr/local/smokeping/htdocs/htpasswd
Require valid-user</code></pre>
&nbsp;

设置账号密码

htpasswd -c /usr/local/smokeping/htdocs/htpasswd admin

&nbsp;

10、添加监控节点

vim /usr/local/smokeping/etc/config
<h6>############################################################</h6>
+dianxin                  #一级菜单

menu = 中国电信     #一级菜单显示名称

title = 中国电信        #页面内标题

++beijingdianxin      # 节点名称（非中文）

menu = 北京电信      # 左侧选项显示名称

title = 北京市电信 202.97.0.1                 # 节点页面顶部显示名称

host = 202.97.0.1        #主机IP
<h6>######################################################</h6>
&nbsp;

11、编写启动脚本

vim /etc/init.d/smokeping
############################################################
<pre class="pure-highlightjs"><code class="bash">#!/bin/bash
#
# chkconfig: 2345 80 05
# Description: Smokeping init.d script
# Write by : linux-Leon_xiedi
# Get function from functions library
. /etc/init.d/functions
# Start the service Smokeping
function start() {
echo -n "Starting Smokeping: "
/usr/local/smokeping/bin/smokeping &gt;/dev/null 2&gt;&amp;1
### Create the lock file ###
                touch /var/lock/subsys/smokeping
success $"Smokeping startup"
echo
}
# Restart the service Smokeping
function stop() {
echo -n "Stopping Smokeping: "
kill -9 `ps ax |grep "/usr/local/smokeping/bin/smokeping" |
grep -v grep | awk '{ print $1 }'` &gt;/dev/null 2&gt;&amp;1
### Now, delete the lock file ###
rm -f /var/lock/subsys/smokeping
success $"Smokeping shutdown"
echo
}
#Show status about Smokeping
function status() {
NUM="`ps -ef|grep smokeping|grep -v grep|wc -l`"
if [ "$NUM" == "0" ];then
echo "Smokeping is not run"
else
echo "Smokeping is running"
fi
}
### main logic ###
case "$1" in
start)
        start
        ;;
stop)
        stop
        ;;
status)
        status
        ;;
restart|reload)
        stop
        start
        ;;
*)
        echo $"Usage: $0
        {start|stop|restart|reload|status}"
        exit 1
esac

exit 0</code></pre>
###########################################################

chmod +x /etc/init.d/smokeping

service httpd restart

service smokeping restart

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/462/  

