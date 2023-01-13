# kubernetes 1.20.7 二进制安装-Docker安装配置(九) 

<!--more-->
一、配置docker yum源
```bash
wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo
```


二、安装docker 19.03.9
```bash
yum install -y docker-ce-19.03.9-3.el7.x86_64
```

三、修改配置文件
```bash
mkdir /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "registry-mirrors": [
      "https://lkf7gymq.mirror.aliyuncs.com",
      "https://docker.mirrors.ustc.edu.cn"
  ],
  "log-driver": "json-file"
}
EOF
```

四、启动docker
```bash
systemctl start docker
systemctl enable docker
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2491/  

