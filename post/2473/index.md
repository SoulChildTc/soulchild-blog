# kubernetes 1.20.7 二进制安装-apiserver+nginx+keepalived(五) 

<!--more-->
### 一、安装apiserver
#### 1.下载server包
```bash
cd /server/packages/
wget https://dl.k8s.io/v1.20.7/kubernetes-server-linux-amd64.tar.gz

# 分发到其他机器
for i in {202..203};do scp kubernetes-server-linux-amd64.tar.gz 172.17.20.$i:`pwd` ;done
```

#### 2.安装apiserver

```bash
# 三台机器执行
tar xf kubernetes-server-linux-amd64.tar.gz
cp kubernetes/server/bin/kube-apiserver /usr/local/bin

```

#### 3.创建审计日志策略配置文件
`None` - 符合这条规则的日志将不会记录
`Metadata` - 记录请求的元数据（请求的用户、时间戳、资源、动词等等）， 但是不记录请求或者响应的消息体。
`Request` - 记录事件的元数据和请求的消息体，但是不记录响应的消息体。 这不适用于非资源类型的请求。
`RequestResponse` - 记录事件的元数据，请求和响应的消息体。这不适用于非资源类型的请求。

审计配置的api文档:https://kubernetes.io/zh/docs/reference/config-api/apiserver-audit.v1/#resource-types

