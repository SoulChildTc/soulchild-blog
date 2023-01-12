# blackbox_exporter部署

<!--more-->
#### 1.下载安装
```bash
wget https://github.91chifun.workers.dev//https://github.com/prometheus/blackbox_exporter/releases/download/v0.17.0/blackbox_exporter-0.17.0.linux-amd64.tar.gz
tar xf blackbox_exporter-0.17.0.linux-amd64.tar.gz
mv blackbox_exporter-0.17.0.linux-amd64/blackbox_exporter /usr/local/bin/
mkdir /etc/blackbox_exporter
mv blackbox_exporter-0.17.0.linux-amd64/blackbox.yml /etc/blackbox_exporter/
```

#### 2.添加启动用户：
```bash
useradd prometheus
chown -R prometheus.prometheus /etc/blackbox_exporter/
```

#### 3.修改配置文件
su prometheus
vim /etc/blackbox_exporter/blackbox.yml
```yaml
modules:
  http_2xx:
    prober: http
  http_post_2xx:
    prober: http
    http:
      method: POST
  tcp_connect:
    prober: tcp
  pop3s_banner:
    prober: tcp
    tcp:
      query_response:
      - expect: "^+OK"
      tls: true
      tls_config:
        insecure_skip_verify: false
  ssh_banner:
    prober: tcp
    tcp:
      query_response:
      - expect: "^SSH-2.0-"
  irc_banner:
    prober: tcp
    tcp:
      query_response:
      - send: "NICK prober"
      - send: "USER prober prober prober :prober"
      - expect: "PING :([^ ]+)"
        send: "PONG ${1}"
      - expect: "^:[^ ]+ 001"
  icmp:
    prober: icmp
  example: # 这个是自定义的module名称
    prober: http # 探测的协议，支持http, dns, tcp, icmp, grpc
    timeout: 5s # 探测超时
    http: {} # http协议相关参数
```
> 配置参数文档 https://github.com/prometheus/blackbox_exporter/blob/master/CONFIGURATION.md

#### 4.配置启动服务：
vim /usr/lib/systemd/system/blackbox_exporter.service

```bash
[Unit]
Description=blackbox_exporter
Documentation=https://github.com/prometheus/blackbox_exporter
After=network.target
 
[Service]
Type=simple
User=prometheus
ExecStart=/usr/local/bin/blackbox_exporter \
  --config.file=/etc/blackbox_exporter/blackbox.yml --history.limit=100
Restart=on-failure
[Install]
WantedBy=multi-user.target
```

#### 5.启动
```bash
systemctl start blackbox_exporter.service
systemctl enable blackbox_exporter.service
```

#### 6.配置prometheus
我们获取metrics的方式为如下url：
http://localhost:9115/probe?target=xxx.com&module=http_2xx

其中xxx.com是目标地址，module是配置文件中配置的探测模板,我们的目标地址不是一个，所以我们使用文件自动发现加relabel`__param_target`标签的值的方式来进行配置

```bash
      - job_name: 'blackbox_exporter'
        metrics_path: /probe
        params:
          module: [http_2xx]
        file_sd_configs:
          - refresh_interval: 10s
            files:
            - blackbox.json
        relabel_configs:
          - source_labels: [__address__]
            target_label: __param_target
          - source_labels: [__param_target]
            target_label: instance
          - target_label: __address__
            replacement: 192.168.0.200:9115    # blackbox_exporter的地址和端口
```

blackbox.json配置
```json
[{
		"targets": ["http://s1.soulchild.cn"],
		"labels": {
			"project": "soulchild",
			"env": "prod",
			"service": "jpress"
		}
	},
	{
		"targets": ["http://s2.soulchild.cn"],
		"labels": {
			"project": "soulchild",
			"env": "prod",
			"service": "app"
		}
	},
	{
		"targets": ["http://1.1.1.1:3221"],
		"labels": {
			"project": "soulchild",
			"env": "prod",
			"service": "server"
		}
	},
	{
		"targets": ["https://soulchild.cn"],
		"labels": {
			"project": "soulchild",
			"env": "prod",
			"service": "blog"
		}
	}
]
```








---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1942/  

