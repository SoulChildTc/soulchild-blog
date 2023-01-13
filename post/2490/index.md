# kubernetes 1.20.7 二进制安装-kube-scheduler(八)

<!--more-->
### 一、安装controller-manager
```bash
# 三台机器执行
cp /server/packages/kubernetes/server/bin/kube-scheduler /usr/local/bin/
```


### 二、生成kubeconfig文件
```bash
cd /etc/kubernetes/
# 设置集群信息
kubectl config set-cluster kubernetes --kubeconfig=kube-scheduler.conf --server=https://172.17.20.200:6443 --certificate-authority=/etc/kubernetes/pki/ca/ca.pem --embed-certs=true

# 设置用户信息
kubectl config set-credentials kube-scheduler --kubeconfig=kube-scheduler.conf --client-certificate=/etc/kubernetes/pki/kube-scheduler.pem --client-key=/etc/kubernetes/pki/kube-scheduler-key.pem --embed-certs=true

# 设置上下文
kubectl config set-context kubernetes --kubeconfig=kube-scheduler.conf --cluster=kubernetes --user=kube-scheduler

# 设置默认上下文
kubectl config use-context --kubeconfig=kube-scheduler.conf kubernetes

# 分发到其他节点
for i in {202..203};do scp /etc/kubernetes/kube-scheduler.conf 172.17.20.$i:/etc/kubernetes/ ;done
```

### 三、创建systemd启动脚本
#### 三台配置相同
```bash
cat > /etc/systemd/system/kube-scheduler.service <<EOF
[Unit]
Description=Kubernetes Scheduler
Documentation=https://github.com/GoogleCloudPlatform/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-scheduler \\
  --authentication-kubeconfig=/etc/kubernetes/kube-scheduler.conf \\
  --authorization-kubeconfig=/etc/kubernetes/kube-scheduler.conf \\
  --kubeconfig=/etc/kubernetes/kube-scheduler.conf \\
  --bind-address=0.0.0.0 \\
  --secure-port=10259 \\
  --client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --leader-elect=true \\
  --log-file=/var/log/kube-scheduler.log \\
  --log-file-max-size=100 \\
  --logtostderr=false \\
  --tls-cert-file=/etc/kubernetes/pki/kube-scheduler.pem \\
  --tls-private-key-file=/etc/kubernetes/pki/kube-scheduler-key.pem

Restart=on-failure
RestartSec=10
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```
#### [参数说明](https://v1-20.docs.kubernetes.io/zh/docs/reference/command-line-tools-reference/kube-scheduler/): 
`--authentication-kubeconfig`: 指定一个拥有创建tokenreviews.authentication.k8s.io对象权限的kubeconfig配置文件。如果设置为空，则所有的token请求都被视为匿名，也不会启用客户端CA认证
`--authorization-kubeconfig`: 指定一个拥有创建subjectaccessreviews.authorization.k8s.io对象权限的kubeconfig配置文件。如果设置为空,则所有未列入白名单的请求都将被拒绝。
`--bind-address`: 安全端口的监听地址
`--secure-port`: 安全端口，默认10259
`--client-ca-file`: 如果有客户端使用证书来请求controller-manager,那么controller-manager将会使用此参数指定的根证书进行校验
`--leader-elect`: true开启leader选举
`--log-file`: 日志文件路径
`--log-file-max-size`: 单个日志文件的上限大小，默认1800，单位MB
`--logtostderr`: 将日志输出到stderr，而不是文件，默认true。
`--tls-cert-file`: 服务端证书
`--tls-private-key-file`: 服务端证书私钥
`--kubeconfig`: 与apiserver通信的kubeconfig
`--config`: 指定配置文件的方式运行，想了解的可以看官方文档:https://kubernetes.io/zh/docs/reference/scheduling/config/


### 四、启动服务
```bash
systemctl start kube-scheduler
systemctl enable kube-scheduler
```

### 五、测试
查看当前leader锁在谁手上
```bash
kubectl get lease -n kube-system kube-scheduler

NAME             HOLDER                                          AGE
kube-scheduler   master01_c7c38b21-3d32-4a25-b2ae-a7dde7b6c240   11m
```

停掉master01的kube-scheduler,观察是否能被其他人获取。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2490/  

