# docker 部署私有仓库registry设置认证和一些常用仓库操作

<!--more-->
<span style="color: #333399;"><strong>1.生成认证文件</strong></span>
<pre>yum install -y httpd-tools
mkdir -p /data/registry_auth/
htpasswd -Bbn test testpass &gt;&gt; /data/registry_auth/htpasswd</pre>
<strong><span style="color: #333399;">2.从官方pull镜像</span></strong>
<pre>docker pull registry</pre>
<strong><span style="color: #333399;">3.运行容器</span></strong>

--restart=always：重启docker，自动启动容器

--name=registry：设置容器名称

-v /data/myregistry:/var/lib/registry：将容器的/var/lib/registry目录挂载到本地的/data/myregistry

-v /data/registry_auth/:/auth/：认证文件所在目录
<pre>docker run -d \
-p5000:5000 \
--restart=always \
--name=registry \
-v /data/myregistry/:/var/lib/registry \
-v /data/registry_auth/:/auth/ \
-e "REGISTRY_AUTH=htpasswd" \
-e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
-e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
registry</pre>
下面是无认证的
<pre class="line-numbers" data-start="1"><code class="language-bash">docker run -d \
-p5000:5000 \
--restart=always \
--name=registry \
-v /data/myregistry/:/var/lib/registry \
registry</code></pre>
&nbsp;

<span style="color: #333399;"><strong>4.登陆仓库</strong></span>
<pre>docker login 10.0.0.11:5000</pre>
&nbsp;

<span style="color: #333399;"><strong>5.上传镜像到私有仓库</strong></span>

1）打标签指定仓库地址
<pre>docker tag nginx:latest 10.0.0.11:5000/nginx:latest</pre>
2) 上传镜像
<pre>docker push 10.0.0.11:5000/nginx:latest</pre>
上传之前需要先在/etc/docker/daemon.json中添加如下内容，添加完后重启docker

"insecure-registries":["10.0.0.11:5000"]

&nbsp;

<span style="color: #333399;"><strong>6.下载镜像</strong></span>
<pre>docker pull 10.0.0.11:5000/nginx:latest</pre>
&nbsp;

<span style="color: #333399;"><strong>7.查看仓库中的镜像</strong></span>

#os查看镜像

ls /data/myregistry/docker/registry/v2/repositories/

#os查看标签

ls /data/myregistry/docker/registry/v2/repositories/镜像名称/_manifests/tags/

#http查看镜像

http://10.0.0.11:5000/v2/_catalog

#http查看标签

http://10.0.0.11:5000/v2/镜像名称/tags/list

&nbsp;

<strong><span style="color: #333399;">8.删除仓库中的镜像</span></strong>

1）删除nginx镜像目录
<pre>rm -fr /data/myregistry/docker/registry/v2/repositories/nginx/</pre>
2）垃圾回收
<pre>docker exec -it registry registry garbage-collect /etc/docker/registry/config.yml</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/642/  

