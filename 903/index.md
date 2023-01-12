# apache2.4.39编译安装

<!--more-->
### 1. 安装依赖包

yum安装依赖

```bash
yum -y install make gcc-c++ cmake bison-devel  ncurses-devel  libtool  bison perl perl-devel  perl perl-devel zlib zlib-devel 
```



### 2. 编译安装

```bash
编译安装apr：
yum install -y bzip2
tar xf apr-1.6.3.tar.bz2
cd apr-1.6.3
./configure --prefix=/usr/local/apr
make && make install

编译安装apr-util：
yum install -y expat expat-devel
tar xf apr-util-1.6.1.tar.gz
cd apr-util-1.6.1
./configure  --prefix=/usr/local/apr-util --with-apr=/usr/local/apr
make && make install

编译安装pcre：
tar xf pcre-8.41.tar.gz
cd pcre-8.41
./configure --prefix=/usr/local/pcre
make && make install

编译安装apache：
tar xf httpd-2.4.39.tar.gz
cd httpd-2.4.39
./configure  --prefix=/usr/local/apache2 \
--with-pcre=/usr/local/pcre  \
--with-apr=/usr/local/apr  \
--with-apr-util=/usr/local/apr-util  \
--enable-so  \
--enable-modules=most  \
--enable-mods-shared=all   \
--enable-rewrite=shared

make && make install

```



### 3.管理apache2

```bash
#创建软连接方便使用
ln -s /usr/local/apache2/bin/apachectl /sbin/

#启动apache
apachectl start

#停止
apachectl stop

#重启
apachectl restart

#优雅重启
apachectl graceful

#优雅停止
apachectl graceful-stop
```







---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/903/  

