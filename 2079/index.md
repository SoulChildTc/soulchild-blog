# docker-compose编排

<!--more-->
# 官方文档
https://docs.docker.com/compose/compose-file


## 编排文件版本和docker引擎版本对应关系
```
版本    docker版本
3.8	19.03.0+
3.7	18.06.0+
3.6	18.02.0+
3.5	17.12.0+
3.4	17.09.0+
3.3	17.06.0+
3.2	17.04.0+
3.1	1.13.1+
3.0	1.13.0+
2.4	17.12.0+
2.3	17.06.0+
2.2	1.13.0+
2.1	1.12.0+
2.0	1.10.0+
1.0	1.9.1.+
```

## v3配置说明
```yaml
version: "3.8"
services:  # 定义服务
  redis:  # 服务名(自定义)
    image: redis:alpine  # 服务镜像
    ports: # 定义服务所用端口和映射
      - "6379"
    networks: # 定义要使用的网络
      - frontend  # 在下面的networks中定义的

  db: # 服务名(自定义)
    image: postgres:9.4 # 服务镜像
    volumes: # 定义持久化卷
      - db-data:/var/lib/postgresql/data  # 使用db-data这个卷，在下面的volumes中定义的。将容器的/var/lib/postgresql/data目录持久化到db-data这个卷中
    environment:  # 设置环境变量
      RACK_ENV: development  # 第一种写法
      - RACK_ENV2=development  # 第二种写法

  web: # 服务名(自定义)
    build: ./nginx  # 指定构建镜像上下文。然后运行。 nginx目录内容为Dockerfile
    ports:  # 映射端口
      - "8000:80"  # 宿主机端口:容器端口
    restart: always  # 重启策略。默认on,可选always,on-failure,unless-stopped
    container_name: nginx-web  # 容器名称
    labels: # 设置标签元数据
      web: true  # 第一种写法
      - "web=true"  # 第一种写法

  vote: # 服务名(自定义)
    image: dockersamples/examplevotingapp_vote:before
    ports:
      - "5000:80"  # 宿主机端口:容器端口
    networks:
      - frontend
    depends_on:  # 依赖启动
      - redis  # 等待redis服务启动后,再启动本服务

  result: # 服务名(自定义)
    image: dockersamples/examplevotingapp_result:before
    ports:
      - "5001:80"  # 宿主机端口:容器端口
    networks:
      - backend
    depends_on:  # 依赖启动
      - db  # 等待db服务启动后,再启动本服务
    

  visualizer:
    image: dockersamples/visualizer:stable
    ports:
      - "8080:8080"
    stop_grace_period: 1m30s  # 默认情况下向容器发送SIGTERM信号(kill -15),10秒内没有停止成功就会发送SIGKILL信号(kill -9)
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"  # 将宿主机的/var/run/docker.sock文件挂载到容器的/var/run/docker.sock


networks: 
  frontend: # 创建网络
  backend: # 创建网络

volumes: 
  db-data: # 创建volume

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2079/  

