# Vault认证和授权(二)


<!--more-->

## 基本概念

在客户端可以与 Vault 交互之前，它必须根据 `auth method` 进行身份验证。身份验证后，将生成`access token`, 后续的请求使用的是生成的`access token`。

在Vault中，`access token` 的权限是通过策略（Policy）来管理的。[相关文档](https://developer.hashicorp.com/vault/docs/concepts/policies)

Vault 支持多种身份`auth method`，包括 GitHub、LDAP、AppRole [等](https://developer.hashicorp.com/vault/docs/auth)。


## 策略
策略就是控制哪些路径可以被如何访问

- `path` 路径前缀, *代表多级路径，+代表1级
  - `capabilities` [代表允许的功能](https://developer.hashicorp.com/vault/docs/concepts/policies#capabilities)
    - create(POST/PUT) 允许在给定路径创建数据。
    - read(GET) 允许读取给定路径的数据。
    - update(POST/PUT) 允许更改给定路径的数据。包括在路径上创建初始值。
    - patch(PATCH) 允许对给定路径上的数据进行部分更新。
    - delete(DELETE) 允许删除给定路径上的数据。
    - list 允许在给定路径上列出值。
    - sudo 允许特殊权限, 比如启用和禁用auth method
    - deny 不允许访问。始终优先于任何其他已定义的功能，包括sudo。
    - 至于需要用哪个权限,最好根据API的http method判断。https://developer.hashicorp.com/vault/api-docs/system/capabilities
  - `required_parameters` 定义哪些参数必须在请求中使用, 具体有哪些参数取决于你的API PATH, 需要查看对应的api文档，例如这是[用户密码认证的](https://developer.hashicorp.com/vault/api-docs/auth/userpass#parameters)
  - `allowed_parameters` 定义哪些参数允许在请求中使用, 具体有哪些参数,请查看required_parameters说明。例如：allowed_parameters = { "password" = [] } 表示允许使用名为"password"的参数
  - `denied_parameters` 定义哪些参数不允许在请求中使用。具体有哪些参数,请查看required_parameters说明。例如：deny = { "password" = [] }，表示不允许使用名为 "password" 的参数。优先于allow
  - `min_wrapping_ttl` 限制临时access token过期时间的最小边界
  - `max_wrapping_ttl` 限制临时access token过期时间的最大边界
  - `metadata` 可以将自定义的键值对存储在 ACL 中，以便其他系统可以查询和使用

### 策略模板

可以实现动态的path,有兴趣可以看下官网

https://developer.hashicorp.com/vault/docs/concepts/policies#parameters


### 内置策略
内置策略有两个，分别是default和root

#### default
default策略默认会附加在所有的 token 上，可以在 token 创建时显式地排除它(-no-default-policy), default策略是可以修改的。

查看默认策略的配置
```bash
[root@mytest ~]# vault read sys/policy/default
Key      Value
---      -----
name     default
rules    
# 允许查看自身token信息
path "auth/token/lookup-self" {
    capabilities = ["read"]
}

# 允许续订自己的token过期时间
path "auth/token/renew-self" {
    capabilities = ["update"]
}

# 允许自己删除自己
path "auth/token/revoke-self" {
    capabilities = ["update"]
}

# 允许查看自己对哪些路径有权限(这个api只支持POST,所以不能用read)
path "sys/capabilities-self" {
    capabilities = ["update"]
}

# 允许token按id或名称查找其自己的实体, {{identity.entity.id}}代表当前实体的id
path "identity/entity/id/{{identity.entity.id}}" {
  capabilities = ["read"]
}
path "identity/entity/name/{{identity.entity.name}}" {
  capabilities = ["read"]
}

...
```

#### root
root策略无法修改或删除。与此策略关联的任何用户都将成为root用户。 root 用户可以在 Vault 中执行任何操作。因此，强烈建议您在生产中运行 Vault 之前撤销所有根令牌。
root token 是用来给我们初始化配置用的, 配置完后应撤销初始root token，并使用更严格的用户和身份验证控制方法
```bash
# 撤销token
vault token revoke "<token>"
```

### 管理策略
策略可以用HCL或JSON编写，策略必须上传到Vault才能使用, 可以使用api或cli。
```bash
# 创建策略, 下面两个命令二选一
vault policy write policy-name policy-file.hcl
vault write sys/policy/policy-name policy-file.hcl

# 更新策略和创建一样。下面两个命令二选一
vault policy write policy-name policy-file.hcl
vault write sys/policy/policy-name policy-file.hcl

# 查看策略
vault policy read policy-name

# 删除策略
vault delete sys/policy/policy-name
```

### 自定义策略
常见用法:
```bash
# 限制secret/*, 允许以下操作
path "secret/*" {
  capabilities = ["create", "read", "update", "patch", "delete", "list"]
}

# 上面使用了secret/*,这里可以单独配置某一个路径。这个优先
path "secret/super-secret" {
  capabilities = ["deny"]
}

# secret/restricted下的secret key只能包含key为foo或者bar, bar的值只能是zip和zap
path "secret/restricted" {
  capabilities = ["create"]
  allowed_parameters = {
    "foo" = []   # 
    "bar" = ["zip", "zap"]
  }
}
```

定义一个只能读取kv2/app1/路径下的策略,给后面的认证用
```bash
[root@mytest ~]# vault policy write app1-readonly - <<EOF
path "kv2/data/app1/*" {
  capabilities = ["read"]
}
EOF

# 添加测试数据
[root@mytest ~]# vault kv put kv2/app1/config foo=bar
```

### 用户和策略关联
请查看下面的认证部分

## 认证

支持的认证后端: https://developer.hashicorp.com/vault/docs/auth

### token认证
#### 创建token和绑定策略
```bash
# 查看当前启动的认证后端
vault auth list

# 创建token
[root@mytest ~]# vault token create
Key                  Value
---                  -----
token                hvs.mX0vE0jL424CgD9tbfCH3Nv2
token_accessor       iGYJzEq25no6PJO8gTETYGn8
token_duration       ∞
token_renewable      false
token_policies       ["root"]
identity_policies    []
policies             ["root"]

# 撤销token
[root@mytest ~]# vault token revoke hvs.mX0vE0jL424CgD9tbfCH3Nv2
Success! Revoked token (if it existed)

# 创建token同时指定policy, 策略创建请查看上面自定义策略部分
# token是不能修改的,所以不能给已存在的token分配策略
[root@mytest ~]# vault token create -policy=app1-readonly
Key                  Value
---                  -----
token                hvs.CAESIGz1qM4DYCuFUkO5LHItEiYKVx-UywmZXqlaLzkdv493Gh4KHGh2cy45TTJDYUxxaVlsR3VQeloySVp0M0VFd3I
token_accessor       sD1gQPP25pQQkj6L3AWhu10x
token_duration       768h
token_renewable      true
token_policies       ["app1-readonly" "default"]
identity_policies    []
policies             ["app1-readonly" "default"]

# 测试查看权限, 重新开个终端
[root@mytest ~]# VAULT_TOKEN="hvs.CAESIGz1qM4DYCuFUkO5LHItEiYKVx-UywmZXqlaLzkdv493Gh4KHGh2cy45TTJDYUxxaVlsR3VQeloySVp0M0VFd3I" && VAULT_ADDR=http://127.0.0.1:8200
# 查看没有权限路径
[root@mytest ~]# vault kv get kv2/myapp/config
Error reading kv2/data/myapp/config: Error making API request.

URL: GET http://127.0.0.1:8200/v1/kv2/data/myapp/config
Code: 403. Errors:

* 1 error occurred:
        * permission denied

# 查看有权限的路由
[root@mytest ~]# vault kv get kv2/app1/config
==== Secret Path ====
kv2/data/app1/config

======= Metadata =======
Key                Value
---                -----
created_time       2023-02-16T12:42:12.935269661Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

=== Data ===
Key    Value
---    -----
foo    bar
```
#### 常见操作
`vault token create`: 创建新的 token。可以指定 token id、 类型、有效期、附加策略等选项。
`vault token lookup`: 查找指定 token 的详细信息,默认是当前用户的token信息。
`vault token renew`: 续期指定 token 的有效期。只有 root token 或者拥有续期权限的 token 才能使用该命令。
`vault token revoke`: 撤销指定 token，使其失效。只有 root token 或者拥有撤销权限的 token 才能使用该命令。
`vault token capabilities`: 查看 token 的权限。

参数文档https://developer.hashicorp.com/vault/docs/commands/token/create#command-options



### userpass认证

#### 创建用户和绑定策略
```bash
# 查看当前启动的认证后端
vault auth list

# 启用userpass认证后端
vault auth enable userpass

# 创建用户
vault write auth/userpass/users/user01 password=123 policies=app1-readonly

# 使用用户名密码登录
unset VAULT_TOKEN
vault login -method=userpass username=user01 password=123

# 修改策略
vault write auth/userpass/users/user01 policies=test 
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/vault%E8%AE%A4%E8%AF%81%E5%92%8C%E6%8E%88%E6%9D%83%E4%BA%8C/  

