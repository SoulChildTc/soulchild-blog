# Docker配置拉取镜像的代理


<!--more-->

总忘, 备忘一下

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d

cat >> /etc/systemd/system/docker.service.d/http-proxy.conf <<EOF
[Service]
Environment="HTTP_PROXY=http://proxy.example.com:3128"
Environment="HTTPS_PROXY=https://proxy.example.com:3129"
Environment="NO_PROXY=localhost,127.0.0.1,docker-registry.example.com,.corp"
EOF

systemctl daemon-reload
systemctl restart docker

docker info | grep Proxy
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/686722300/  
> 转载 URL: https://docs.docker.com/config/daemon/systemd/#httphttps-proxy
