# ElasticSearch 5.5.1小版本升级到5.5.3

<!--more-->
### 1.禁用分片自动分配
```bash
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "none"
  }
}
```

### 2.执行同步刷新
可以提升恢复速度https://www.kancloud.cn/apachecn/elasticsearch-doc-zh/1945139
```bash
POST _flush/synced
```

### 3.关闭所有节点的es或者一台一台升级都可以

### 4.升级
```bash
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.3.rpm
rpm -U elasticsearch-5.5.3.rpm
```

### 5.升级插件 - 如果需要的话

### 6.启动节点
如果配置了master和node，需要优先启动master
```bash
systemctl start elasticsearch
```

### 7.观察集群状态
可以看到集群处于黄色状态,这是因为副本分片没有被分配
```bash
GET _cat/health

GET _cat/nodes
```

### 8.重新启用分片自动分配
```bash
PUT _cluster/settings
{
  "persistent": {
    "cluster.routing.allocation.enable": "all"
  }
}
```

### 9.等待恢复完成
```bash
# 查看集群健康状态
GET _cat/health

# 查看恢复进度
GET _cat/recovery
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2814/  

