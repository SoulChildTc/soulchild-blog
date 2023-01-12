# php7.2编译安装

<!--more-->
## 1.安装依赖包

```bash
yum -y install php-mcrypt libmcrypt libmcrypt-devel  autoconf  freetype freetype-devel gd libmcrypt libpng libpng-devel openjpeg openjpeg-devel  libjpeg libjpeg-devel  libxml2 libxml2-devel zlib curl curl-devel 
```

## 2. 编译安装

```bash
tar xf php-7.2.3.tar.gz
cd php-7.2.3/

./configure --prefix=/usr/local/php7  \
--with-apxs2=/usr/local/apache2/bin/apxs \
--with-config-file-path=/usr/local/php7/etc/  \
 --enable-mbstring  \
--with-curl  \
--enable-fpm  \
--enable-mysqlnd  \
--enable-bcmath   \
--enable-sockets   \
--enable-ctype   \
--with-jpeg-dir   \
--with-png-dir   \
--with-freetype-dir  \
--with-gettext   \
--with-gd  \
--with-pdo-mysql=mysqlnd \
--with-mysqli=mysqlnd

make && make install
```

## 3. 生成配置文件

```bash
cp php.ini-development  /usr/local/php7/etc/php.ini
```
 

## 4. 修改apache配置，使apache支持php

```bash
vim /usr/local/apache2/

#配置支持解析php，配置文件末尾添加即可
Addtype application/x-httpd-php .php .phtml

#添加index.php首页文件，修改现有配置
DirectoryIndex index.html index.php
```


## 如果需要php-fpm：
vim /etc/systemd/system/php-fpm.service
```bash
# It's not recommended to modify this file in-place, because it
# will be overwritten during upgrades.  If you want to customize,
# the best way is to use the "systemctl edit" command.

[Unit]
Description=The PHP FastCGI Process Manager
After=network.target

[Service]
Type=simple
PIDFile=/usr/local/php7/var/run/php-fpm.pid
ExecStart=/usr/local/php7/sbin/php-fpm --nodaemonize --fpm-config /usr/local/php7/etc/php-fpm.conf
ExecReload=/bin/kill -USR2 $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/890/  

