# centos-yum快速部署lamp相关

<!--more-->
centos6：
<pre class="line-numbers" data-start="1"><code class="language-bash">yum install -y httpd httpd-devel mysql-devel  mysql-server mysql php php-mysql gd php-gd gd-devel php-xml php-common php-mbstring php-ldap php-pear php-xmlrpc php-imap</code></pre>
<pre class="line-numbers" data-start="1"><code class="language-bash">service httpd start
service mysqld start
mysqladmin -u root password xxxxx</code></pre>
&nbsp;

centos7：
<pre class="line-numbers" data-start="1"><code class="language-bash">yum install -y httpd httpd-devel php php-mysql gd php-gd gd-devel php-xml php-common php-mbstring php-ldap php-pear php-xmlrpc php-imap mariadb mariadb-devel mariadb-server</code></pre>
<pre class="line-numbers" data-start="1"><code class="language-bash">systemctl enable httpd
systemctl start httpd
systemctl enable mariadb
systemctl start mariadb
mysqladmin -u root password xxxxx</code></pre>
&nbsp;

&nbsp;

安装php7
<pre class="line-numbers" data-start="1"><code class="language-bash">rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm</code></pre>
<pre class="line-numbers" data-start="1"><code class="language-bash">yum -y install php71w php71w-cli php71w-common php71w-devel php71w-embedded php71w-gd php71w-mcrypt php71w-mbstring php71w-pdo php71w-xml php71w-fpm php71w-mysqlnd php71w-opcache php71w-pecl-memcached php71w-pecl-redis php71w-pecl-mongodb</code></pre>
&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/737/  

