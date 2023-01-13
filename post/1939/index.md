# mongodb_exporter部署

<!--more-->

#### 1.下载安装：
```bash
wget https://github.91chifun.workers.dev//https://github.com/percona/mongodb_exporter/releases/download/v0.11.1/mongodb_exporter-0.11.1.linux-amd64.tar.gz
mkdir mongodb_exporter
tar xf mongodb_exporter-0.11.1.linux-amd64.tar.gz -C mongodb_exporter
mv mongodb_exporter/mongodb_exporter /usr/local/bin/
```

#### 2.创建mongodb监控用户
```bash
db.getSiblingDB("admin").createUser({
    user: "mongodb_exporter",
    pwd: "123456",
    roles: [
        { role: "clusterMonitor", db: "admin" },
        { role: "read", db: "local" }
    ]
})
```

#### 3.设置启动服务
vim /usr/lib/systemd/system/mongodb_exporter.service
```bash
[Unit]
Description=mongodb_exporter
Documentation=https://github.com/percona/mongodb_exporter
After=network.target

[Service]
Type=simple
User=prometheus
Environment="MONGODB_URI=mongodb://mongodb_exporter:123456@localhost:27017"
ExecStart=/usr/local/bin/mongodb_exporter --log.level=error \
  --collect.database \
  --collect.collection \
  --collect.topmetrics \
  --collect.indexusage \
  --collect.connpoolstats

Restart=on-failure

[Install]
WantedBy=multi-user.target
```

#### 4.配置prometheus
```bash
      - job_name: mongodb_exporter
        static_configs:
        - targets: ['10.0.0.72:9216']
```









---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1939/  

