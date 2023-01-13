# mysqld_exporter部署

<!--more-->
#### 1.下载安装：
```bash
wget https://github.91chifun.workers.dev//https://github.com/prometheus/mysqld_exporter/releases/download/v0.12.1/mysqld_exporter-0.12.1.linux-amd64.tar.gz
tar xf mysqld_exporter-0.12.1.linux-amd64.tar.gz
mv mysqld_exporter-0.12.1.linux-amd64/mysqld_exporter /usr/local/bin/mysqld_exporter
```

#### 2.创建监控用户：
```sql
CREATE USER 'exporter'@'localhost' IDENTIFIED BY '123456' WITH MAX_USER_CONNECTIONS 3;
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'localhost';
```

#### 3.制作启动服务：

vim /usr/lib/systemd/system/mysqld_exporter.service
```bash
[Unit]
Description=mysqld_exporter
Documentation=https://github.com/prometheus/mysqld_exporter
After=network.target

[Service]
Type=simple
User=mysql
Environment=DATA_SOURCE_NAME=exporter:123456@(localhost:3306)/
ExecStart=/usr/local/bin/mysqld_exporter --web.listen-address=0.0.0.0:9104 \
  --log.level=error \
  --collect.info_schema.innodb_metrics \
  --collect.info_schema.innodb_tablespaces \
  --collect.info_schema.innodb_cmp \
  --collect.info_schema.innodb_cmpmem
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

#### 4.启动服务：
```bash
systemctl start mysqld_exporter
systemctl enable mysqld_exporter
```

#### 5.测试metrics
```bash
curl localhost:9104/metrics
```

#### 6.配置prometheus
```yaml
    scrape_configs:
      - job_name: mysqld_exporter
        static_configs:
        - targets: ['10.0.0.73:9104']
```










---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1936/  

