# prometheus-二进制部署

<!--more-->
### 1.解压
```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.15.0/prometheus-2.15.0.linux-amd64.tar.gz
tar xf prometheus-2.15.0.linux-amd64.tar.gz
mv prometheus-2.15.0.linux-amd64/prometheus /usr/local/bin
mv prometheus-2.15.0.linux-amd64/promtool /usr/local/bin
```

### 2.启动
```bash
mkdir -p /etc/prometheus
cp prometheus-2.15.0.linux-amd64/prometheus.yml /etc/prometheus
prometheus --config.file="/etc/prometheus/prometheus.yml"
```

参数说明：
```bash
# 指定配置文件
--config.file="/etc/prometheus/prometheus.yml"

# 监听地址和端口
--web.listen-address="0.0.0.0:9090" 

# 如果使用反向代理访问prometheus的话，这里配置反向代理的地址
--web.external-url="http://xxx.com"

# 开启后可以使用http请求的方式来动态重新加载配置文件
--web.enable-lifecycle

# 开启后可以使用api来管理prometheus数据
--web.enable-admin-api

# 下面两个选项可以添加prometheus控制台自定义模板页面  
--web.console.templates="consoles" 
--web.console.libraries="console_libraries"

# 指定指标数据的存储路径
--storage.tsdb.path="data/"

# 数据保留时间(y, w, d, h, m, s, ms)
 --storage.tsdb.retention=7d

# 最多能使用的磁盘空间大小(KB, MB, GB, TB, PB)
--storage.tsdb.retention.size=1GB

# 不创建锁文件，在k8s中以deployment运行的时候，可以加上这个参数，防止异常退出无法启动
--storage.tsdb.no-lockfile

# 压缩wal文件
--storage.tsdb.wal-compression

# 关闭或重新加载prometheus配置时等待刷写数据的时间
--storage.remote.flush-deadline=

# 日志级别(debug, info, warn, error)
--log.level=info

# 日志格式(logfmt, json)
--log.format=logfmt
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1962/  

