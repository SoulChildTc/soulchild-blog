# gitlab安装和汉化的两种方式

<!--more-->
<span style="font-size: 14pt; color: #ff0000;"><strong>一、安装gitlab</strong></span>

1.安装gitlab依赖
<pre>yum install -y curl policycoreutils-python openssh-server</pre>
2.下载gitlab，rpm包

自选版本：https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/
<pre>#下载12.0.3版本(汉化包也是12.0.3，两个要一样)
wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-12.0.3-ce.0.el7.x86_64.rpm
#安装gitlab
rpm -ivh gitlab-ce-12.0.3-ce.0.el7.x86_64.rpm</pre>
3.修改配置文件
<pre>vim /etc/gitlab/gitlab.rb
external_url修改为你的ip或域名</pre>
4.配置邮箱
<pre>vim /etc/gitlab/gitlab.rb
#52行左右
gitlab_rails['gitlab_email_enabled'] = true
gitlab_rails['gitlab_email_from'] = '742899387@qq.com'
gitlab_rails['gitlab_email_display_name'] = 'soulchild-gitlab'

#517行左右
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "你的邮箱"
gitlab_rails['smtp_password'] = "授权码"
gitlab_rails['smtp_domain'] = "qq.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true</pre>
&nbsp;

5.重新生成配置文件并启动服务
<pre>gitlab-ctl reconfigure
gitlab-ctl status</pre>
6.打开地址就可以访问了

&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>二、汉化（两种方式）</strong></span>

<span style="font-size: 12pt;"><strong><span style="color: #ff6600;">覆盖文件方式：</span></strong></span>

1.下载解压汉化包（12-0-stable-zh的部分可以改成你的版本号）

下载地址：https://gitlab.com/xhang/gitlab/tree/12-0-stable-zh
<pre>tar xf gitlab-12-0-stable-zh.tar.gz</pre>
2.覆盖文件进行汉化(<span style="color: #ff0000;">*汉化包和你的gitlab版本一定要一样</span>)
<pre>#备份原文件
cp -rp /opt/gitlab/embedded/service/gitlab-rails{,.bak_$(date +%F)}
#将汉化包覆盖过去(\也需要敲)
\cp -rf ./* /opt/gitlab/embedded/service/gitlab-rails
gitlab-ctl reconfigure
gitlab-ctl start</pre>
3.启动相关组件服务
<pre>gitlab-ctl start
#汉化后可能会出现502，需要多等一会就行了</pre>
4.汉化后到gitlab偏好设置中设置为简体中文就完美了。

&nbsp;

<span style="font-size: 12pt; color: #ff6600;"><strong>打补丁的方式：</strong></span>

1.clone补丁文件
<pre>git clone https://gitlab.com/xhang/gitlab.git</pre>
2.生成补丁文件
<pre>cd gitlab

#查看gitlab版本号
gitlab_version=$(sudo cat /opt/gitlab/embedded/service/gitlab-rails/VERSION) &amp;&amp; echo $gitlab_version

#查看汉化包版本号（<span style="color: #ff0000;">*一定要保证和gitlab的版本号一致</span>）
cat VERSION

#导出 patch 用的 diff 文件
git diff v${gitlab_version} v${gitlab_version}-zh &gt; ../${gitlab_version}-zh.diff</pre>
3.导入汉化补丁
<pre>gitlab-ctl stop
cd ../
#可能会提示让你输入文件路径，一路回车就行了。
patch -d /opt/gitlab/embedded/service/gitlab-rails -p1 &lt; ${gitlab_version}-zh.diff</pre>
4.重新加载配置，启动服务
<pre>gitlab-ctl reconfigure
gitlab-ctl restart</pre>
&nbsp;

<img src="images/143ed035cf4cfe48c1642a93a792126c.png "143ed035cf4cfe48c1642a93a792126c"" />


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/729/  

