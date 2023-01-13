# harbor2.0.1安装部署

<!--more-->
## 一、下载安装包
```
wget https://github.com/goharbor/harbor/releases/download/v2.0.1/harbor-online-installer-v2.0.1.tgz
```

## 二、解压
`tar xf harbor-online-installer-v2.0.1.tgz -C /usr/local/`

## 三、配置https访问
1.创建目录
```
mkdir /data/harbor/cert -p
cd /data/harbor/cert
```
### 配置证书颁发机构
1.生成CA证书私钥
```
openssl genrsa -out ca.key 4096
```
2.生成CA证书
```
openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=Shanghai/L=Shanghai/O=soulchild/OU=myharbor/CN=registry.com" \
 -key ca.key \
 -out ca.crt
```
>字段含义：
>C:国家
>ST:省份
>L:城市
>O:组织单位
>OU:其他内容
>CN:一般填写域名

### 配置服务器证书
1. 生成私钥
```openssl genrsa -out registry.com.key 4096```
2.生成证书签名请求（CSR）
```
openssl req -sha512 -new \
    -subj "/C=CN/ST=Shanghai/L=Shanghai/O=soulchild/OU=myharbor/CN=registry.com" \
    -key registry.com.key \
    -out registry.com.csr
```

3. 生成x509 v3扩展文件
```
cat > v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1=registry.com
DNS.2=registry
DNS.3=harbor
EOF
```
4.使用v3.ext文件为Harbor主机生成证书
```
openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in registry.com.csr \
    -out registry.com.crt
```
### 提供证书给Harbor和Docker
`openssl x509 -inform PEM -in registry.com.crt -out registry.com.cert`

``` 
mkdir -p /etc/docker/certs.d/registry.com/
cp /data/harbor/cert/registry.com.crt /etc/docker/certs.d/registry.com/
```

## 四、配置harbor
修改如下配置
```
hostname: registry.com
https:
  # https port for harbor, default is 443
  port: 443
  # The path of cert and key files for nginx
  certificate: /data/harbor/cert/registry.com.crt
  private_key: /data/harbor/cert/registry.com.key
data_volume: /data/harbor
```

## 五、安装harbor
```
cd harbor/
./install.sh
```

## 六、访问
```
添加解析，修改hosts
10.0.0.50    registry.com
```
打开访问：https://registry.com/


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1874/  

