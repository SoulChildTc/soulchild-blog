# elasticsearch开启basicauth认证

<!--more-->
## 配置文件
```yaml
cluster.name: test
xpack.security.enabled: true
discovery.type: single-node
node.name: node1
path.data: /data/
path.logs: /usr/local/es/logs
bootstrap.memory_lock: true
network.host: 0.0.0.0
http.port: 9200
```

## 启动服务
```bash
/usr/local/es/bin/elasticsearch -d
```

## 设置密码
```bash
/usr/local/es/bin/elasticsearch-setup-passwords interactive
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1990/  

