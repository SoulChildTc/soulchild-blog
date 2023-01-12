# vsftpd安装和匿名模式(一)

<!--more-->
## 一、安装启动
vsftp: server端
ftp: 客户端
```
yum install -y vsftpd ftp
systemctl enable vsftpd
systemctl start vsftpd
```
默认目录: `/var/ftp/`

## 二、匿名模式
匿名用户: `ftp`或`anonymous`
密码为空
工作目录: `/var/ftp/`
默认权限: 可下载不可上传

## 三、相关参数参数
```
# 启用匿名用户
anonymous_enable=YES

# 允许匿名用户上传文件
anon_upload_enable=YES

# 允许匿名用户创建目录,必须对父目录有写权限才能创建
anon_mkdir_write_enable=YES

# 允许匿名用户执行除上传和创建目录之外的写操作，例如删除和重命名。
anon_other_write_enable=YES

# 匿名用户登录不询问密码
no_anon_password=YES

# 匿名用户的最大传输速度限制,单位byte。1048576Byte=1MB
# anon_max_rate=1048576

# 文件(夹)创建的默认权限。
文件夹777-022=755，默认权限就是drwxr-xr-x
文件666-022=644，默认权限就是-rw-r--r--
anon_umask=022

# 匿名用户的根目录
anon_root=/var/ftp/
```
> 更多参数：http://vsftpd.beasts.org/vsftpd_conf.html



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2129/  

