# kubernetes 1.20.7 二进制安装-controller-manager(七)

<!--more-->
### 一、安装controller-manager

```bash
# 三台机器执行
cp /server/packages/kubernetes/server/bin/kube-controller-manager /usr/local/bin/
```

### 二、生成kubeconfig文件

关于kubeconfig可以看上一篇文章: https://soulchild.cn/2478.html

```bash
cd /etc/kubernetes/
# 设置集群信息
kubectl config set-cluster kubernetes --kubeconfig=controller-manager.conf --server=https://172.17.20.200:6443 --certificate-authority=/etc/kubernetes/pki/ca/ca.pem --embed-certs=true

# 设置用户信息
kubectl config set-credentials controller-manager --kubeconfig=controller-manager.conf --client-certificate=/etc/kubernetes/pki/kube-controller-manager.pem --client-key=/etc/kubernetes/pki/kube-controller-manager-key.pem --embed-certs=true

# 设置上下文信息,将用户和集群关联
kubectl config set-context controller-manager --kubeconfig=controller-manager.conf --cluster=kubernetes --user=controller-manager

# 设置配置文件中默认的上下文
kubectl config use-context controller-manager --kubeconfig=controller-manager.conf

# 分发到其他机器
for i in {202..203};do scp /etc/kubernetes/controller-manager.conf 172.17.20.$i:/etc/kubernetes/ ;done
```

### 三、创建systemd启动脚本

#### 三台配置相同

```bash
cat > /etc/systemd/system/kube-controller-manager.service <<EOF
[Unit]
Description=Kubernetes Controller Manager
Documentation=https://github.com/GoogleCloudPlatform/kubernetes

[Service]
ExecStart=/usr/local/bin/kube-controller-manager \\
  --allocate-node-cidrs=true \\
  --cluster-cidr=10.244.0.0/16 \\
  --service-cluster-ip-range=10.1.0.0/16 \\
  --node-cidr-mask-size=24 \\
  --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf \\
  --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf \\
  --bind-address=0.0.0.0 \\
  --client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --cluster-name=kubernetes \\
  --cluster-signing-cert-file=/etc/kubernetes/pki/ca/ca.pem \\
  --cluster-signing-key-file=/etc/kubernetes/pki/ca/ca-key.pem \\
  --cluster-signing-duration=87600h \\
  --concurrent-deployment-syncs=10 \\
  --controllers=*,bootstrapsigner,tokencleaner \\
  --horizontal-pod-autoscaler-initial-readiness-delay=30s \\
  --horizontal-pod-autoscaler-sync-period=10s \\
  --kube-api-burst=100 \\
  --kube-api-qps=100 \\
  --kubeconfig=/etc/kubernetes/controller-manager.conf \\
  --leader-elect=true \\
  --logtostderr=false \\
  --log-file=/var/log/kube-controller-manager.log \\
  --log-file-max-size=100 \\
  --pod-eviction-timeout=1m \\
  --root-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --secure-port=10257 \\
  --service-account-private-key-file=/etc/kubernetes/pki/apiserver-key.pem \\
  --tls-cert-file=/etc/kubernetes/pki/kube-controller-manager.pem \\
  --tls-private-key-file=/etc/kubernetes/pki/kube-controller-manager-key.pem \\
  --use-service-account-credentials=true

Restart=on-failure
RestartSec=10
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```

#### [参数说明](https://v1-20.docs.kubernetes.io/zh/docs/reference/command-line-tools-reference/kube-controller-manager/#%E9%80%89%E9%A1%B9)

`--allocate-node-cidrs`: 是否自动分配CIDR地址范围并设置到云提供商上, 在裸机部署的情况下启用--allocate-node-cidrs参数可以确保将这些CIDR地址范围分配给新加入集群的节点，并将其保存到etcd中。

`--cluster-cidr`: pod ip的范围。要求`--allocate-node-cidrs`为true。

`--service-cluster-ip-range`: cluster ip的范围，和apiserver中的要一致。要求`--allocate-node-cidrs`为true。

`--node-cidr-mask-size`: 设置一个node节点可以使用的pod ip数量及范围，这里填写的是掩码. `所有可用pod ip数量/node可用ip数量=最大节点数。(我猜的。。)`

