# Elasticsearch 6.8.9集群安装

<!--more-->
1.下载elasticsearch
```
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.8.9.tar.gz
```

2.解压
```
tar xf elasticsearch-6.8.9.tar.gz -C /usr/local/
cd /usr/local
mv elasticsearch-6.8.9/ elasticsearch
```

3.系统调优

3.1 修改/etc/sysctl.conf
```
fs.file-max=655360
vm.max_map_count = 262144
```
fs.file-max主要是配置系统最大打开文件描述符数，建议修改为655360或者更高。
vm.max_map_count影响Java线程数量，用于限制一个进程可以拥有的VMA(虚拟内存区域)的大小，系统默认是65530，建议修改成262144或者更高。

`sysctl -p` 使内核参数配置生效


3.2 修改/etc/security/limits.conf
```
*        soft    nproc           20480
*        hard    nproc           20480
*        soft    nofile          65536
*        hard    nofile          65536
*        soft    memlock         unlimited
*        hard    memlock         unlimited
```
修改/etc/security/limit.d/20-nproc.conf
```
*          soft    nproc     40960
root       soft    nproc     unlimited
```
退出终端,重新连接使配置生效


3.3 修改JVM参数

JVM调优主要是针对elasticsearch的JVM内存资源进行优化。

elasticsearch的内存资源配置文件为jvm.options。一般设置为服务器物理内存的一半最佳。

vim /usr/local/elasticsearch/config/jvm.options
```
-Xms4g
-Xmx4g
```


4.配置es集群

/usr/local/elasticsearch/config/elasticsearch.yml
```
#集群名称
cluster.name: elkdata
#当前节点名称
node.name: server1
#是否可以成为master节点
node.master: true
#是否为数据存储节点
node.data: true
#数据存储目录
path.data: /data1/elasticsearch,/data2/elasticsearch
#日志存储目录
path.logs: /usr/local/elasticsearch/logs
#锁定物理内存地址，防止es内存被交换出去，也就是避免es使用swap交换分区，频繁的交换，会导致IOPS变高。
bootstrap.memory_lock: true
#监听地址
network.host: 0.0.0.0
#监听端口
http.port: 9200
# es节点之间的tcp通信端口
transport.tcp.port: 9301
#设置集群中master节点的最小数量，不满足时es集群会报错。推荐设置为`master节点数量/2+1`(四舍五入)，可解决脑裂问题
discovery.zen.minimum_master_nodes: 2
#节点之间检测的超时时间
discovery.zen.ping_timeout: 3s
#指定集群中所有节点的地址，一般只写可以成为master的
discovery.zen.ping.unicast.hosts: ["192.168.0.9:9300","192.168.0.10:9300","192.168.0.11:9300"]
#解决使用head时的跨域问题
#http.cors.allow-origin: "*"
#http.cors.enabled: true
```
discovery.zen.minimum_master_nodes参数的更详细说明以及脑裂说明：https://www.cnblogs.com/zhukunrong/p/5224558.html



5.启动集群

5.1 创建启动用户、授权
```
useradd elasticsearch
chown -R elasticsearch.elasticsearch /usr/local/elasticsearch/
```
5.2 创建数据目录
```
mkdir /data{1..2}/elasticsearch -p
chown -R elasticsearch.elasticsearch /data{1..2}
```
5.3 启动
`su -s /bin/bash elasticsearch -c "/usr/local/elasticsearch/bin/elasticsearch -d"`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1646/  

