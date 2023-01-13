# docker volume挂载数据卷,实现数据持久化

<!--more-->
查看当前卷
```docker volume ls```
创建一个卷
```docker volume create web_data```
删除一个卷
```docker volume rm web_data```
查看这个卷的详细信息
```docker volume inspect web_data```

<br>

命令行参数
```
-v 宿主机目录或卷名称:容器目录
```
示例
```docker run -d -p80:80 -v web_data:/usr/share/nginx/html nginx```

注意：

-v参数使用的是卷名时：
当web_data的挂载点中没有文件时，会自动将容器目录中的内容同步到web_data的挂载点。
当web_data的挂载点中有文件时，会自动将web_data的挂载点的内容同步到容器目录中。

-v参数使用的是目录时：
容器内的内容会被清空


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/611/  

