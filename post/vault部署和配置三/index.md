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
IP.2 = 127.0.0.1
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

api_addr = "http://192.168.124.52:8200"
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
> listener "tcp" 配置监听, 需要保证每个节点的证书和key都一致
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

### 查看状态
```bash
[root@mytest ~]# vault status 
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
[root@mytest tls]# vault operator init -n 5 -t 3
Unseal Key 1: 8m3APoTpcqAA3V3jMjwV0azI9MWOARZz4g02Zyf1EPbc
Unseal Key 2: KeL9ASfo2qlFMOnO0j/0Jz8LC6lqd3x0sVSij4VuOsrZ
Unseal Key 3: H5N9D91VfGWcLMJoUrsYCgIOY7qxdP5We4E3BCAYoFUV
Unseal Key 4: 8CsI4yHv+BZZT1j72pbI/wUJ/0u+PlBi+eytEPKUlRkp
Unseal Key 5: /LIU4rtz8wTb2sqgp6ZImolkZk+GmWW8FeJV1f05jgmy

Initial Root Token: hvs.5oIpVYIiIW7TwbWCJ3DwTuNN

Vault initialized with 5 key shares and a key threshold of 3. Please securely
distribute the key shares printed above. When the Vault is re-sealed,
restarted, or stopped, you must supply at least 3 of these keys to unseal it
before it can start servicing requests.

Vault does not store the generated root key. Without at least 3 keys to
reconstruct the root key, Vault will remain permanently sealed!

It is possible to generate new unseal keys, provided you have a quorum of
existing unseal keys shares. See "vault operator rekey" for more information.
```
> -key-shares / -n : 生成5个密钥分片
>
> -key-threshold / -t : 最少需要3个才能解封
>
> 这个输出只会输出一次,所以需要把它记录到安全的地方

### 解封
每次启动vault都需要解封才可以使用
```bash
[root@mytest tls]# vault operator unseal # 第一个
Unseal Key (will be hidden): 
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       5
Threshold          3
Unseal Progress    1/3
Unseal Nonce       598c271f-65a6-b3b3-0a49-6f042faab413
Version            1.12.3
Build Date         2023-02-02T09:07:27Z
Storage Type       raft
HA Enabled         true
[root@mytest tls]# vault operator unseal # 第二个
Unseal Key (will be hidden): 
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       5
Threshold          3
Unseal Progress    2/3
Unseal Nonce       598c271f-65a6-b3b3-0a49-6f042faab413
Version            1.12.3
Build Date         2023-02-02T09:07:27Z
Storage Type       raft
HA Enabled         true
[root@mytest tls]# vault operator unseal # 第三个
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
Cluster Name            vault-cluster-fa36f0b7
Cluster ID              6b54e660-6f54-4b02-20db-5f74c2a6b9cf
HA Enabled              true
HA Cluster              n/a
HA Mode                 standby
Active Node Address     <none>
Raft Committed Index    32
Raft Applied Index      31
```

### 登录使用
```bash
[root@mytest tls]# vault login
Token (will be hidden): 
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                  Value
---                  -----
token                hvs.5oIpVYIiIW7TwbWCJ3DwTuNN
token_accessor       9bgGgBoWSs9W0uMDeW6zXzUX
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

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/vault%E9%83%A8%E7%BD%B2%E5%92%8C%E9%85%8D%E7%BD%AE%E4%B8%89/  

