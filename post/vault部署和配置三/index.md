# Vault部署和配置(三)


<!--more-->

## 一、安装
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install vault
```

## 二、生成证书
### 签发证书的配置
```bash
cat > /opt/vault/tls/vault_san.cnf <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
countryName = CN
stateOrProvinceName = Beijing
localityName = Beijing
organizationName = SoulChild
commonName = vault.soulchild.cn

[v3_req]
keyUsage = nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = 192.168.124.52
IP.2 = 192.168.124.54
IP.3 = 192.168.124.60
IP.4 = 127.0.0.1
DNS.1 = vault.soulchild.cn
EOF
```
> ip填写所有节点的, 包含127.0.0.1, DNS根据需求写即可

### 创建csr
```bash
cd /opt/vault/tls
openssl genrsa -out vault.key
openssl req -new -key vault.key -out vault.csr -subj "/C=CN/ST=Shanghai/L=Shanghai/O=SoulChild/CN=vault.soulchild.cn" -config vault_san.cnf
```

### 签发证书
```bash
openssl x509 -req -extensions v3_req -days 3650 -sha256 \
-in vault.csr -CA tls.crt -CAkey tls.key \
-CAcreateserial -out vault.crt \
-extfile vault_san.cnf

# 证书合并
cat vault.crt tls.crt > vault.pem

chown -R vault:vault /opt/vault/tls/
```
> 集群中所有节点都可以用vault.pem这个证书

## 二、配置文件
官方文档: https://developer.hashicorp.com/vault/docs/configuration

`vim /etc/vault.d/vault.hcl`

```hcl
ui = true
log_level = "Info"
#disable_mlock = true

api_addr = "https://192.168.124.52:8200"
cluster_addr = "https://192.168.124.52:8201"

storage "raft" {
  path    = "/opt/vault/data"
  node_id = "node1"
}

# HTTP listener
#listener "tcp" {
#  address = "127.0.0.1:8200"
#  tls_disable = 1
#}

# HTTPS listener
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/opt/vault/tls/vault.pem"
  tls_key_file  = "/opt/vault/tls/vault.key"
}
```
> ui=true 开启ui界面
>
> api_addr 通告地址，如果通过负载均衡访问，需要写负载均衡的ip，否则写本机ip
> 
> cluster_addr 通告地址，指定集群通信的地址, raft存储后端支持集群模式
> 
> disable_mlock=true 禁用mlock, mlock的目的是防止内存被交换到磁盘上,如果系统不支持可以关闭。如果要使用需要满足:  
> 使用非root用户需要执行`sudo setcap cap_ipc_lock=+ep /usr/bin/vault`或者修改systemd配置,添加如下内容, yum安装的默认已经加上了
>> [Service]
>>
>> CapabilityBoundingSet=CAP_IPC_LOCK
>> 
>> AmbientCapabilities=CAP_IPC_LOCK
>> 
>> NoNewPrivileges=yes
> 
> listener "tcp" 配置监听, 这里每个节点的服务端证书和key都一致(懒)
>
> 如果tls_require_and_verify_client_cert参数为true，开启集群通信双向tls
> 
> 支持的后端存储: https://developer.hashicorp.com/vault/docs/configuration/storage

## 三、初始化

### 忽略验证ca
由于我们是自签证书,无法验证通过,所以需要指定ca证书的位置或者跳过验证服务端证书

```bash
# 我不想折腾了,用VAULT_SKIP_VERIFY=false比较方便
# VAULT_CACERT="/opt/vault/tls/tls.crt"
echo 'export VAULT_SKIP_VERIFY=true' >> ~/.bashrc
source ~/.bashrc
```

### 启动服务
```bash
systemctl start vault
```

### 查看状态
```bash
[root@node1 ~]# vault status 
Key                Value
---                -----
Seal Type          shamir
Initialized        false
Sealed             true
Total Shares       0
Threshold          0
Unseal Progress    0/0
Unseal Nonce       n/a
Version            1.12.3
Build Date         2023-02-02T09:07:27Z
Storage Type       raft
HA Enabled         true
```

### 初始化
```bash
[root@node1 tls]# vault operator init -n 5 -t 3
Unseal Key 1: X+ahAl/c95zpwC7GIr43gKQ8xi7wl+Xxi433oyTujXqH
Unseal Key 2: GpVZsn+7m3DPdnOnvP2jsGvaxDp4X+NiSERY/zmwCKQq
Unseal Key 3: mHo/Y8rSMp3tIv79YeroE4iw/juL0ixXrJFlaFuU0PWu
Unseal Key 4: 5iPBck1dqL9pyNbYHKy4qdTsQnImWyERk4G/w0a9jqoh
Unseal Key 5: MWVofq0WwVc0fdklZuE1KKpOuouuY6/5zpliR0fAoq2+

Initial Root Token: hvs.ZOPIfCLkNHVNlNgQT4dc5Rid

