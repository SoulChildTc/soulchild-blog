# centos7-yum安装nginx

<!--more-->
<strong><span style="color: #e53333; font-size: 14px;">配置官方源</span></strong>

vim /etc/yum.repos.d/nginx.repo

[nginx-stable]

name=nginx stable repo

baseurl=http://nginx.org/packages/centos/$releasever/$basearch/

gpgcheck=1

enabled=1

gpgkey=https://nginx.org/keys/nginx_signing.key

<strong><span style="color: #e53333; font-size: 14px;">安装</span></strong>

yum install -y nginx

<strong><span style="color: #e53333; font-size: 14px;">查询配置文件等</span></strong><strong><span style="color: #e53333; font-size: 14px;">目</span></strong><strong><span style="color: #e53333; font-size: 14px;">录</span></strong>

rpm -ql nginx


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/247/  

