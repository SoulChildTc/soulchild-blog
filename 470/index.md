# Centos 7 安装JDK1.8，Tomcat8

<!--more-->
软件包准备：

apache-tomcat-8.0.27.tar.gz

jdk-8u102-linux-x64.rpm

&nbsp;

<span style="color: #ff0000;"><strong>rpm方式安装jdk</strong></span>

rpm -ivh jdk-8u102-linux-x64.rpm

&nbsp;

<span style="color: #ff0000;"><strong>二进制方式安jdk</strong></span>

tar xf jdk-8u191-linux-x64.tar.gz

mv jdk1.8.0_191 /usr/local/

ln -sv /usr/local/jdk1.8.0_191 /usr/local/jdk

#设置环境变量

vim /etc/profile

export JAVA_HOME=/usr/local/jdk

export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar

export PATH=$JAVA_HOME/bin:$PATH

&nbsp;

&nbsp;

安装tomcat8

tar xf apache-tomcat-8.0.27.tar.gz -C /application/

ln -s /application/apache-tomcat-8.0.27/ /application/tomcat

&nbsp;

启动tomcat

/application/tomcat/bin/startup.sh

&nbsp;

tomcat目录结构

&nbsp;
<pre class="line-numbers" data-start="1"><code class="language-bash">[root@tomcat ~]# cd /application/tomcat/
[root@tomcat tomcat]# tree -L 1
.
├── bin #→用以启动、关闭Tomcat或者其它功能的脚本（.bat文件和.sh文件）
├── conf #→用以配置Tomcat的XML及DTD文件
├── lib #→存放web应用能访问的JAR包
├── LICENSE
├── logs #→Catalina和其它Web应用程序的日志文件
├── NOTICE
├── RELEASE-NOTES
├── RUNNING.txt
├── temp #→临时文件
├── webapps #→Web应用程序根目录
└── work #→用以产生有JSP编译出的Servlet的.java和.class文件
7 directories, 4 files

[root@tomcat tomcat]# cd webapps/
[root@tomcat webapps]# ll
total 20
drwxr-xr-x 14 root root 4096 Oct 5 12:09 docs #→tomcat帮助文档
drwxr-xr-x 6 root root 4096 Oct 5 12:09 examples #→web应用实例
drwxr-xr-x 5 root root 4096 Oct 5 12:09 host-manager #→管理
drwxr-xr-x 5 root root 4096 Oct 5 12:09 manager #→管理
drwxr-xr-x 3 root root 4096 Oct 5 12:09 ROOT #→默认网站根目录</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/470/  