Vault initialized with 5 key shares and a key threshold of 3. Please securely
distribute the key shares printed above. When the Vault is re-sealed,
restarted, or stopped, you must supply at least 3 of these keys to unseal it
before it can start servicing requests.

Vault does not store the generated root key. Without at least 3 keys to
reconstruct the root key, Vault will remain permanently sealed!

It is possible to generate new unseal keys, provided you have a quorum of
existing unseal keys shares. See "vault operator rekey" for more information.
```
> -key-shares / -n : 生成n个密钥分片
>
> -key-threshold / -t : 最少需要t个才能解封
>
> 这个输出只会输出一次,所以需要把它记录到安全的地方

### 解封
每次启动vault都需要解封才可以使用, 从上面5个随便选3个 unseal key即可
```bash
[root@node1 tls]# vault operator unseal  # 第一个
Unseal Key (will be hidden): 
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       5
Threshold          3
Unseal Progress    1/3
Unseal Nonce       87dd40eb-db56-14ff-3cf8-bc519ec870e9
Version            1.12.3
Build Date         2023-02-02T09:07:27Z
Storage Type       raft
HA Enabled         true
[root@node1 ~]# vault operator unseal  # 第二个
Unseal Key (will be hidden): 
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       5
Threshold          3
Unseal Progress    2/3
Unseal Nonce       87dd40eb-db56-14ff-3cf8-bc519ec870e9
Version            1.12.3
Build Date         2023-02-02T09:07:27Z
Storage Type       raft
HA Enabled         true
[root@node1 ~]# vault operator unseal  # 第三个
Unseal Key (will be hidden): 
Key                     Value
---                     -----
Seal Type               shamir
Initialized             true
Sealed                  false
Total Shares            5
Threshold               3
Version                 1.12.3
Build Date              2023-02-02T09:07:27Z
Storage Type            raft
Cluster Name            vault-cluster-17171282
Cluster ID              f377582e-52ae-5a4f-2f69-b715d721240c
HA Enabled              true
HA Cluster              n/a
HA Mode                 standby
Active Node Address     <none>
Raft Committed Index    31
Raft Applied Index      31
```

### 登录使用
```bash
[root@node1 tls]# vault login
Token (will be hidden): 
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                  Value
---                  -----
token                hvs.ZOPIfCLkNHVNlNgQT4dc5Rid
token_accessor       II0eGTdyssE2iAleZ3kn59eK
token_duration       ∞
token_renewable      false
token_policies       ["root"]
identity_policies    []
policies             ["root"]
```

### 启用kv2引擎
```bash
vault secrets enable -description="KV Version 2" -path="secret" kv-v2
```

## 其他节点
部署其他节点的注意事项
1. 复制证书到其他节点
2. `vault.hcl`配置文件中的ip需要修改为其他节点自己的ip
3. raft模式最少3节点

### 一、安装
略

### 二、复制证书
```bash
scp vault.pem vault.key tls.crt 192.168.124.54:/opt/vault/tls
scp vault.pem vault.key tls.crt 192.168.124.60:/opt/vault/tls

# 别忘了修改证书文件权限
chown -R vault:vault /opt/vault/tls/
```

### 三、配置文件

node2
```bash
cat > /etc/vault.d/vault.hcl <<EOF
ui = true
log_level = "Info"

api_addr = "https://192.168.124.54:8200"
cluster_addr = "https://192.168.124.54:8201"

storage "raft" {
  path    = "/opt/vault/data"
  node_id = "node2"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/opt/vault/tls/vault.pem"
  tls_key_file  = "/opt/vault/tls/vault.key"
}
EOF
```

node3
```bash
cat > /etc/vault.d/vault.hcl <<EOF
ui = true
log_level = "Info"

api_addr = "https://192.168.124.60:8200"
cluster_addr = "https://192.168.124.60:8201"

storage "raft" {
  path    = "/opt/vault/data"
  node_id = "node3"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/opt/vault/tls/vault.pem"
  tls_key_file  = "/opt/vault/tls/vault.key"
}
EOF
```

### 忽略ca
```bash
echo 'export VAULT_SKIP_VERIFY=true' >> ~/.bashrc
source ~/.bashrc
```

### 启动服务
node2和node3执行
```bash
systemctl start vault
```

### 加入集群
node2和node3执行
```bash
# 加入节点
vault operator raft join -leader-ca-cert=@/opt/vault/tls/tls.crt  https://192.168.124.52:8200
Key       Value
---       -----
Joined    true

# 输入解封密钥 3次, node1生成的
vault operator unseal
```

### 查看集群节点
```bash
[root@node1 ]# vault operator raft list-peers
Node     Address                State       Voter
----     -------                -----       -----
node1    192.168.124.52:8201    leader      true
node2    192.168.124.54:8201    follower    true
node3    192.168.124.60:8201    follower    true
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/vault%E9%83%A8%E7%BD%B2%E5%92%8C%E9%85%8D%E7%BD%AE%E4%B8%89/  

