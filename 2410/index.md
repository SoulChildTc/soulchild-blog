# openssl-x509v3_config配置文件学习

<!--more-->
###官方文档:
证书扩展rfc 5280: https://datatracker.ietf.org/doc/html/rfc5280#section-4.2
openssl: https://www.openssl.org/docs/man1.0.2/man5/x509v3_config.html

###下面介绍几个扩展项
#### 1.basicConstraints
用于确定证书是否可以给其他人颁发证书,写法如下
```bash
basicConstraints=CA:TRUE   # 可以颁发

basicConstraints=CA:FALSE  # 不可以颁发

basicConstraints=critical,CA:TRUE, pathlen:0  # 将此扩展项设置为critical(关键),CA:TRUE表示允许给其他人签发证书,pathlen:0表示这个证书下可以有多少个CA机构，0代表没有,即只能颁发最终实体证书
```
** critical说明: **
> 如果遇到无法识别的关键扩展或包含无法处理的信息的关键扩展，则使用证书的系统必须拒绝该证书。

#### 2.Key Usage
指定证书中包含的密钥用途(例如，加密、签名、证书签名)。可选项: `digitalSignature`, `nonRepudiation(以后可能会叫contentCommitment)`, `keyEncipherment`, `dataEncipherment`, `keyAgreement`, `keyCertSign`, `cRLSign`, `encipherOnly`, `decipherOnly`

```bash
keyUsage=critical,digitalSignature,keyEncipherment  # 设置为关键扩展项,使用公钥进行数字签名和密钥加密,一般的https都是这样的配置
```

#### 3.Extended Key Usage
指定使用证书公钥的目的。
 `serverAuth`: SSL/TLS Web Server Authentication    # 服务端认证
 `clientAuth`: SSL/TLS Web Client Authentication    # 客户端认证
 `codeSigning`: Code signing  # 代码签名
 `emailProtection`: E-mail Protection (S/MIME)  # 邮件保护
 `timeStamping`: Trusted Timestamping  # 可信时间戳
 `OCSPSigning`: OCSP Signing  # OCSP签名

```bash
extendedKeyUsage = serverAuth, clientAuth  # 作为服务端认证和客户端认证使用
```
#### 4.Subject Key Identifier
当前证书的密钥标识符(SKID)
```bash
subjectKeyIdentifier = hash   # 自动获取当前证书hash值
```

#### 5.Authority Key Identifier
当前证书颁发者的证书的密钥标识符。

`keyid`: 尝试计算公钥哈希值(如果证书是自签名的)。或者从颁发者证书复制主题密钥标识符(SKID)。如果失败，并且指定了'always'选项，则返回一个错误。
`issuer`: 如果指定'always'选项，或者不存在密钥标识(keyid)，那么将从制颁发证书中复制"DN"和序列号。
> 上面属于强行解释，我也不太理解。
```bash
authorityKeyIdentifier = keyid, issuer

authorityKeyIdentifier = keyid, issuer:always
```

#### 6.Subject Alternative Name
主题备用名称
```bash
# email:copy，从DN中复制。
subjectAltName = email:copy, email:my@example.com, URI:http://my.example.com/

# ipv4
subjectAltName = IP:192.168.7.1
# ipv6
subjectAltName = IP:13::17

subjectAltName = email:my@example.com, RID:1.2.3.4

subjectAltName = otherName:1.2.3.4;UTF8:some other identifier

[extensions]
subjectAltName = dirName:dir_sect

[dir_sect]
C = UK
O = My Organization
OU = My Unit
CN = My Name
```

我在测试的时候的命令和配置:
```bash
openssl ca -in soulchild.com.csr  -extfile ext.cnf
```
ext.cnf内容:
```bash
subjectAltName=critical,DNS.1:it.soulchild.com,IP.1:127.0.0.1,email:copy,dirName:dir_sect
extendedKeyUsage=serverAuth
keyUsage=critical,digitalSignature,keyEncipherment
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid:always,issuer

[dir_sect]
C = UK
O = My Organization
OU = My Unit
CN = My Name
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2410/  