`--authentication-kubeconfig`: 指定一个拥有创建`tokenreviews.authentication.k8s.io`对象权限的kubeconfig配置文件。如果设置为空，则所有的token请求都被视为匿名，也不会启用客户端CA认证

`--authorization-kubeconfig`: 指定一个拥有创建`subjectaccessreviews.authorization.k8s.io`对象权限的kubeconfig配置文件。如果设置为空,则所有未列入白名单的请求都将被拒绝。

`--bind-address`: 监听地址

`--client-ca-file`: 如果有客户端使用证书来请求`controller-manager`,那么`controller-manager`将会使用此参数指定的根证书进行校验

`--cluster-name`: 集群名称，默认kubernetes

`--cluster-signing-cert-file`: 用于签发证书的CA根证书

`--cluster-signing-key-file`: 用于签发证书的CA根证书的私钥  

`--cluster-signing-duration`: 签发证书的有效期,默认8760h0m0s。(感觉最大能到5年,我设置的10年,通过openssl查看签发的证书有效期只有5年。)

`--concurrent-deployment-syncs`: 允许并发同步deployment的数量,默认5。数字越大，deployment响应越快，但CPU和网络负载会高。

`--controllers`: 要启用的控制器列表。`*`表示启用所有默认启用的控制器。`foo`表示启用名为foo的控制器； `-foo` 表示禁用名为 foo的控制器。
  - `所有控制器`：attachdetach、bootstrapsigner、cloud-node-lifecycle、clusterrole-aggregation、cronjob、csrapproving、csrcleaner、csrsigning、daemonset、deployment、disruption、endpoint、endpointslice、endpointslicemirroring、ephemeral-volume、garbagecollector、horizontalpodautoscaling、job、namespace、nodeipam、nodelifecycle、persistentvolume-binder、persistentvolume-expander、podgc、pv-protection、pvc-protection、replicaset、replicationcontroller、resourcequota、root-ca-cert-publisher、route、service、serviceaccount、serviceaccount-token、statefulset、tokencleaner、ttl、ttl-after-finished
  - `默认禁用的控制器`：bootstrapsigner 和 tokencleaner。

`--horizontal-pod-autoscaler-initial-readiness-delay`: hpa相关配置，初始化时间,用于延迟采样,默认30s

`--horizontal-pod-autoscaler-sync-period`: hpa相关配置，检查周期（默认为15s）

`--kube-api-burst`: controller-manager与apiserver通信时突发请求个数上限。默认30.

`--kube-api-qps`: 与apisever通信时的QPS限制。默认20.

`--kubeconfig`: 与apiserver通信的kubeconfig

`--leader-elect`: true开启leader选举

`--logtostderr`: 将日志输出到stderr，而不是文件，默认true。

`--log-file`: 日志文件路径

`--log-file-max-size`: 单个日志文件的上限大小，默认1800，单位MB

`--node-monitor-period`: 每隔一段时间检查kubelet的状态，默认5s

`--node-monitor-grace-period`: 将一个Node节点标记为notready之前没有响应的时间,默认40s。必须是kubelet的 nodeStatusUpdateFrequency(参数--node-status-update-frequency,默认10s)的N倍

`--node-startup-grace-period`: 将一个Node节点标记为unhealthy之前没有响应的时间,默认1m。

`--pod-eviction-timeout`: 当节点达到unhealthy后等待多久驱逐pod，默认5m。

`--root-ca-file`: 根CA的证书,这个根证书将包含在Service Account对应的Secret中。

`--service-account-private-key-file`: 签发service account所用的私钥。和apiserver的`--service-account-key-file`指定的公钥对应

`--secure-port`: 安全端口,默认10257

`--tls-cert-file`: controller-manager的服务端证书

`--tls-private-key-file`: controller-manager的服务端证书的私钥

`--use-service-account-credentials`: 如果为true，为每个控制器使用单独的service account凭据

### 四、启动服务

```bash
systemctl start kube-controller-manager
systemctl enable kube-controller-manager
```

### 五、测试

查看当前leader节点

```bash
kubectl get lease -n kube-system kube-controller-manager

NAME                      HOLDER                                          AGE
kube-controller-manager   master02_d6925209-5d63-4840-bc1c-9f16f4d8547b   14h

# 当前leader是master02
```

停掉master02的controller-manager,观察是否会切换到其他节点


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2484/  

