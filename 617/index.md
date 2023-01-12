# dockerfile指令详解

<!--more-->
dockerfile指令：

&nbsp;

<span style="color: #ff0000;"><strong>FROM</strong></span>：指定基础镜像
<pre>#语法示例
FROM centos
FROM centos:6.9

#不加tag标签，默认是latest</pre>
<strong><span style="color: #ff0000;">MAINTAINER</span></strong>:(可选)维护者信息
<pre>#语法示例
MAINTAINER my name is soulchild.</pre>
<span style="color: #ff0000;"><strong>LABLE</strong></span>：(可选)标签、描述信息，可以写成多个LABLE，建议只写一个，可以使用\符号
<pre>#语法示例
LABEL version="1.1" \ 
    description="this is example"</pre>
<span style="color: #ff0000;"><strong>RUN</strong></span>：构建镜像时执行的命令，每一个RUN都会生成一层镜像，可以使用&amp;&amp;和\来解决多层臃肿的问题。
<pre>#语法示例
RUN yum install -y openssh-server &amp;&amp; \
    service sshd start &amp;&amp; \
    echo '123456' | passwd root --stdin</pre>
<span style="color: #ff0000;"><strong>ADD</strong></span>：将文件复制到镜像中，如果文件格式是tar包，会自动解压，还可以访问网络资源
<pre>#语法示例
ADD /root/test.tar.gz /opt/
ADD http://xxx.xxx.com/download/xx.zip /opt</pre>
<span style="color: #ff0000;"><strong>COPY</strong></span>：将文件复制到镜像中
<pre>#语法示例
COPY /root/kod.conf   /etc/nginx/conf.d/kod.conf</pre>
<span style="color: #ff0000;"><strong>ENV</strong></span>：设置环境变量
<pre>#语法示例
#1.一次只能设置一个
ENV a 123
#2.一次可以设置多个，支持\换行
ENV b=456 c=789

#运行容器时需要指定-e参数</pre>
<span style="color: #ff0000;"><strong>WORKDIR</strong></span>：切换工作目录，相当于cd
<pre>#语法示例
WORKDIR /opt</pre>
<span style="color: #ff0000;"><strong>EXPOSE</strong></span>：端口映射
<pre>#语法示例
EXPOSE 80 443
EXPOSE 22/tcp  23/udp

#需要在容器运行时指定-P参数，才会将宿主机随机端口映射到容器发布的端口</pre>
<span style="color: #ff0000;"><strong>VOLUME</strong></span>：设置卷，挂载目录
<pre>#语法示例
VOLUME /usr/share/nginx/html

#启动容器时会自动生成一个卷，可以通过docker volume [command],查看卷的详细信息</pre>
<span style="color: #ff0000;"><strong>CMD</strong></span>：容器启动后的初始命令，此参数只能出现一次。如果在运行容器时指定运行命令了，此参数无效，会被替换掉。
<pre>#格式：
CMD ["命令","参数1","参数2"]

#语法示例
CMD ["/usr/sbin/sshd","-D"]</pre>
<span style="color: #ff0000;"><strong>ENTRYPOINT</strong></span>：启动容器时如果手动指定了一个命令，会被追加到最后当作参数而执行，
<pre>#格式：
ENTRYPOINT ["命令","参数1","参数2"]

#语法示例
ENTRYPOINT ["/bin/bash","init.sh"]

#容器运行
docker run -d entrypoint:test hello
实际上运行的初始命令是/bin/bash init.sh hello</pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/617/  

