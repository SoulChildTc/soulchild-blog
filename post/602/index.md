# docker常用命令和参数说明

<!--more-->
### 查询镜像
```
docker search nginx
```

### 拉取镜像
```
docker pull nginx:1.17.1
```


### 查询本地镜像
```
#查询所有镜像
docker images 
#查询所有镜像，包含中间层
docker images -a
#查询指定镜像
docker images nginx
```

### 删除镜像
```
docker image rm nginx:1.17.1
```

### 导入、导出(通过load、save)
```
#导入镜像,-i:指定镜像文件
docker image load -i docker_nginx1.17.1.tar.gz
#导出镜像,-o:输出的文件名称路径
docker image save -o docker_nginx1.17.1.tar.gz nginx:1.17.1
#导出镜像,重定向方式
docker image save nginx:1.17.1 > docker_nginx1.17.1.tar.gz
```

### 导入、导出(通过export、import)
和上面的类似，但是通过export可以直接导出容器，但需要使用import导入
```
#导入镜像,-i:指定镜像文件
docker import docker_nginx1.17.1.tar.gz nginx:1.17.1
#导出容器为镜像,-o:输出的文件名称路径
docker export -o docker_nginx.tar.gz 容器ID
```

### 创建并运行容器
-i : 保持打开stdin
-t : 分配一个TTY终端
通常-it一起使用

-d : 后台运行，并显示容器ID
-p 主机端口:容器端口
-p IP:主机端口:容器端口(分配一个IP做映射 )
-p IP::容器端口(随机端口)
-p 主机端口:容器端口:udp
-p  IP::53:udp（分配一个IP，随机的端口映射到容器53端口，使用udp）
-p 81:80 –p 443:443 可以指定多个-p
-P：随机端口映射，可以和dockerfile中的EXPOSE配合使用

--name：指定容器名称
-h：指定容器主机名
-v：将本地目录挂载到容器中,实现数据持久化
```docker run -d -p80:80 --name web -v /opt/www:/usr/share/nginx/html nginx:latest```


### 查看容器
-a：查看所有容器，默认不显示已退出的容器
-q：只显示容器ID
-l：查看最近一次创建的容器
--no-trunc：显示完整信息
```
docker ps -a
```

### 进入容器
```
#独立终端连接容器
docker exec -it 容器ID或名字 /bin/bash

#需要已经运行bash环境，使用同一个终端，终端的内容会同步进行。可以通过ctrl + p，ctrl + q退出。
docker attach 容器ID或名字
```

删除容器
```docker rm 容器ID或名字```

批量删除容器

-f:强制删除
```docker rm $(docker ps -a -q)```

宿主机和容器之间的文件复制
```docker cp nostalgic_goldberg:/etc/nginx/conf.d/default.conf /opt/```




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/602/  

