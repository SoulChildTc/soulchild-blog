# jeesns部署

<!--more-->
下载jeesns：
<pre class="line-numbers" data-start="1"><code class="language-bash">git clone https://gitee.com/zchuanzhao/jeesns.git
cd jeesns</code></pre>
创建数据库：

mysql -uroot -p
<pre class="line-numbers" data-start="1"><code class="language-bash">create database jeesns character set utf8 collate utf8_general_ci;
grant all on jeesns.* to jeesns@localhost identified by '123456';</code></pre>
导入数据库
<pre class="line-numbers" data-start="1"><code class="language-bash">mysql -ujeesns -p123456 jeesns &lt; ./jeesns-web/database/jeesns.sql</code></pre>
&nbsp;

修改jeesns数据库配置信息：

vim ./jeesns-web/src/main/resources/jeesns.properties

修改如下三项内容：数据库地址、用户名、密码

jdbc.url

jdbc.user

jdbc.password

&nbsp;

编译生成war包：
<pre class="line-numbers" data-start="1"><code class="language-bash">mvn install:install-file -Dfile=./jeesns-core/jeesns-core.jar -DgroupId=com.lxinet -DartifactId=jeesns-core -Dversion=1.4 -Dpackaging=jar
mvn clean package</code></pre>
&nbsp;

部署war包到tomcat：

cp ./jeesns-web/target/jeesns-web.war /application/tomcat/webapps/jeesns.war

&nbsp;

重启tomcat

/application/tomcat/bin/shutdown.sh

/application/tomcat/bin/startup.sh


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/493/  

