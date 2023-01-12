# 安装并使用maven编译java项目

<!--more-->
maven二进制包下载地址：

http://mirror.bit.edu.cn/apache/maven/maven-3/3.6.1/binaries/apache-maven-3.6.1-bin.tar.gz

&nbsp;

解压安装：

*安装前需要先安装oracle jdk
<pre class="line-numbers" data-start="1"><code class="language-bash">tar xf apache-maven-3.6.1-bin.tar.gz -C /application/
ln -s /application/apache-maven-3.6.1/ /application/maven
echo 'PATH=$PATH:/application/maven/bin' &gt;&gt; /etc/profile
source /etc/profile</code></pre>
&nbsp;

下载jeesns
<pre class="line-numbers" data-start="1"><code class="language-bash">git clone https://gitee.com/zchuanzhao/jeesns.git</code></pre>
编译jeesns为war包,<a href="https://www.soulchild.cn/488.html" target="_blank" rel="noopener">maven加速请参考</a>
<pre class="line-numbers" data-start="1"><code class="language-bash">cd jeesns</code></pre>
按照官网说明先执行：
<pre class="line-numbers" data-start="1"><code class="language-bash">mvn install:install-file -Dfile=./jeesns-core/jeesns-core.jar -DgroupId=com.lxinet -DartifactId=jeesns-core -Dversion=1.4.2 -Dpackaging=jar
mvn clean package</code></pre>
&nbsp;

编译成功后会生成在下面的位置：

jeesns/jeesns-web/target/jeesns-web.war

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/484/  

