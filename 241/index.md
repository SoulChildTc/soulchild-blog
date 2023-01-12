# nginx  auth_basic简易登录认证

<!--more-->
安装htpasswd工具

yum install  httpd-tools -y

&nbsp;

生成密码文件
htpasswd -bc /application/nginx/conf/htpasswd 用户名 密码

chown www.www /application/nginx/conf/htpasswd

chmod 400 /application/nginx/conf/htpasswd

#参数：

-b:非交互

-c:创建新文件

&nbsp;

打开nginx或虚拟主机配置文件，在需要认证的页面中添加标红内容：

#################################################

location /status/ {

stub_status;
<span style="color: #e53333;">        auth_basic "</span><span style="color: #e53333;">describe</span><span style="color: #e53333;">";</span>
<span style="color: #e53333;">        auth_basic_user_file /application/nginx/conf/conf.d/htpasswd;</span>

}

#################################################

说明：

auth_basic:网站描述

auth_basic_user_file:指定密码文件路径

&nbsp;

# 重启服务

nginx -s reload


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/241/  