下面配置来源[kubernetes code](https://github.com/kubernetes/kubernetes/blob/v1.20.7/cluster/gce/gci/configure-helper.sh#L1081)

```bash
cat > /etc/kubernetes/audit-policy.yaml <<EOF
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # 不记录一些高容量和低风险的日志.
  - level: None
    users: ["system:kube-proxy"]
    verbs: ["watch"]
    resources:
      - group: "" # core
        resources: ["endpoints", "services", "services/status"]
  - level: None
    # Ingress controller reads 'configmaps/ingress-uid' through the unsecured port.
    # TODO(#46983): Change this to the ingress controller service account.
    users: ["system:unsecured"]
    namespaces: ["kube-system"]
    verbs: ["get"]
    resources:
      - group: "" # core
        resources: ["configmaps"]
  - level: None
    users: ["kubelet"] # legacy kubelet identity
    verbs: ["get"]
    resources:
      - group: "" # core
        resources: ["nodes", "nodes/status"]
  - level: None
    userGroups: ["system:nodes"]
    verbs: ["get"]
    resources:
      - group: "" # core
        resources: ["nodes", "nodes/status"]
  - level: None
    users:
      - system:kube-controller-manager
      - system:kube-scheduler
      - system:serviceaccount:kube-system:endpoint-controller
    verbs: ["get", "update"]
    namespaces: ["kube-system"]
    resources:
      - group: "" # core
        resources: ["endpoints"]
  - level: None
    users: ["system:apiserver"]
    verbs: ["get"]
    resources:
      - group: "" # core
        resources: ["namespaces", "namespaces/status", "namespaces/finalize"]
  - level: None
    users: ["cluster-autoscaler"]
    verbs: ["get", "update"]
    namespaces: ["kube-system"]
    resources:
      - group: "" # core
        resources: ["configmaps", "endpoints"]
  # Don't log HPA fetching metrics.
  - level: None
    users:
      - system:kube-controller-manager
    verbs: ["get", "list"]
    resources:
      - group: "metrics.k8s.io"
  # Don't log these read-only URLs.
  - level: None
    nonResourceURLs:
      - /healthz*
      - /version
      - /swagger*
  # Don't log events requests because of performance impact.
  - level: None
    resources:
      - group: "" # core
        resources: ["events"]
  # node and pod status calls from nodes are high-volume and can be large, don't log responses for expected updates from nodes
  - level: Request
    users: ["kubelet", "system:node-problem-detector", "system:serviceaccount:kube-system:node-problem-detector"]
    verbs: ["update","patch"]
    resources:
      - group: "" # core
        resources: ["nodes/status", "pods/status"]
    omitStages:
      - "RequestReceived"
  - level: Request
    userGroups: ["system:nodes"]
    verbs: ["update","patch"]
    resources:
      - group: "" # core
        resources: ["nodes/status", "pods/status"]
    omitStages:
      - "RequestReceived"
  # deletecollection calls can be large, don't log responses for expected namespace deletions
  - level: Request
    users: ["system:serviceaccount:kube-system:namespace-controller"]
    verbs: ["deletecollection"]
    omitStages:
      - "RequestReceived"
  # Secrets, ConfigMaps, TokenRequest and TokenReviews can contain sensitive & binary data,
  # so only log at the Metadata level.
  - level: Metadata
    resources:
      - group: "" # core
        resources: ["secrets", "configmaps", "serviceaccounts/token"]
      - group: authentication.k8s.io
        resources: ["tokenreviews"]
    omitStages:
      - "RequestReceived"
  # Get responses can be large; skip them.
  - level: Request
    verbs: ["get", "list", "watch"]
    resources:
      - group: "" # core
      - group: "admissionregistration.k8s.io"
      - group: "apiextensions.k8s.io"
      - group: "apiregistration.k8s.io"
      - group: "apps"
      - group: "authentication.k8s.io"
      - group: "authorization.k8s.io"
      - group: "autoscaling"
      - group: "batch"
      - group: "certificates.k8s.io"
      - group: "extensions"
      - group: "metrics.k8s.io"
      - group: "networking.k8s.io"
      - group: "node.k8s.io"
      - group: "policy"
      - group: "rbac.authorization.k8s.io"
      - group: "scheduling.k8s.io"
      - group: "storage.k8s.io"
    omitStages:
      - "RequestReceived"
  # Default level for known APIs
  - level: RequestResponse
    resources:
      - group: "" # core
      - group: "admissionregistration.k8s.io"
      - group: "apiextensions.k8s.io"
      - group: "apiregistration.k8s.io"
      - group: "apps"
      - group: "authentication.k8s.io"
      - group: "authorization.k8s.io"
      - group: "autoscaling"
      - group: "batch"
      - group: "certificates.k8s.io"
      - group: "extensions"
      - group: "metrics.k8s.io"
      - group: "networking.k8s.io"
      - group: "node.k8s.io"
      - group: "policy"
      - group: "rbac.authorization.k8s.io"
      - group: "scheduling.k8s.io"
      - group: "storage.k8s.io"
    omitStages:
      - "RequestReceived"
  # Default level for all other requests.
  - level: Metadata
    omitStages:
      - "RequestReceived"
EOF
```
分发审计策略配置到其他机器
```bash
for i in {202..203};do scp /etc/kubernetes/audit-policy.yaml 172.17.20.$i:/etc/kubernetes/ ;done
```

#### 4.配置静态加密Secret数据
官方文档: https://kubernetes.io/zh/docs/tasks/administer-cluster/encrypt-data/

默认情况下secret的数据存储在etcd上是没有加密的,为了相对安全一些我们可以配置静态secret数据加密,将存在etcd中的secret数据进行加密。使用静态加密需要给apiserver添加`--encryption-provider-config`参数,并指定一个配置文件。

```bash
cat > /etc/kubernetes/static-secret-encryption.yaml <<EOF
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: {{Secret}}
    - identity: {}
EOF

# 生成随机secret
sed -i "s#{{Secret}}#`head -c 32 /dev/urandom | base64`#" /etc/kubernetes/static-secret-encryption.yaml

# 分发配置到其他机器
for i in {202..203};do scp /etc/kubernetes/static-secret-encryption.yaml 172.17.20.$i:/etc/kubernetes/ ;done
```

#### 5.创建令牌认证文件
kubelet在启动时会向apiserver发送给csr请求，这里我们创建一个权限有限的token,用于kubelet向apiserver申请证书。
```bash
# token,user,uid,"group1,group2,group3"
echo "$(head -c 16 /dev/urandom | od -An -t x | tr -d ' '),kubelet-bootstrap,10001,"system:bootstrappers"" > /etc/kubernetes/token.csv
```

#### 6.创建systemd启动脚本
```bash
cat > /etc/systemd/system/kube-apiserver.service <<EOF
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target

[Service]
ExecStart=/usr/local/bin/kube-apiserver \\
  --advertise-address=172.17.20.201 \\
  --allow-privileged=true \\
  --apiserver-count=3 \\
  --audit-log-maxage=15 \\
  --audit-log-maxsize=100 \\
  --audit-log-maxbackup=5 \\
  --audit-log-path=/var/log/kube-apiserver-audit.log \\
  --audit-policy-file=/etc/kubernetes/audit-policy.yaml \\
  --authorization-mode=Node,RBAC \\
  --bind-address=172.17.20.201 \\
  --client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --delete-collection-workers=2 \\
  --enable-admission-plugins=NodeRestriction \\
  --enable-bootstrap-token-auth \\
  --token-auth-file=/etc/kubernetes/token.csv \\
  --encryption-provider-config=/etc/kubernetes/static-secret-encryption.yaml \\
  --etcd-cafile=/etc/kubernetes/pki/ca/ca.pem \\
  --etcd-certfile=/etc/kubernetes/pki/etcd/etcd.pem \\
  --etcd-keyfile=/etc/kubernetes/pki/etcd/etcd-key.pem \\
  --etcd-servers=https://172.17.20.201:2379,https://172.17.20.202:2379,https://172.17.20.203:2379 \\
  --event-ttl=72h \\
  --feature-gates=EphemeralContainers=true \\
  --kubelet-certificate-authority=/etc/kubernetes/pki/ca/ca.pem \\
  --kubelet-client-certificate=/etc/kubernetes/pki/apiserver.pem \\
  --kubelet-client-key=/etc/kubernetes/pki/apiserver-key.pem \\
  --logtostderr=false \\
  --log-file=/var/log/kube-apiserver.log \\
  --log-file-max-size=1 \\
  --proxy-client-cert-file=/etc/kubernetes/pki/apiserver.pem \\
  --proxy-client-key-file=/etc/kubernetes/pki/apiserver-key.pem \\
  --requestheader-client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --requestheader-allowed-names="aggregator" \\
  --requestheader-username-headers="X-Remote-User" \\
  --requestheader-group-headers="X-Remote-Group" \\
  --requestheader-extra-headers-prefix="X-Remote-Extra-" \\
  --runtime-config=api/all=true \\
  --secure-port=6443 \\
  --service-account-issuer=https://kubernetes.default.svc.cluster.local \\
  --service-account-key-file=/etc/kubernetes/pki/apiserver.pem  \\
  --service-account-signing-key-file=/etc/kubernetes/pki/apiserver-key.pem \\
  --service-cluster-ip-range=10.1.0.0/16 \\
  --service-node-port-range=30000-32767 \\
  --tls-cert-file=/etc/kubernetes/pki/apiserver.pem \\
  --tls-private-key-file=/etc/kubernetes/pki/apiserver-key.pem

Restart=on-failure
RestartSec=10
Type=notify
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```
**[参数说明](https://v1-20.docs.kubernetes.io/zh/docs/reference/command-line-tools-reference/kube-apiserver/):**
`--advertise-address`: 向集群成员通知apiserver的IP地址
`--allow-privileged`: 设置为true，允许特权容器
`--apiserver-count`: 集群中运行的apiserver数量
`--audit-log-maxage`: 保留旧审计日志文件的最大天数
`--audit-log-maxbackup`: 保留的旧审计日志文件的最大数量
`--audit-log-maxsize`: 审计日志文件轮转大小(单个日志文件的最大大小)单位MB
`--audit-log-path`: 指定用来写入审计事件的日志文件路径。不指定此标志会禁用日志`-` 表示stdout
`--audit-policy-file`: 审计策略的配置文件路径
`--authorization-mode`: 在安全端口上进行鉴权的插件的顺序列表。逗号分隔的列表：`AlwaysAllow`,`AlwaysDeny`,`ABAC`,`Webhook`,`Node`,`RBAC`
`--bind-address`: 安全端口的监听IP地址。
`--client-ca-file`: 指定签发客户端证书的根CA机构证书,apiserver会使用此CA证书校验证书合法性，并且对客户端证书中的CommonName对身份进行校验
`--delete-collection-workers`: 调用`DeleteCollection`的worker数量。 这可以用于加速namespace清理。
`--enable-admission-plugins`: 指定要启用除了默认插件以外的哪些插件。

- `默认已启用的插件`:NamespaceLifecycle、LimitRanger、ServiceAccount、TaintNodesByCondition、Priority、DefaultTolerationSeconds、DefaultStorageClass、StorageObjectInUseProtection、PersistentVolumeClaimResize、RuntimeClass、CertificateApproval、CertificateSigning、CertificateSubjectRestriction、DefaultIngressClass、MutatingAdmissionWebhook、ValidatingAdmissionWebhook、ResourceQuota

- `所有可选插件`: AlwaysAdmit、AlwaysDeny、AlwaysPullImages、CertificateApproval、CertificateSigning、CertificateSubjectRestriction、DefaultIngressClass、DefaultStorageClass、DefaultTolerationSeconds、DenyEscalatingExec、DenyExecOnPrivileged、EventRateLimit、ExtendedResourceToleration、ImagePolicyWebhook、LimitPodHardAntiAffinityTopology、LimitRanger、MutatingAdmissionWebhook、NamespaceAutoProvision、NamespaceExists、NamespaceLifecycle、NodeRestriction、OwnerReferencesPermissionEnforcement、PersistentVolumeClaimResize、PersistentVolumeLabel、PodNodeSelector、PodSecurityPolicy、PodTolerationRestriction、Priority、ResourceQuota、RuntimeClass、SecurityContextDeny、ServiceAccount、StorageObjectInUseProtection、TaintNodesByCondition、ValidatingAdmissionWebhook

`--enable-bootstrap-token-auth`: 设置是否允许将`kube-system`命名空间中，类型为`bootstrap.kubernetes.io/token`的`Secret`用于TLS引导身份验证。

`--encryption-provider-config`: 静态加密secret的配置文件
`--etcd-cafile`: 用于和etcd通信的证书的颁发机构的证书(即颁发etcd客户端证书的CA机构证书)
`--etcd-certfile`: 用于和etcd通信的证书
`--etcd-healthcheck-timeout`: 检查etcd健康状况时的超时时长。默认2s
`--etcd-keyfile`: 用户和etcd通信的证书的配套私钥
`--etcd-servers`: etcd服务器的列表,格式为`scheme://ip:port`,多个地址使用逗号分隔
`--etcd-servers-overrides`: 将不同的资源存入不同的etcd集群。格式为`group/resource#servers`。例如将event事件单独存储: `/events#http://etcd4:2379,http://etcd5:2379,http://etcd6:2379`
`--event-ttl`: 事件的保留时长默认`1h0m0s`
`--feature-gates`: 控制试验性功能。多个条目用逗号分隔，可选项: https://v1-20.docs.kubernetes.io/zh/docs/reference/command-line-tools-reference/kube-apiserver/
`--kubelet-certificate-authority`: 校验kubelet服务端的证书(因为apiserver也会请求kubelet，比如logs,exec等操作)，这里指定kubelet服务端证书的ca机构证书
`--kubelet-client-certificate`: apiserver访问kubelet使用的客户端证书
`--kubelet-client-key`: apiserver访问kubelet使用的客户端证书的私钥
`--logtostderr`: 默认true，输出日志到stderr，而不是输出到文件
`--log-file`: 日志文件路径
`--log-file-max-size`: 日志文件最大大小,默认1800M
`--profiling`: 启用web性能分析
`--contention-profiling`: 当web性能分析启用时, 设置是否启用锁竞争分析功能

`--proxy-client-cert-file`: apiserver的客户端证书，用于访问扩展apiserver服务器使用。
  - https://v1-20.docs.kubernetes.io/zh/docs/tasks/extend-kubernetes/configure-aggregation-layer/#身份认证流程
  - https://v1-20.docs.kubernetes.io/zh/docs/tasks/extend-kubernetes/setup-extension-api-server/#安装一个扩展的-api-服务器来使用聚合层

`--proxy-client-key-file`: apiserver的客户端证书私钥
`--requestheader-client-ca-file`: 签发apiserver客户端证书的CA证书(kube-apiserver访问扩展apiserver的客户端证书的CA证书)

`--requestheader-allowed-names`: 这个选项用来指定一个CN(Common Name)列表。客户端证书的CN是我们指定的CN列表之一才可以建立连接。如果没有指定CN列表,只要是`--requestheader-client-ca-file`签发的客户端证书都可以通过apiserver认证。

`--requestheader-username-headers`: apiserver将客户端请求的用户名发给扩展apiserver是通过请求头发送的。这里是设置请求头的名称。推荐使用(X-Remote-User)，前提是和扩展apiserver对应。
`--requestheader-group-headers`: 同上，这个是用户组，推荐使用(X-Remote-Group)
`--requestheader-extra-headers-prefix`: 扩展信息前缀。推荐使用(X-Remote-Extra-)

`--runtime-config`: 用于启用或禁用内置api。可选项如下
  - `v1=true|false` 启用或禁用核心API组
  - `/=true|false` 启用或禁用特定API组和版本 (例如 apps/v1=true)
  - `api/all=true|false` 启用或禁用所有API版本
  - `api/ga=true|false` 启用或禁用`v[0-9]+`形式的所有API版本
  - `api/beta=true|false` 启用或禁用`v[0-9]+beta[0-9]+`形式的所有API版本 
  - `api/alpha=true|false` 启用或禁用`v[0-9]+alpha[0-9]+`形式的所有API版本  

`--secure-port`: 监听的安全端口(https)默认6443

`--service-account-issuer`: 当使用sa token 卷投射(`Service Account Token Volume Projection`)时，这里指的是jwt token颁发者的标识符(通过在线jwt解析的网站可以看到iss字段就是我们设置的值).取值必须是 HTTPS URL。可以设置成(https://kubernetes.default.svc.cluster.local)。
`--service-account-key-file`: 指定的是私钥对应的公钥，用于在身份认证过程中确保ServiceAccount token没有被篡改
`--service-account-signing-key-file`: 当使用sa token 卷投射(`Service Account Token Volume Projection`)时,这里指定的是对token签名的私钥
> 关于sa token 卷投射: https://kubernetes.io/zh/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection

`--service-cluster-ip-range`: cluster ip范围。
`--service-node-port-range`: nodeport的端口范围
`--tls-cert-file`: apiserver的服务端证书
`--tls-private-key-file`: apiserver的服务端证书私钥


**其他两台的配置**
apiserver02
```bash
cat > /etc/systemd/system/kube-apiserver.service <<EOF
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target

[Service]
ExecStart=/usr/local/bin/kube-apiserver \\
  --advertise-address=172.17.20.202 \\
  --allow-privileged=true \\
  --apiserver-count=3 \\
  --audit-log-maxage=15 \\
  --audit-log-maxsize=100 \\
  --audit-log-maxbackup=5 \\
  --audit-log-path=/var/log/kube-apiserver-audit.log \\
  --audit-policy-file=/etc/kubernetes/audit-policy.yaml \\
  --authorization-mode=Node,RBAC \\
  --bind-address=172.17.20.202 \\
  --client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --delete-collection-workers=2 \\
  --enable-admission-plugins=NodeRestriction \\
  --enable-bootstrap-token-auth \\
  --encryption-provider-config=/etc/kubernetes/static-secret-encryption.yaml \\
  --etcd-cafile=/etc/kubernetes/pki/ca/ca.pem \\
  --etcd-certfile=/etc/kubernetes/pki/etcd/etcd.pem \\
  --etcd-keyfile=/etc/kubernetes/pki/etcd/etcd-key.pem \\
  --etcd-servers=https://172.17.20.201:2379,https://172.17.20.202:2379,https://172.17.20.203:2379 \\
  --event-ttl=72h \\
  --feature-gates=EphemeralContainers=true \\
  --kubelet-certificate-authority=/etc/kubernetes/pki/ca/ca.pem \\
  --kubelet-client-certificate=/etc/kubernetes/pki/apiserver.pem \\
  --kubelet-client-key=/etc/kubernetes/pki/apiserver-key.pem \\
  --logtostderr=false \\
  --log-file=/var/log/kube-apiserver.log \\
  --log-file-max-size=1 \\
  --proxy-client-cert-file=/etc/kubernetes/pki/apiserver.pem \\
  --proxy-client-key-file=/etc/kubernetes/pki/apiserver-key.pem \\
  --requestheader-client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --requestheader-allowed-names="aggregator" \\
  --requestheader-username-headers="X-Remote-User" \\
  --requestheader-group-headers="X-Remote-Group" \\
  --requestheader-extra-headers-prefix="X-Remote-Extra-" \\
  --runtime-config=api/all=true \\
  --secure-port=6443 \\
  --service-account-issuer=https://kubernetes.default.svc.cluster.local \\
  --service-account-key-file=/etc/kubernetes/pki/apiserver.pem  \\
  --service-account-signing-key-file=/etc/kubernetes/pki/apiserver-key.pem \\
  --service-cluster-ip-range=10.1.0.0/16 \\
  --service-node-port-range=30000-32767 \\
  --tls-cert-file=/etc/kubernetes/pki/apiserver.pem \\
  --tls-private-key-file=/etc/kubernetes/pki/apiserver-key.pem

Restart=on-failure
RestartSec=10
Type=notify
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```

apiserver03
```bash
cat > /etc/systemd/system/kube-apiserver.service <<EOF
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target

[Service]
ExecStart=/usr/local/bin/kube-apiserver \\
  --advertise-address=172.17.20.203 \\
  --allow-privileged=true \\
  --apiserver-count=3 \\
  --audit-log-maxage=15 \\
  --audit-log-maxsize=100 \\
  --audit-log-maxbackup=5 \\
  --audit-log-path=/var/log/kube-apiserver-audit.log \\
  --audit-policy-file=/etc/kubernetes/audit-policy.yaml \\
  --authorization-mode=Node,RBAC \\
  --bind-address=172.17.20.203 \\
  --client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --delete-collection-workers=2 \\
  --enable-admission-plugins=NodeRestriction \\
  --enable-bootstrap-token-auth \\
  --encryption-provider-config=/etc/kubernetes/static-secret-encryption.yaml \\
  --etcd-cafile=/etc/kubernetes/pki/ca/ca.pem \\
  --etcd-certfile=/etc/kubernetes/pki/etcd/etcd.pem \\
  --etcd-keyfile=/etc/kubernetes/pki/etcd/etcd-key.pem \\
  --etcd-servers=https://172.17.20.201:2379,https://172.17.20.202:2379,https://172.17.20.203:2379 \\
  --event-ttl=72h \\
  --feature-gates=EphemeralContainers=true \\
  --kubelet-certificate-authority=/etc/kubernetes/pki/ca/ca.pem \\
  --kubelet-client-certificate=/etc/kubernetes/pki/apiserver.pem \\
  --kubelet-client-key=/etc/kubernetes/pki/apiserver-key.pem \\
  --logtostderr=false \\
  --log-file=/var/log/kube-apiserver.log \\
  --log-file-max-size=1 \\
  --proxy-client-cert-file=/etc/kubernetes/pki/apiserver.pem \\
  --proxy-client-key-file=/etc/kubernetes/pki/apiserver-key.pem \\
  --requestheader-client-ca-file=/etc/kubernetes/pki/ca/ca.pem \\
  --requestheader-allowed-names="aggregator" \\
  --requestheader-username-headers="X-Remote-User" \\
  --requestheader-group-headers="X-Remote-Group" \\
  --requestheader-extra-headers-prefix="X-Remote-Extra-" \\
  --runtime-config=api/all=true \\
  --secure-port=6443 \\
  --service-account-issuer=https://kubernetes.default.svc.cluster.local \\
  --service-account-key-file=/etc/kubernetes/pki/apiserver.pem  \\
  --service-account-signing-key-file=/etc/kubernetes/pki/apiserver-key.pem \\
  --service-cluster-ip-range=10.1.0.0/16 \\
  --service-node-port-range=30000-32767 \\
  --tls-cert-file=/etc/kubernetes/pki/apiserver.pem \\
  --tls-private-key-file=/etc/kubernetes/pki/apiserver-key.pem

Restart=on-failure
RestartSec=10
Type=notify
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
```

#### 7.启动服务
```bash
systemctl start kube-apiserver
systemctl enable kube-apiserver
```

### 二、安装配置nginx
#### 1. 安装
```bash
mkdir /server/packages/ -p
cd /server/packages/
wget http://nginx.org/download/nginx-1.16.1.tar.gz
tar xf nginx-1.16.1.tar.gz
cd nginx-1.16.1/
./configure --prefix=/usr/local/nginx --with-stream --without-http --without-http_uwsgi_module 

```
> 编译参数说明: 
> `--with-stream`: 开启tcp/udp代理
> `--without-http`: 禁用http服务器
> `--without-http_uwsgi_module`: 禁用uwsgi传输功能

#### 2.配置
**两台nginx相同**
```bash
cat > /usr/local/nginx/conf/nginx.conf <<EOF
worker_processes  auto;

error_log  logs/error.log;
pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

stream {
    log_format  main  '$remote_addr [$time_local] '
                      '$protocol $status $bytes_sent $bytes_received '
                      '$session_time "$upstream_addr" '
                      '"$upstream_bytes_sent" "$upstream_bytes_received" "$upstream_connect_time"';

    access_log  logs/access.log  main;

    upstream kube-apiserver {
        hash $remote_addr consistent;
        server 172.17.20.201:6443 max_fails=3 fail_timeout=10s;
        server 172.17.20.202:6443 max_fails=3 fail_timeout=10s;
        server 172.17.20.203:6443 max_fails=3 fail_timeout=10s;
    }
    server {
        listen      6443;
        proxy_connect_timeout 1s;
        proxy_pass kube-apiserver;

    }
}
EOF
```
#### 3.启动服务
```bash
/usr/local/nginx/sbin/nginx
```


### 三、安装keepalived
#### 1. 安装
```bash
yum install -y keepalived
```

#### 2.配置
**nginx01的keepalived**
```bash
cat > /etc/keepalived/keepalived.conf <<EOF
global_defs {
   router_id nginx01
}

# 定义一个状态检查,script中也可以写一个脚本，但脚本需有返回值
vrrp_script check_nginx {
    # 每2秒检查一次nginx进程状态，根据命令执行的状态码去判断服务是否正常
    script "/usr/bin/killall -0 nginx"
    interval 2
    # 2次状态吗为非0才为失败状态
    fall 2
    # 2次状态码为0才为正常状态
    rise 2
}

vrrp_instance nginx {
    # 设置为master
    state MASTER
    # 指定vip绑定网卡
    interface eth0
    # vrrp标识1-255(需要和备节点一致)
    virtual_router_id 51
    # 指定优先级，优先级高的会优先成为master
    priority 100
    # 组播包间隔时间
    advert_int 1
    # 认证
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    # 配置vip
    virtual_ipaddress {
        172.17.20.200
    }

    # 引用上面定义的状态检查
    track_script {
        check_nginx
    }
}
EOF
```

**nginx02的keepalived**
```bash
cat > /etc/keepalived/keepalived.conf <<EOF
global_defs {
   router_id nginx02
}

# 定义一个状态检查,script中也可以写一个脚本，但脚本需有返回值
vrrp_script check_nginx {
    # 每2秒检查一次nginx进程状态，根据命令执行的状态码去判断服务是否正常
    script "/usr/bin/killall -0 nginx"
    interval 2
    # 2次状态吗为非0才为失败状态
    fall 2
    # 2次状态码为0才为正常状态
    rise 2
}

vrrp_instance nginx {
    # 设置为master
    state BACKUP
    # 指定vip绑定网卡
    interface eth0
    # vrrp标识1-255(需要和备节点一致)
    virtual_router_id 51
    # 指定优先级，优先级高的会优先成为master
    priority 99
    # 组播包间隔时间
    advert_int 1
    # 认证
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    # 配置vip
    virtual_ipaddress {
        172.17.20.200
    }

    # 引用上面定义的状态检查
    track_script {
        check_nginx
    }
}
EOF
```

#### 3.启动服务
```bash
systemctl start keepalived
systemctl enable keepalived
```

#### 4.验证vip漂移
停止nginx01的keepalived,观察vip是否会漂移到nginx02上
启动nginx01的keepalived,观察vip是否会漂移到nginx01上(当前配置是抢占模式，nginx01恢复后会抢占VIP)





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2473/  

