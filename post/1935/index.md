# node_exporter部署

<!--more-->

下载安装node_exporter：

```bash
wget https://github.91chifun.workers.dev//https://github.com/prometheus/node_exporter/releases/download/v1.0.1/node_exporter-1.0.1.linux-amd64.tar.gz
tar xf node_exporter-1.0.1.linux-amd64.tar.gz
cd node_exporter-1.0.1.linux-amd64/
mv node_exporter  /usr/local/bin/
```

添加启动用户：

```bash
useradd prometheus
```

配置启动服务：
vim /usr/lib/systemd/system/node_exporter.service

```bash
[Unit]
Description=node_export
Documentation=https://github.com/prometheus/node_exporter
After=network.target

[Service]
Type=simple
User=prometheus
ExecStart=/usr/local/bin/node_exporter \
          --collector.tcpstat \
          --collector.systemd
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

启动：

```bash
systemctl start node_exporter.service
systemctl enable node_exporter.service
```

添加prometheus配置：

```yaml
      - job_name: database_node_exporter
        static_configs:
        - targets: ['10.0.0.72:9100','10.0.0.73:9100']

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1935/  

