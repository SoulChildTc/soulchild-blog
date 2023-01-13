# openssl-配置文件学习

<!--more-->
参考文档:
1.0.2版本: https://www.openssl.org/docs/man1.0.2/
1.1.1版本: https://www.openssl.org/docs/man1.1.1/
https://jianiau.blogspot.com/2015/07/openssl-generate-csr.html
书籍: OpenSSL与网络信息安全-基础、结构和指令

oid查询工具:
http://www.oid-info.com/

### 一、配置文件描述:
openssl的许多相关应用程序，使用配置文件来获取默认的配置项.配置文件路径`/etc/pki/tls/openssl.cnf`.

配置文件由若干个`[ section_name ]`组成，配置文件的第一部分是特殊的，称为默认部分。该部分是未命名的，范围从文件的第一行一直到第一个`[ section_name ]`。在查找配置项时，首先在`[ section_name ]`部分中查找，然后再到默认部分中查找。

部分子命令会有一个对应的section配置，比如`openssl req`对应`[ req ]`,`openssl ca`对应`[ ca ]`,具体内容可能是引用其他section


每个`[ section_name ]`下会有若干个配置项，它们以`name=value`的形式出现，name还可以作为变量使用,使用格式`$var`or`${var}`,但这仅限于再本`section`中使用。如果要引用其他`section`中的变量，可以使用`$section::name` or `${section::name}`。`$ENV::name`可以引用系统环境变量，如果系统环境变量中不存在会引用默认部分的变量。

name的value还可以指向`[ section_name ]`。

下面是个配置文件示例:
```bash
# 这里是默认部分
HOME                    = .
RANDFILE                = $ENV::HOME/.rnd
oid_section             = new_oids      # 这个是自定义oid的配置(个人理解)

# 这是一个section
[ new_oids ]
tsa_policy1 = 1.2.3.4.1
tsa_policy2 = 1.2.3.4.5.6
tsa_policy3 = 1.2.3.4.5.7

# 这是一个section
[ ca ]
default_ca      = CA_default # 指向`[ CA_default ]`这个section

# 这是一个section
[ CA_default ]
dir             = /etc/pki/CA
certs           = $dir/certs  # 使用$dir引用上面dir定义的值

```


### 二、证书请求(openssl req)相关配置
下面是`openssl req`的部分默认配置,命令行的参数优先级高于配置文件。req配置详细帮助可查看man手册`man req`
```bash
[ req ]
default_bits            = 2048  # 生成的密钥长度，对应参数-newkey rsa:nbits
default_md              = sha256  # 散列算法,对应参数-sha256
default_keyfile         = privkey.pem  # 默认的私钥文件名,对应参数-keyout

# prompt                = yes # 是否提示输入(交互式)

distinguished_name      = req_distinguished_name  # 使用req命令进行证书签名请求(csr)时，交互提问的内容和默认值。可以将默认是设成从环境变量获取。编写格式取决于prompt的值是yes还是no。man手册'DISTINGUISHED NAME AND ATTRIBUTE SECTION FORMAT'部分

attributes              = req_attributes  # 使用方法和distinguished_name一样，介绍暂时忽略

x509_extensions = v3_ca # 该字段定义了一系列要加入到证书中的扩展项(仅针对自签名证书)

# 这个默认是注释的，代表私钥密码
# input_password = secret   # 读取私钥时的密码
# output_password = secret  # 创建私钥时设置的密码

string_mask = utf8only  # 证书请求的信息字段的字符串类型,一般默认即可

# req_extensions = v3_req # 要添加到证书请求中的扩展项

...
```
> 证书扩展项配置在后面的x509v3_config中介绍

### 二、ca证书颁发(openssl ca)相关配置
ca是引用了CA_default的信息，主要包括 CA指令配置文件路径、 CA签发证书的限制和策略，以及指定CA扩展项字段。下面是默认的配置文件中摘出来的内容，完整内容可以查看`man ca`,在'CONFIGURATION FILE OPTIONS'部分
```bash
[ ca ]
default_ca      = CA_default            # 引用[ CA_default ]

####################################################################
[ CA_default ]

dir             = /etc/pki/CA           # 默认存在,CA管理的相关文件都放到这个文件夹里
certs           = $dir/certs            # 默认存在,可以将证书保存到这个目录，便于自己管理(非必须)
crl_dir         = $dir/crl              # 证书吊销列表的目录，作用类似上面的
database        = $dir/index.txt        # 索引数据库文件,记录了所有以颁发或吊销的证书信息。首次配置需要touch创建一个空文件
#unique_subject = no                    # 是否保证签发的证书subject唯一，默认yes，即subject完全相同的csr会签发失败
new_certs_dir   = $dir/newcerts         # openssl ca命令签发的证书默认存放路径

certificate     = $dir/cacert.pem       # CA证书文件路径
serial          = $dir/serial           # 签发证书时使用的序列号,内容是16进制格式。首次配置需要创建并添加内容00或其他可用序列号到文件
crlnumber       = $dir/crlnumber        # 吊销证书时使用的序列号,内容是16进制格式。首次配置需要创建并添加内容00或其他可用序列号到文件
crl             = $dir/crl.pem          # 证书吊销列表文件.
private_key     = $dir/private/cakey.pem# CA的私钥
RANDFILE        = $dir/private/.rand    # 随机数种子文件,用于生成密钥

x509_extensions = usr_cert              # 签发证书时附加的扩展项,如果没有扩展部分，则创建一个V1证书。如果扩展部分存在(即使它是空的)，则生成V3版本的证书。对应参数-extensions

# 签发证书的时候会显示csr的信息，下面的配置决定显示的格式,可用选项在man x509中NAME OPTIONS或Name Options部分查看
name_opt        = ca_default            # Subject Name options
cert_opt        = ca_default            # Certificate field options

# 将csr请求中包含的扩展想复制到签发的证书中。三个可选项
# 默认none忽略所有,不复制。
# copy: 仅复制csr请求的扩展项中我们没有定义的扩展项(配置文件中x509_extensions部分是我们定义的)
# copyall: 复制csr请求的所有扩展项，将会覆盖我们自己定义的扩展项
# copy_extensions = copy

# 生成证书吊销列表(crl)时加入的扩展项,如果没有提供扩展项,那么生成的CRL就是v1版本的
# crl_extensions        = crl_ext

default_days    = 365                   # 默认签发证书的有效期,对应参数-days
default_crl_days= 30                    # 距离下次证书吊销列表(crl)发布的时间间隔，单位天
# default_crl_hours=24                  # 距离下次证书吊销列表(crl)发布的时间间隔，单位小时
default_md      = sha256                # 证书签名使用的散列算法
preserve        = no                    # 设置DN的显示顺序,默认是根据下面的policy匹配策略决定的,如果设置为yes,将根据csr请求的保持一致。(DN就是Distinguished Name,使用openssl x509 -text -noout查看证书中的Issuer和Subject就是DN信息)

# 用于设置匹配DN名称策略的规则,不符合规则的csr请求会签发失败。有三种限制策略，如下
# match,该字段值必须与CA机构的证书中的字段完全匹配。
# supplied,代表必须添加的字段,内容不限
# optional,可选填写
policy          = policy_match

# 下面是两个自带的策略
[ policy_match ]
countryName             = match   # csr中countryName的内容必须和ca机构证书的内容完全一致
stateOrProvinceName     = match
organizationName        = match
organizationalUnitName  = optional
commonName              = supplied  # csr中commonName字段内容必须存在
emailAddress            = optional  # csr中emailAddress可有可无

[ policy_anything ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional
####################################################################
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2402/  

