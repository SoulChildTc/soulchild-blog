# Centos7升级openssl


<!--more-->

备忘

```bash
wget https://www.openssl.org/source/openssl-1.1.1.tar.gz
tar zxvf openssl-1.1.1.tar.gz
cd openssl-1.1.1
./config --prefix=/usr/local/openssl
make && make install 

sudo mv /usr/bin/openssl /usr/bin/openssl.old
sudo ln -s /usr/local/openssl/bin/openssl /usr/bin/openssl

echo "/usr/local/openssl/lib" | sudo tee -a /etc/ld.so.conf
sudo ldconfig

openssl version
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/724896344/  
> 转载 URL: https://blog.csdn.net/weixin_43824520/article/details/138282562
