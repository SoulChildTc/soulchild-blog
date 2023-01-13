# yum安装docker

<!--more-->
docker-ce: docker社区版

docker-ee: docker企业版

&nbsp;

1.配置docker-ce  yum源
<pre>curl -o /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</pre>
&nbsp;

2.安装docker-ce
<pre>yum install -y docker-ce</pre>
&nbsp;

3.设置开机自启并启动docker
<pre>systemctl enable docker
systemctl start docker</pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/597/  

