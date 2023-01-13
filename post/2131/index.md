# vsftpd虚拟用户配置(三)

<!--more-->
## 一、建立用户数据文件
vim /etc/vsftpd/vsftpd.user
```
user1
123
user2
123
user3
123
user4
123
user5
123
```
> 格式: 一行用户一行密码

转换为db文件
```
db_load -T -t hash -f /etc/vsftpd/vsftpd.user /etc/vsftpd/vsftpd.db
chmod 400 /etc/vsftpd/vsftpd.db # 设置只读权限
```

## 二、创建ftp映射用户和数据存放目录
```
mkdir /data/ftp -p
useradd -s /sbin/nologin -d /data/ftp/ ftp_user
chown -R ftp_user:ftp_user /data/ftp
```

## 三、建立pam认证文件
vim /etc/pam.d/vsftpd.pam
```
auth       required    pam_userdb.so   db=/etc/vsftpd/vsftpd
account    required    pam_userdb.so   db=/etc/vsftpd/vsftpd
```

## 四、创建用户配置目录
`mkdir /etc/vsftpd/users/`

## 五、修改参数
```
# 允许在家目录下操作
allow_writeable_chroot=YES

# vsftpd使用的PAM服务的名称
pam_service_name=vsftpd.pam

# 将所有非匿名用户归类为访客登录,将访客重新映射到guest_username参数指定的用户
guest_enable=YES

# 映射的用户
guest_username=ftp_user

# 用户的配置目录
#如果您将user_config_dir设置为/etc/vsftpd/users/，然后以用户"chris"的身份登录，那么vsftpd将在会话期间应用/etc/vsftpd/users/chris文件中的设置。
user_config_dir=/etc/vsftpd/users/
```
> 默认情况下虚拟用户使用的是匿名用户权限,需要注意配置冲突的问题。最好在主配置文件中最小化配置，将虚拟用户的配置单独配置到user_config_dir指定的目录中
> 可以通过`virtual_use_local_privs`参数修改虚拟用户使用本地用户权限


## 六、创建虚拟用户
`vim /etc/vsftpd/users/user1`
> 注意用户名和vsftpd.user的一致

```
# 允许上传
anon_upload_enable=YES
# 默认权限，755和644
anon_umask=022
```

#### 客户端测试
```
# 上传下载和文件权限没问题
[soulchild@MBP test111]$ lftp 10.0.0.13 -u user1,123
lftp user1@10.0.0.13:~> !ls
aaa     fun1    fun2    fun3    num4.sh
lftp user1@10.0.0.13:~> put fun1
20 bytes transferred                    
lftp user1@10.0.0.13:/> ls
-rw-r--r--    1 1003     1003           20 Dec 23 10:11 fun1
lftp user1@10.0.0.13:/> get fun1 -o fun1-remote
20 bytes transferred
lftp user1@10.0.0.13:/> !ls 
aaa         fun1        fun1-remote fun2        fun3        num4.sh


# 创建文件夹会失败
lftp user1@10.0.0.13:/> mkdir my_user1
mkdir: Access failed: 550 Permission denied. (my_user1)
```

#### 创建另一个用户
vim /etc/vsftpd/users/user1
```
# 允许创建文件夹
anon_mkdir_write_enable=YES
```
#### 客户端测试
```
# 可以创建文件夹
lftp user2@10.0.0.13:/> ls
-rw-r--r--    1 1003     1003           20 Dec 23 10:11 fun1
lftp user2@10.0.0.13:/> mkdir test
mkdir ok, `test' created
lftp user2@10.0.0.13:/> ls
-rw-r--r--    1 1003     1003           20 Dec 23 10:11 fun1
drwx------    2 1003     1003            6 Dec 23 10:17 test
# 不允许上传
lftp user2@10.0.0.13:/> put fun3
put: Access failed: 550 Permission denied. (fun3)
```


其他参数：
```
# 允许匿名用户上传文件
anon_upload_enable=YES

# 允许匿名用户创建目录,必须对父目录有写权限才能创建
anon_mkdir_write_enable=YES

# 允许匿名用户执行除上传和创建目录之外的写操作，例如删除和重命名。
anon_other_write_enable=YES

# 匿名用户的最大传输速度限制,单位byte。1048576Byte=1MB
# anon_max_rate=1048576

# 文件(夹)创建的默认权限。
文件夹777-022=755，默认权限就是drwxr-xr-x
文件666-022=644，默认权限就是-rw-r--r--
anon_umask=022

# 匿名用户的根目录
anon_root=/var/ftp/

# 用户变量，当前登录用户赋值给$USER(主配置文件配置)
user_sub_token=$USER
# 如果想每个用户到自己的目录,可以做如下配置
local_root=/data/ftp/$USER
```

> 更多参数：http://vsftpd.beasts.org/vsftpd_conf.html








---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2131/  

