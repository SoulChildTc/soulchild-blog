# redis_exporter部署配置多实例

<!--more-->
#### 1.下载源码：
```bash
git clone https://github.com.cnpmjs.org/oliver006/redis_exporter.git
cd redis_exporter
git checkout v1.6.1
vim exporter.go
注释第92行的u.User = nil

# 本地没有go环境，使用docker编译
docker run -it --env=GOPROXY=https://goproxy.cn,direct --workdir=/redis_exporter -v /server/packages/redis_exporter/:/redis_exporter golang:1.15 go build .

mv redis_exporter /usr/local/bin/
```

#### 2.制作启动服务：

vim /usr/lib/systemd/system/redis_exporter.service
```bash
[Unit]
Description=redis_exporter
Documentation=https://github.com/prometheus/redis_exporter
After=network.target

[Service]
Type=simple
User=prometheus
ExecStart=/usr/local/bin/redis_exporter
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

#### 4.启动服务：
```bash
systemctl start mysqld_exporter
systemctl enable mysqld_exporter
```

#### 5.配置prometheus，多实例监控(可以使用文件自动发现)
手动测试：localhost:9121/scrape?target=redis://h:123123@127.0.0.1:6380
```yaml
    scrape_configs:
      - job_name: 'redis_exporter'
        static_configs:
          - targets:
            - redis://h:redis@10.0.0.10:6379
            - redis://h:123123@10.0.0.10:6380
            - redis://h:123456@10.0.0.10:6381
            - redis://h:@10.0.0.10:6382
        metrics_path: /scrape
        relabel_configs:
          - source_labels: [__address__]
            target_label: __param_target
          - source_labels: [__param_target]
            separator: ;
            regex: redis://h.*@(.*):(\d+)
            target_label: instance
            replacement: ${1}:${2}
            action: replace
          - target_label: __address__
            replacement: 10.0.0.73:9121  #redis_exporter的地址端口
```










---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1943/  

