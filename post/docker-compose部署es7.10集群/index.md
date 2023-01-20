# Docker Compose部署es7.10集群


<!--more-->

参考文档:

https://www.elastic.co/guide/en/elasticsearch/reference/7.10/docker.html



## 一、安装前准备

```bash
echo "vm.max_map_count=262144" >> /etc/sysctl.conf
sysctl -p
```

## 二、准备配置文件

### 1.docker-compose目录结构
```bash
# tree 
es-cluster/
├── conf
│   ├── es01.yml
│   ├── es02.yml
│   └── es03.yml
└── docker-compose.yml
```

### 2. es配置文件
```yml
cluster.name: lta-docker
node.master: true
node.data: true
node.ingest: true
node.name: es01
node.attr.box_type: hot
path.data: /usr/share/elasticsearch/data/
path.logs: /var/log/elasticsearch/
bootstrap.memory_lock: true
network.host: 0
# 如果你不是在1台机器上跑es集群，请用下面的配置指定当前节点的通信地址
#network.bind_host: 0
#network.publish_host: 宿主机IP
http.port: 9200
transport.port: 9300
discovery.seed_hosts:
  - es01
  - es02
  - es03
cluster.initial_master_nodes: 
  - es01
  - es02
  - es03

action.auto_create_index: *

xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.client_authentication: required
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
```
> 其他节点的配置文件可参考上面，只需要修改node.name即可。

### 3. 创建数据日志等目录
```bash
mkdir /data/es{01..03}/{data,logs,plugins}
chown 1000:0 -R /data/*
```

### 4. 生成节点间通信的证书
```bash
docker run -it --rm -v es-cluster/conf/:/certs docker.elastic.co/elasticsearch/elasticsearch:7.10.2 bash
elasticsearch-certutil ca --out /certs/elastic-stack-ca.p12
elasticsearch-certutil cert --ca /certs/elastic-stack-ca.p12 --out /certs/elastic-certificates.p12

chown 1000:0 -R es-cluster/conf/
```

## 三、compose文件
```yaml
version: '2.2'
x-es-defaults: &es_defaults
  image: docker.elastic.co/elasticsearch/elasticsearch:7.10.2
  deploy:
    resources:
      limits:
        cpus: '0.70'
        memory: 1024M
      reservations:
        cpus: '0.5'
        memory: 1024M
  ulimits:
    memlock:
      soft: -1
      hard: -1
  networks:
    - elastic
services:
  es01:
    <<: *es_defaults
    container_name: es01
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m -XX:+UseContainerSupport -XX:InitialRAMPercentage=80.0 -XX:MaxRAMPercentage=80.0"
      - "ELASTIC_PASSWORD=elastic"
    volumes:
      - ./conf/es01.yml:/usr/share/elasticsearch/config/elasticsearch.yml:ro
      - ./conf/elastic-certificates.p12:/usr/share/elasticsearch/config/elastic-certificates.p12
      - /data/es01/data/:/usr/share/elasticsearch/data/
      - /data/es01/logs/:/var/log/elasticsearch/
      - /data/es01/plugins/:/usr/share/elasticsearch/plugins/
    ports:
      - 9201:9200
      - 9301:9300
  es02:
    <<: *es_defaults
    container_name: es02
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m -XX:+UseContainerSupport -XX:InitialRAMPercentage=80.0 -XX:MaxRAMPercentage=80.0"
      - "ELASTIC_PASSWORD=elastic"
    volumes:
      - ./conf/es02.yml:/usr/share/elasticsearch/config/elasticsearch.yml:ro
      - ./conf/elastic-certificates.p12:/usr/share/elasticsearch/config/elastic-certificates.p12
      - /data/es02/data/:/usr/share/elasticsearch/data/
      - /data/es02/logs/:/var/log/elasticsearch/
      - /data/es02/plugins/:/usr/share/elasticsearch/plugins/
    ports:
      - 9202:9200
      - 9302:9300
  es03:
    <<: *es_defaults
    container_name: es03
    environment:
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m -XX:+UseContainerSupport -XX:InitialRAMPercentage=80.0 -XX:MaxRAMPercentage=80.0"
      - "ELASTIC_PASSWORD=elastic"
    volumes:
      - ./conf/es03.yml:/usr/share/elasticsearch/config/elasticsearch.yml:ro
      - ./conf/elastic-certificates.p12:/usr/share/elasticsearch/config/elastic-certificates.p12
      - /data/es03/data/:/usr/share/elasticsearch/data/
      - /data/es03/logs/:/var/log/elasticsearch/
      - /data/es03/plugins/:/usr/share/elasticsearch/plugins/
    ports:
      - 9203:9200
      - 9303:9300
  cerebro:
    container_name: cerebro
    image: lmenezes/cerebro:0.8.3
    ports:
      - 9000:9000
    networks:
      - elastic
networks:
  elastic:
    driver: bridge

```
> 注意 
> 
> 1. 默认es会自动在路径 /usr/share/elasticsearch/config/elasticsearch.keystore 上生成keystore文件，这里对其进行持久化，如果你需要的话，需要在每个节点中挂载
>
> 2. 日志默认输出到控制台，如果要输出到文件，需要修改log4j2.properties配置

## 四、启动服务
```bash
cd es-cluster/
docker compose up -d
```
在启动成功后，需要手动将配置文件中的`cluster.initial_master_nodes`删除或注释



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/docker-compose%E9%83%A8%E7%BD%B2es7.10%E9%9B%86%E7%BE%A4/  

