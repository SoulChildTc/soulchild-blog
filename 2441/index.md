# eureka-server单机部署

<!--more-->
### 1.[源码下载](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.3.12.RELEASE&packaging=jar&jvmVersion=1.8&groupId=cn.soulchild&artifactId=eureka-server&name=eureka-server&description=eureka%20server%20test&packageName=cn.soulchild.eureka-server&dependencies=cloud-eureka-server)


### 2.添加eureka注解
```bash
cd /server/packages/
unzip eureka-server.zip
cd eureka-server/src/main/java/cn/soulchild/eurekaserver/

sed -i '4iimport org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;' EurekaServerApplication.java

sed -i '6i@EnableEurekaServer' EurekaServerApplication.java
```

### 3.修改配置文件
```bash
cd /server/packages/eureka-server
cat > src/main/resources/application.yml <<EOF
server:
  port: 8761
eureka:
  # 服务端配置
  server:
    # enable-self-preservation: false  # 关闭自我保护机制
  # 客户端配置
  client:
    # 是否将自己注册到注册中心
    register-with-eureka: false
    # 是否从注册中心获取信息
    fetch-registry: false
  # 控制eureka页面显示内容
  environment: "dev"
  datacenter: "bj-yz"
EOF
```

### 4.打包
```bash
./mvnw clean package
```

### 5.运行
```bash
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2441/  

