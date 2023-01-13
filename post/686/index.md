# 给harbor私有仓库配置https

<!--more-->
自签名证书：

https://www.cnblogs.com/Rcsec/p/8479728.html

进入到harbor目录操作：

1.编辑harbor.yml修改以下部分,https部分需要取消注释
<pre class="line-numbers" data-start="1"><code class="language-bash">hostname: soulchild.cn
# https related config
https:
#   # https port for harbor, default is 443
  port: 443
#   # The path of cert and key files for nginx
  certificate: /data/cert/myharbor.cert
  private_key: /data/cert/myharbor.key</code></pre>
2.添加hosts解析

echo "10.0.0.11   soulchild.cn" &gt;&gt; /etc/hosts

&nbsp;

3.配置证书文件
<pre>#上传证书至此文件夹
mkdir /data/cert/

#两个文件
ls /data/cert/
myharbor.crt myharbor.key</pre>
&nbsp;

4.生成配置文件
<pre><code>./prepare</code></pre>
&nbsp;

5.停止harbor
<pre><code>docker-compose down -v</code></pre>
# 可以提前执行，太慢了。

&nbsp;

6.开启harbor
<pre><code>docker-compose up -d</code></pre>
&nbsp;

7.测试
<pre>#正常登陆
docker login soulchild.cn

#pull镜像也没有问题
docker pull soulchild.cn/soulchild/busybox:1.18</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/686/  

