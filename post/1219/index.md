# php5.6.40编译安装

<!--more-->
```bash
wget https://www.php.net/distributions/php-5.6.40.tar.gz

tar xf php-5.6.40.tar.gz

cd php-5.6.40/

yum install -y openssl-devel libxml2 libxml2-devel bzip2 bzip2-devel  libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel mcrypt libmcrypt libmcrypt-devel

./configure --prefix=/application/php5.6.40 --enable-fpm --enable-mysqlnd --with-mysql=/application/mysql --with-pdo-mysql=/application/mysql --with-mysqli=/application/mysql/bin/mysql_config --with-libxml-dir --with-gd --with-jpeg-dir --with-png-dir --with-freetype-dir --with-iconv-dir --with-zlib-dir --with-bz2 --with-openssl --with-mcrypt --enable-soap --enable-mbstring --enable-sockets --enable-exif --with-config-file-path=/application/php5.6.40/etc/

make && make install

ln -s /application/php5.6.40/ /application/php

cp php.ini-production /application/php5.6.40/etc/php.ini

cp sapi/fpm/php-fpm.service /etc/systemd/system/php-fpm.service

sed -i 's#${prefix}#/application/php#' /etc/systemd/system/php-fpm.service
sed -i 's#${exec_prefix}#/application/php#' /etc/systemd/system/php-fpm.service

mv /application/php5.6.40/etc/php-fpm.conf{.default,}

#修改php-fpm用户
vim /application/php5.6.40/etc/php-fpm.conf

systemctl start php-fpm
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1219/  

