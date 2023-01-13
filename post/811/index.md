# gitlab发送邮件测试

<!--more-->
<pre class="line-numbers" data-start="1"><code class="language-bash">vim /etc/gitlab/gitlab.rb
#52行左右
gitlab_rails['gitlab_email_enabled'] = true
gitlab_rails['gitlab_email_from'] = '你的邮箱'
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
gitlab_rails['smtp_tls'] = true</code></pre>
<pre>#进入控制台（需要多等一会）
gitlab-rails console

irb(main):001:0&gt; Notify.test_email('xxxx@qq.com', 'Message Subject', 'Message Body').deliver_now</pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/811/  

