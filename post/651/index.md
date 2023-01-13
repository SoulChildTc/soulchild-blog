# docker-compose安装和常用命令并部署zabbix示例

<!--more-->
1.安装docker-compose,

方法1. 在epel源中直接yum安装
<pre>yum install -y docker-compose</pre>
方法2.使用pip安装
<pre>yum -y install python-pip
pip install docker-compose</pre>
&nbsp;

2.创建工作目录,编写docker-compose文件
<pre>mkdir /opt/myzabbix
vim /opt/myzabbix/docker-compose.yaml</pre>
&nbsp;

yaml文件内容
<pre class="line-numbers" data-start="1"><code class="language-bash">version: '3'
services:
   mysql-server:
     image: mysql:5.7
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: root_pwd
       MYSQL_DATABASE: zabbix
       MYSQL_USER: zabbix
       MYSQL_PASSWORD: zabbix_pwd
     command: --character-set-server=utf8
	 
   zabbix-java-gateway:
     image: zabbix/zabbix-java-gateway:latest
     restart: always
	 
   zabbix-server:
     depends_on:
       - mysql-server
     image: zabbix/zabbix-server-mysql:latest
     restart: always
     environment:
       DB_SERVER_HOST: mysql-server
       MYSQL_DATABASE: zabbix
       MYSQL_USER: zabbix
       MYSQL_PASSWORD: zabbix_pwd
       MYSQL_ROOT_PASSWORD: root_pwd
       ZBX_JAVAGATEWAY: zabbix-java-gateway
     ports:
       - "10051:10051"	
	   
   zabbix-web-nginx-mysql:
     depends_on:
       - zabbix-server
     image: zabbix/zabbix-web-nginx-mysql:latest
     ports:
       - "80:80"
     restart: always
     environment:
       DB_SERVER_HOST: mysql-server
       MYSQL_DATABASE: zabbix
       MYSQL_USER: zabbix
       MYSQL_PASSWORD: zabbix_pwd
       MYSQL_ROOT_PASSWORD: root_pwd</code></pre>
&nbsp;

3.运行
<pre>cd /opt/myzabbix
#创建并运行容器
docker-compose up</pre>
&nbsp;

&nbsp;

&nbsp;

=======================================================================

其他docker-compose命令,需要在docker-compose.yaml文件同一目录下执行：

常用选项参数：
<pre>-d：后台运行
-f：指定文件，默认是 docker-compose.yml
-p：项目名称
--verbose：显示详细过程信息</pre>
更多参数可以使用docker-composer -h查看

常用命令：
<pre>#构建并后台启动nignx容器
docker-compose up -d nginx

#设置要为某个服务运行的容器数
docker-compose scale zabbix-web-nginx-mysql=3

#登录到指定容器中
docker-compose exec mysql-server bash            

#停止项目中所有容器
docker-compose stop
#停止项目中指定容器
docker-compose stop mysql-server]

#开启项目中所有容器
docker-compose start
#开启项目中指定容器
docker-compose start mysql-server

#重启项目中所有容器
docker-compose restart
#重启指定容器
docker-compose restart mysql-server

暂停容器
docker-compose pause mysql-server
恢复容器
docker-compose unpause mysql-server

#停止并删除所有容器和镜像
docker-compose down                              

#显示所有容器
docker-compose ps                                   

#不依赖 启动容器，运行后删除容器
docker-compose run --no-deps --rm mysql-server   

#构建镜像
docker-compose build mysql-server
 
查看指定容器的日志 
docker-compose logs  mysql-server                     

查看指定容器的实时日志
docker-compose logs -f mysql-server                   

#检查配置文件，没问题没有输出，有问题输出错误内容
docker-compose config  -q
                  
以json的形式输出nginx的docker日志
docker-compose events --json nginx

        
                       


</pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/651/  

