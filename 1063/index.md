# 使用xtrabackup报错Can't locate DigestMD5.pm in 。。。。。。。BEGIN failed--compilation aborted at - line 693.

<!--more-->
报错：

Can't locate Digest/MD5.pm in @INC (@INC contains: /usr/local/lib64/perl5 /usr/local/share/perl5 /usr/lib64/perl5/vendor_perl /usr/share/perl5/vendor_perl /usr/lib64/perl5 /usr/share/perl5 .) at - line 693. BEGIN failed--compilation aborted at - line 693.

&nbsp;

解决方法：

安装perl-Digest-MD5

yum -y install perl-Digest-MD5


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1063/  

