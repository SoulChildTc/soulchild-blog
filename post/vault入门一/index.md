# Vault入门(一)


<!--more-->

## 基本概念
- Vault的核心是一个服务器，它负责存储和加密数据，以及处理用户的请求。可以单机模式或集群模式运行

- Vault的数据是存储在一个持久化的后端中，它可以是本地文件系统、数据库、云存储等。

- Vault的用户可以通过命令行、api、或web ui 来与Vault交互。

- Vault的数据是以密文的形式存储在后端中，需要密钥才能解密。但是密钥本身又被一个主密钥（master key）加密，称为密封（seal）机制，解密密钥的过程称为解封（unseal）。Vault支持自动解封（auto-unseal）和手动解封（Shamir's Secret Sharing）。在Vault启动后，需要先执行解封操作，才能进行后续的使用。

- Vault的数据可以分为静态的（Static）或动态的（Dynamic）。静态的数据是由用户提供的，比如密码、证书等。动态的数据是由Vault根据用户的请求和配置来生成的，比如数据库凭证、云访问令牌等。动态的数据通常有一个有效期（TTL），过期后会被Vault自动收回（Revoke）。

- Vault的数据是通过不同的机密引擎（Secrets Engine）来存储和访问的，它们可以是通用的（KV）或专用的（AWS, MySQL, PKI等）。[其他存储引擎](https://developer.hashicorp.com/vault/docs/secrets)

- Vault的用户需要通过身份验证（Auth）来获取访问Vault的凭证（Token），以及通过授权（Policy）来获取访问Vault的权限（Capability）。身份验证可以是本地的（Token, Userpass）或外部的（LDAP, Okta, Kubernetes等）

## 一、安装
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install vault
```

## 二、开发模式启动Server
### 启动
在开发模式下，Vault在内存中运行并启动。不要在生产环境中运行dev模式
```bash
[root@mytest ~]# vault server -dev
==> Vault server configuration:

             Api Address: http://127.0.0.1:8200
                     Cgo: disabled
         Cluster Address: https://127.0.0.1:8201
   Environment Variables: GODEBUG, HISTCONTROL, HISTSIZE, HOME, HOSTNAME, LANG, LESSOPEN, LOGNAME, LS_COLORS, MAIL, PATH, PWD, SHELL, SHLVL, SSH_CLIENT, SSH_CONNECTION, SSH_TTY, TERM, USER, XDG_DATA_DIRS, XDG_RUNTIME_DIR, XDG_SESSION_ID, _
              Go Version: go1.19.4
              Listener 1: tcp (addr: "127.0.0.1:8200", cluster address: "127.0.0.1:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "disabled")
               Log Level: info
                   Mlock: supported: true, enabled: false
           Recovery Mode: false
                 Storage: inmem
                 Version: Vault v1.12.3, built 2023-02-02T09:07:27Z
             Version Sha: 209b3dd99fe8ca320340d08c70cff5f620261f9b

==> Vault server started! Log data will stream in below:
# ...snip...
WARNING! dev mode is enabled! In this mode, Vault runs entirely in-memory
and starts unsealed with a single unseal key. The root token is already
authenticated to the CLI, so you can immediately begin using Vault.

You may need to set the following environment variables:

    $ export VAULT_ADDR='http://127.0.0.1:8200'

The unseal key and root token are displayed below in case you want to
seal/unseal the Vault or re-authenticate.

Unseal Key: 8Ewx5xPvtY4cVrVOteAvp6ktfDVocHN6+yPAEXy1XFE=
Root Token: hvs.6oYAvQH1OczlvBwfjund3teu

Development mode should NOT be used in production installations!
```

### 设置环境变量
```bash
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN="hvs.6oYAvQH1OczlvBwfjund3teu"
```
> Unseal Key: 解封密钥,生产模式下很重要,开发模式暂时用不到
> 
> Root Token: 登录token
> 
> vault login <token_value> 也可以进行登录

### 查询运行状态
```bash
[root@mytest ~]# vault status
Key             Value
---             -----
Seal Type       shamir  # 密封类型，指定 Vault 的密封机制，例如使用 shamir、awskms、transit 等
Initialized     true    # 是否已经初始化，指示 Vault 是否已经初始化并配置好存储等参数。
Sealed          false   # 密封状态，false=已解封
Total Shares    1       # 用于解封密钥的分片数量
Threshold       1       # 使用多少个密钥可以解封
Version         1.12.3
Build Date      2023-02-02T09:07:27Z
Storage Type    inmem                                   # 后端存储为内存
Cluster Name    vault-cluster-da3febf4
Cluster ID      6c5611e2-2f6b-995e-f81d-fd5c60ba274c
HA Enabled      false
```

## 三、基本用法
KV存储引擎是一种通用的静态密码管理引擎，它可以让用户轻松地存储和访问敏感数据，如API Secret、证书、密码等。KV引擎使用版本控制机制，可以记录和跟踪历史上每个密码的变更和版本，同时还支持各种数据格式和多种访问控制策略。
kv存储引擎分为v1和v2两个版本，开发模式下默认是v2版本

### KV Version 1
Vault早期版本中默认的Key-Value Secrets Engine。它不支持数据版本管理，并且无法在现有数据上执行CAS操作。因此，对于需要版本管理或更高级别的数据访问控制的场景，KV Version 1可能不是最佳选择。但是，对于简单的数据存储和检索需求，KV Version 1仍然是一个很好的选择。

> CAS操作用于防止多个用户同时修改数据时,数据不一致的问题。假设你想要修改一个名为creds的secret key，它的当前版本是2。你可以使用-cas=2来指定你期望的版本号
> 
> 如果最新的secret key的版本是2，写入操作就会成功，secret key的版本就会变成3。但是，如果secret key的版本已经被别人改成了3或者更高，写入操作就会失败，你就会收到一个错误信息，告诉你密钥的版本不匹配。


可用功能: delete get list put

#### 实例化v1版本
```bash
# 启用并挂载到kv1路径
vault secrets enable -version=1 -description="KV Version 1" -path="kv1" kv

# 查看
vault secrets list

# 查看详细信息
vault secrets list --format=json | jq '.["kv1/"]'

# 禁用引擎,会删除这个引擎路径下的所有数据,慎重！！！
vault secrets disable "kv1/"
```
> kv1/更像是由kv引擎实例化出来的实例,他不代表引擎本身。

#### 增删查
```bash
# 写入,可以使用ttl=30参数表示过期时间,但vault不会自行删除数据,只能起到提示作用
# 注意put是覆盖,不是追加和修改
vault kv put kv1/myapp/config username=admin password=secretpassword

# 列表
vault kv list kv1/

# 读取
vault kv get kv1/myapp/config
vault kv get -format=json kv1/myapp/config
vault kv get -format=json -field=data kv1/myapp/config

# 删除
vault kv delete kv1/myapp/config
```


### KV Version 2
KV Version 2是Vault 0.10版本中引入的新版本Key-Value Secrets Engine。相比于KV Version 1, 它支持多个版本的数据, 允许CAS操作, 可以设置存储限制和数据过期时间, 并且支持复杂的访问策略。此外，KV Version 2还支持将数据版本存储在多个版本存储后端（Versioned Backend）中，以提高数据的可用性和可靠性。

> CAS操作用于防止多个用户同时修改数据时,数据不一致的问题。假设你想要修改一个名为creds的secret key，它的当前版本是2。你可以使用-cas=2来指定你期望的版本号
> 
> 如果最新的secret key的版本是2，写入操作就会成功，secret key的版本就会变成3。但是，如果secret key的版本已经被别人改成了3或者更高，写入操作就会失败，你就会收到一个错误信息，告诉你secret key的版本不匹配。

可用功能: 
- delete 
- destroy 
- enable-versioning 
- get 
- list 
- metadata 
- patch 
- put 
- rollback 
- undelete

#### 实例化v2版本
```bash
# 启用并挂载到kv2路径
vault secrets enable -version=2 -description="KV Version 2" -path="kv2" kv
# 或者vault secrets enable -description="KV Version 2" -path="kv2" kv-v2 

# 查看
vault secrets list

# 查看详细信息
vault secrets list --format=json | jq '.["kv2/"]'

# 禁用引擎,会删除这个引擎路径下的所有数据,慎重！！！
vault secrets disable "kv2"
```
> kv2/更像是由kv引擎实例化出来的实例,他不代表引擎本身。

#### v1升级到v2 - enable-versioning
vault支持将v1升级到v2,如果有需求可以使用下面的方式
```bash
vault kv enable-versioning kv1
```
> 注意: 如果你的v1配置了访问控制列表(ACL Rules),还需要修改他的api path, v1和v2使用了不同的api路径

> https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v2#acl-rules


#### 写入 - put
```bash
# 写入,官方建议第一种, 使用-mount指定根路径
vault kv put -mount=kv2 myapp/config username=admin password=secretpassword
or
# 我更喜欢第二种,不过需要注意kv2/myapp/config对应的api路径为kv2/data/myapp/config
vault kv put kv2/myapp/config username=admin password=secretpassword


# cas操作
# 我们期望写入版本为1的secret, 如果最新版本不是1，那么就不会修改成功。
vault kv put -cas=1 kv2/myapp/config foo=aa bar=bb
# -cas=0只有secret不存在时才会写入，可以防止覆盖已存在的secret
```

#### 列表 - list
```bash
vault kv list kv2/
```

#### 读取 - get
```bash
vault kv get kv2/myapp/config
vault kv get -format=json kv2/myapp/config
vault kv get -format=json -field=data kv2/myapp/config

# 获取指定的属性
vault kv get -field=foo kv2/myapp/config  ## aa

# 查看指定的版本
vault kv get -version=1 kv2/myapp/config
```

#### 补丁 - patch
通过patch可以完成部分修改
```bash
vault kv patch -cas=2 kv2/myapp/config bar=bbb

# -method=rw 代表先读取最新版的内容，然后在本地执行合并，最后执行覆写。这种方法不支持-cas,因为他会从服务器读取最新的版本号
vault kv patch -method=rw kv2/myapp/config bar=bbbb
```

#### 软删除 - delete
删除某个版本的数据,可以恢复。这里只是软删除某个版本,如果要彻底删除secret key, 需要使用`vault kv metadata delete`
```bash
# 删除最新版本, 版本号依然是存在的,只不过secret数据看不到了
# 后面再创建的话版本号还是会递增的, 不会使用这个被删除的
vault kv delete kv2/myapp/config

# 删除多个指定版本
vault kv delete -versions=1,2 kv2/myapp/config

vault kv get kv2/myapp/config
==== Secret Path ====
kv2/data/myapp/config

======= Metadata =======
Key                Value
---                -----
created_time       2023-02-15T14:30:24.221500782Z
custom_metadata    <nil>
deletion_time      2023-02-15T14:55:18.541629579Z
destroyed          false
version            8
```

#### 取消删除 - undelete
```bash
# 恢复软删除的版本
vault kv undelete -versions 8 kv2/myapp/config
```

#### 销毁数据 - destroy
销毁某个版本的数据,无法恢复。这里只是销毁某个版本, 如果要彻底删除secret key, 需要使用`vault kv metadata delete`.
```bash
# 删除最新版本, 版本号依然是存在的, 只不过secret数据看不到了, 并且destroyed的状态为true
# 后面再创建的话版本号还是会递增的, 不会使用这个被删除的
vault kv destroy -versions=8 kv2/myapp/config

# 删除多个指定版本
vault kv destroy -versions=3,4 kv2/myapp/config
```

#### 回滚 - rollback
```bash
# 回滚到指定版本,这将会创建一个新版本,他的内容和指定的版本一致
vault kv rollback -version 7 kv2/myapp/config
```

#### 元数据 - metadata
每个secret key都拥有一个对应的metadata, 用来设置这个secret key的属性(最大version、必须使用cas等)

##### 查看 - get
查看某个secret key的metadata的信息，这包含了他所有的版本信息和元数据
```bash
[root@mytest ~]# vault kv metadata get kv2/myapp/config
===== Metadata Path =====
kv2/metadata/myapp/config

========== Metadata ==========
Key                     Value
---                     -----
cas_required            false
created_time            2023-02-15T13:55:14.471446254Z
current_version         9
custom_metadata         <nil>
delete_version_after    0s
max_versions            0
oldest_version          0
updated_time            2023-02-15T15:05:28.648657534Z

====== Version 1 ======
# ...snip...
```

##### 设置属性
```bash
# 设置secret key最大历史版本数
# 修改完后还可以查询,如果重新put数据后, 再查最近2个之外的历史版本会提示 No value found at kv2/data/myapp/config
[root@mytest ~]# vault kv metadata put -max-versions 2 kv2/myapp/config

# 删除指定时间之前的版本, 也可以结合上面的命令一起使用
[root@mytest ~]# vault kv metadata put -delete-version-after="3h25m19s" kv2/myapp/config

# 其他的一些属性
# -cas-required=true 写入secret key时必须指定-cas参数
# -custom-metadata="creator=soulchild" 设置一些自定义的元数据信息

# 创建metadata, put也可以用来修改属性
[root@mytest ~]# vault kv metadata put -custom-metadata=owner=soulchild -custom-metadata=biz=arch kv2/myapp/config

# 删除整个secret key
vault kv metadata delete kv2/myapp/config
```


##### 补丁 - patch
虽然put能完成大部分的修改任务, 但是如果你想在custom_metadata中添加数据时,必须要将原来的数据也一同写进去,如果只写一个新增的数据将会把老数据覆盖, 这种情况使用patch就可以解决了。
```bash
# 添加一个blog=soulchild.cn
vault kv metadata patch -custom-metadata=blog=soulchild.cn kv2/myapp/config

# 查看结果
vault kv metadata get -format=json kv2/myapp/config
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/vault%E5%85%A5%E9%97%A8%E4%B8%80/  

