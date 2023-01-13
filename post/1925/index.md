# 制作一个yum源

<!--more-->
#### 1.准备本地仓库：
```bash
mkdir devtools
yum groupinstall "Development tools" --downloadonly --downloaddir=./dev/tools
yum install -y createrepo
cd devtools
createrepo ./
```

#### 2.配置nginx：
```bash
server{
   server_name  _;
   listen      8;
   root /var/www/devtools;
   autoindex      on;
}
```


#### 找一台机器配置测试一下：

配置yum源
vim /etc/yum.repos.d/devtools.repo
```bash
[base]
name=CentOS-$releasever - Base
baseurl=http://192.168.56.223/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
```

安装测试
```yum install -y unzip```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1925/  

