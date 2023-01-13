# docker升级新版本yum方式

<!--more-->
1.删除旧版本
<pre>yum remove docker
yum remove docker-common</pre>
2.安装docker源
<pre>curl -o /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</pre>
&nbsp;

3.安装新版本
<pre>yum install -y docker-ce</pre>
&nbsp;

4.配置文件变成了daemon.json.rpmsave,修改配置文件名称

mv /etc/docker/daemon.json{.rpmsave,}

&nbsp;

5.启动服务
<pre>systemctl start docker
systemctl enable docker</pre>
&nbsp;

安装完后旧版本的容器还在。

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/678/  

