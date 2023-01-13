# docker私有仓库harbor1.8.1安装部署

<!--more-->
docker版本要求：17.06.0 或更高

docker-compose版本要求：version 1.18.0或更高

&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>在线安装：</strong></span>

下载地址：https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-online-installer-v1.8.1.tgz
<pre>wget https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-online-installer-v1.8.1.tgz
tar xf harbor-online-installer-v1.8.1.tgz
cd harbor

#修改主机名和管理员密码、数据库密码
vim harbor.yml
hostname: 10.0.0.11
harbor_admin_password: 123456
database:
    password: 123456

#安装
./install.sh
#接下来就是漫长的等待</pre>
&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>离线安装：</strong></span>

下载地址：https://storage.googleapis.com/harbor-releases/release-1.8.0/harbor-offline-installer-v1.8.1.tgz

&nbsp;
<pre>tar xf harbor-offline-installer-v1.8.1.tgz
cd harbor

#主要修改三个地方，也可以根据自己需求修改egrep -v '^$|#' harbor.yml
vim harbor.yml
hostname: 10.0.0.12
harbor_admin_password: 123456
database:
    password: 123456

#安装 ./install.sh</pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/675/  

