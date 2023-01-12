# docker配置国内镜像加速和信任仓库

<!--more-->
中科大：https://docker.mirrors.ustc.edu.cn

网易：http://hub-mirror.c.163.com

官方：https://registry.docker-cn.com

&nbsp;

1.新版本：

vim /etc/docker/daemon.json
<pre>{
 "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}</pre>
2.老版本：每个配置项用空格分开

vim /etc/sysconfig/docker
<pre>DOCKER_OPTS="--registry-mirror=https://docker.mirrors.ustc.edu.cn"</pre>
&nbsp;

3配置仓库信任

新版：每个配置项用逗号分开

vim /etc/docker/daemon.json
<pre>{
"insecure-registries":["192.168.1.90"]
}</pre>
老版：每个配置项用空格分开

vim /etc/sysconfig/docker
<pre>DOCKER_OPTS="--insecure-registries 192.168.1.90"</pre>
&nbsp;

4.重启docker服务

systemctl reload docker


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/604/  

