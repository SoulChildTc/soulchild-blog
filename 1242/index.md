# 查看证书过期时间

<!--more-->
主要选项：
-in filename          ： #指定证书输入文件，若同时指定了"-req"选项，则表示输入文件为证书请求文件。
-out filename        ： #指定输出文件
-md2|-md5|-sha1|-mdc2： #指定单向加密的算法。

查看证书选项：
-text                ：以text格式输出证书内容，即以最全格式输出，
：包括public key,signature algorithms,issuer和subject names,serial number以及any trust settings.
-certopt option：自定义要输出的项
-noout             ：禁止输出证书请求文件中的编码部分
-pubkey          ：输出证书中的公钥
-modulus        ：输出证书中公钥模块部分
-serial             ：输出证书的序列号
-subject          ：输出证书中的subject
-issuer           ：输出证书中的issuer，即颁发者的subject
-subject_hash：输出证书中subject的hash码
-issuer_hash  ：输出证书中issuer(即颁发者的subject)的hash码
-hash             ：等价于"-subject_hash"，但此项是为了向后兼容才提供的选项
-email            ：输出证书中的email地址，如果有email的话
-startdate       ：输出证书有效期的起始日期
-enddate       ：输出证书有效期的终止日期
-dates           ：输出证书有效期，等价于"startdate+enddate"
-fingerprint    ：输出指纹摘要信息

&nbsp;

查看指定文件证书：

openssl x509 -in apiserver.crt -text -noout


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1242/  

