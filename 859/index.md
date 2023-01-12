# SSL、TSL证书文件申请和自签证书

<!--more-->
<span style="color: #ff0000;"><strong>一、证书申请过程：</strong></span>

生成key和csr文件----&gt;通过csr文件向证书颁发机构(CA)申请crt文件

&nbsp;

<strong><span style="color: #ff0000;">二、生成key和csr文件：</span></strong>
<pre class="line-numbers" data-start="1"><code class="language-bash">创建目录
mkdir /server/cert -p
cd /server/cert

生成私钥和证书签署文件
openssl req -new -newkey rsa:2048 -sha256 -nodes -out test.com.csr -keyout test.com.key -subj "/C=CN/ST=beijing/L=beijing/O=test Inc./OU=Web Security/CN=test.com"
</code></pre>
&nbsp;

C字段：即Country，表示单位所在国家，为两位数的国家缩写，如CN表示中国

ST字段： State/Province，单位所在州或省

L字段： Locality，单位所在城市/或县区

O字段： Organization，此网站的单位名称

OU字段： Organization Unit，下属部门名称;也常常用于显示其他证书相关信息，如证书类型，证书产品名称或身份验证类型或验证内容等

CN字段：Common Name，网站的域名

&nbsp;

<span style="color: #ff0000;"><strong>三、申请证书文件</strong></span>

使用csr文件申请证书即可。

<strong>1、阿里云</strong>

https://common-buy.aliyun.com/?commodityCode=cas#/buy

<strong>2、腾讯云DV SSL 证书</strong>

https://cloud.tencent.com/product/ssl

&nbsp;

也可以<span style="color: #ff0000;"><strong>自己充当CA机构</strong></span>

操作如下：
<pre class="line-numbers" data-start="1"><code class="language-bash">创建目录
mkdir /server/ca -p
cd /server/ca

创建CA证书
openssl genrsa -out ca.key 2048

生成自签名证书（使用已有私钥ca.key自行签发根证书）
openssl req -x509 -new -nodes -key ca.key -days 10000 -out ca.crt -subj "/CN=my-ca"

根据csr生成证书文件（指定步骤二中生成的证书签署文件）
openssl x509 -req -in /server/cert/test.com.csr -CA ca.crt -CAkey ca.key -CAcreateserial -days 365 -out /server/cert/test.com.crt</code></pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/859/  

