# 腾讯云cos对象存储python SDK使用

<!--more-->
```python
pip install -U cos-python-sdk-v5
```

初始化代码
```python
# -*- coding=utf-8
# appid 已在配置中移除,请在参数 Bucket 中带上 appid。Bucket 由 BucketName-APPID 组成
# 1. 设置用户配置, 包括 secretId，secretKey 以及 Region
from qcloud_cos import CosConfig
from qcloud_cos import CosS3Client
import sys
import logging

logging.basicConfig(level=logging.INFO, stream=sys.stdout)

secret_id = 'COS_SECRETID'      # 替换为用户的 secretId
secret_key = 'COS_SECRETKEY'      # 替换为用户的 secretKey
region = 'ap-shanghai'     # 替换为用户的 Region
token = None                # 使用临时密钥需要传入 Token，默认为空，可不填
scheme = 'https'            # 指定使用 http/https 协议来访问 COS，默认为 https，可不填
config = CosConfig(Region=region, SecretId=secret_id, SecretKey=secret_key, Token=token, Scheme=scheme)
# 2. 获取客户端对象
client = CosS3Client(config)
```

桶操作
```python
# 创建桶(<bucketname>-<appid>)
response = client.create_bucket(
    Bucket='examplebucket-1250000000'
)

# 查看桶
response = client.list_buckets()
```

上传对象
```python
#### 文件流简单上传（不支持超过5G的文件，推荐使用下方高级上传接口）
# 强烈建议您以二进制模式(binary mode)打开文件,否则可能会导致错误



#######################################################################################
# 字节流上传
with open('picture.jpg', 'rb') as fp:
    # 通过客户端对象,put_object方法上传文件
    response = client.put_object(
        Bucket='examplebucket-1250000000',   # 桶名称
        Body=fp,                             # 上传的内容-bytes类型
        Key='picture.jpg',                   # 桶中的文件名相对路径         
        EnableMD5=False                      # 计算md5
    )

# 获取上传响应
print(response['ETag'])

#######################################################################################
import requests
stream = requests.get('https://cloud.tencent.com/document/product/436/7778')

# 网络流将以 Transfer-Encoding:chunked 的方式传输到 COS
response = client.put_object(
    Bucket='examplebucket-1250000000',
    Body=stream,
    Key='picture.jpg'
)
print(response['ETag'])

#######################################################################################

#### 高级上传接口（推荐）
# 根据文件大小自动选择简单上传或分块上传，分块上传具备断点续传功能。
response = client.upload_file(
    Bucket='examplebucket-1250000000',        # 桶名称
    LocalFilePath='local.txt',                # 本地文件路径
    Key='picture.jpg',                        # 桶中的文件名相对路径
    PartSize=1,                               # 分块下载的分块大小，默认为20MB
    MAXThread=10,                             # 分块下载的并发数量，默认为5个线程下载分块
    EnableMD5=False                           # 计算md5
)
print(response['ETag'])
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2062/  

