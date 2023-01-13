# php编译扩展

<!--more-->
cd /server/packages/php-5.6.40/ext/gettext

/server/packages/php-5.6.40/ext/gettext

/application/php/bin/phpize

./configure --with-php-config=/application/php5.6.40/bin/php-config

make &amp;&amp; make install

&nbsp;

在;Dynamic Extensions部分下面添加模块

vim /application/php/etc/php.ini
extension=gettext.so

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1399/  

