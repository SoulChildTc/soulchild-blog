# elasticsearch7.8.1集群安装并配置TLS+basicauth认证

<!--more-->
### 1.下载二进制包
```bash
wget -O /server/packages/elasticsearch-7.8.1-linux-x86_64.tar.gz https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.8.1-linux-x86_64.tar.gz
```

### 2.解压安装
```bash
tar xf elasticsearch-7.8.1-linux-x86_64.tar.gz -C /usr/local/
```

### 3.优化
vim /etc/sysctl.conf
```bash
fs.file-max=655360
vm.max_map_count = 262144
```
重新加载配置
`sysctl -p`

vim /etc/security/limits.conf
```bash
*        soft    nproc           20480
*        hard    nproc           20480
*        soft    nofile          65536
*        hard    nofile          65536
*        soft    memlock         unlimited
*        hard    memlock         unlimited
```

vim /etc/security/limits.d/20-nproc.conf
```bash
*          soft    nproc     40960
root       soft    nproc     unlimited
```

### 4.修改es配置
vim /usr/local/elasticsearch-7.8.1/config/elasticsearch.yml
```bash
cluster.name: elk-cluster
node.name: node-1
path.data: /data/es/
path.logs: /usr/local/elasticsearch-7.8.1/logs
bootstrap.memory_lock: true
network.host: 0.0.0.0
http.port: 9200
discovery.zen.minimum_master_nodes: 2
cluster.initial_master_nodes: ["172.17.10.161:9300"]
discovery.zen.ping.unicast.hosts: ["172.17.10.161:9300","172.17.10.162:9300","172.17.10.163:9300"]
xpack.security.enabled: true
# 集群节点间通信加密
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12

# 配置https加密
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: elastic-certificates.p12
xpack.security.http.ssl.truststore.path: elastic-certificates.p12
```

### 5.创建用户、es数据目录
```bash
useradd elasticsearch
chown -R elasticsearch.elasticsearch /usr/local/elasticsearch-7.8.1
mkdir /data/es -p
chown -R elasticsearch.elasticsearch /data/es
```

### 6.生成证书
```bash
cd /usr/local/elasticsearch-7.8.1
bin/elasticsearch-certutil ca
bin/elasticsearch-certutil cert --ca elastic-stack-ca.p12
# 修改权限
chown elasticsearch.elasticsearch elastic-*.p12
# 拷贝到配置文件目录
mv elastic-*.p12 config/
```

### 7.配置连接es的各个账户密码
```bash
bin/elasticsearch-setup-passwords interactive
```

### 8.简单启动脚本
vim /etc/init.d/es

```bash
#!/bin/bash
#chkconfig: 35 90 90 
ES_BIN=/usr/local/elasticsearch-7.8.1/bin/

function pid_is_exist(){
  ps -ef | grep [e]lasticsearch | grep -v x-pack-ml > /dev/null 2>&1
  return $?
}

function start(){
  w=`whoami`
  [[ $w == "elasticsearch" ]] && $ES_BIN/elasticsearch -d || su - elasticsearch -c "$ES_BIN/elasticsearch -d"
}

function stop(){
  pid_is_exist 
  if [[ $? != 0 ]]
  then
     echo "服务未启动"
     exit
  fi
  ps -ef | grep [e]lasticsearch | grep -v x-pack-ml | awk '{print $2}' | xargs kill
  pid_is_exist
  [[ $? == 0 ]] && echo 停止成功 || read -p 停止失败是否,强制停止: isforce
  [[ $isforce == "y" ]] && ps -ef | grep [e]lasticsearch | grep -v x-pack-ml | awk '{print $2}' | xargs kill -9 
}


case $1 in 
  start)
    start
  ;;

  stop)
    stop
  ;;

  restart)
    stop
    start
  ;;
  
  *)
    echo Usage: $0 "start|stop|restart"
  ;;

esac
```

添加服务开机启动
```bash
chkconfig --add es
```

### 9.启动服务
```bash
service es start
```


### 10.安装其他节点
- 修改第四步中的配置信息
- 第六步不需要重新生成，把之前生成的证书拷贝到新节点即可
- 第七步无需执行
- 其他步骤相同


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2423/  

