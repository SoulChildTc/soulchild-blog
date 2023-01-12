# vsftpd本地用户(系统用户)模式(二)

<!--more-->
## 本地用户
用户名密码：使用的是操作系统的系统账号密码
默认目录：用户家目录

## 创建用户
```
useradd -s /sbin/nologin -d /data/ftp/test_u1 test_u1
echo "123" | passwd --stdin test_u1
```

# 相关参数
```
# 启用本地用户
local_enable=YES

# 创建文件(夹)的默认权限
local_umask=022

# 本地用户的根目录
local_root=/var/ftp



#######################################################################
# 将所有用户禁锢在主目录,防止切换到系统根目录
chroot_local_user=YES

# 启用后可以指定一个文件(chroot_list_file参数)，文件中的用户会被禁锢在主目录。
# 当chroot_local_user=YES时,文件中的用户不会被禁锢在主目录
chroot_list_enable=YES

# 用户列表文件(配合chroot_list_enable=YES使用)
chroot_list_file=/etc/vsftpd/chroot_list

# 被限制的用户，在家目录操作时被报500,添加如下参数即可
allow_writeable_chroot=YES
#######################################################################


# 限制速度,单位byte。1048576byte=1M
local_max_rate=1048576

# 欢迎语
ftpd_banner="hello"


#######################################################################
# 启用会使userlist_file生效，实现的效果取决于userlist_deny的配置。
userlist_enable=YES

# 默认值是YES,拒绝userlist_file中的用户登录。NO代表只允许userlist_file中的用户登录
userlist_deny=YES

# 用户列表文件(配合userlist_enable=YES使用)
userlist_file=/etc/vsftpd.user_list

# /etc/vsftpd/ftpusers这个文件里的用户是拒绝登录的，优先级最高
#######################################################################

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2130/  

