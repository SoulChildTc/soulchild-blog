# Pyotp实现命令行查看2FA


<!--more-->

```python
#!/usr/bin/env python3
import time
import sys
from datetime import datetime

import pyotp
from wasabi import msg


"""
accounts 为账户列表，支持两种格式：
1. name、issuer、totpSecret 必填
2. 使用uri: url 必填(需要包含name和issuer)
"""

accounts = [
    {
        "totpSecret": "xxxxxxxxxxxxxxxxx", # 密钥
        "isShow": False, # 是否显示
        "name": "myaccount", # 名称
        "issuer": "myissuer", # 发行者
        "algorithm": "ALGO_SHA1", # 保留字段, 可空
        "secret": "xxxxx", # 保留字段, 可空
        "digits": 1, # 保留字段, 可空
        "type": "OTP_TOTP", # 保留字段, 可空

    },
    {
        "uri": "otpauth://totp/名称?secret=xxxxxxxxxxxxxxxxx&issuer=发布者",
    }
]


def get_code(totp_secret: str):
    totp = pyotp.TOTP(totp_secret)
    return totp.now()


def echo_code(c: str):
    sec = datetime.now().second
    if 0 <= sec < 20 or 30 <= sec < 50:
        msg.good(c)
    elif 20 <= sec < 25 or 50 <= sec < 55:
        msg.warn(c)
    else:
        msg.fail(c)

    print()


def main():
    for account in accounts:
        is_show = account.get("isShow")
        if not (is_show or is_show is None):
            continue

        uri = account.get("uri")
        if uri:
            totp_obj = pyotp.parse_uri(uri)
            totp_secret = totp_obj.secret
            name = totp_obj.name
            issuer = totp_obj.issuer
        else:
            totp_secret = account["totpSecret"]
            name = account.get("name")
            issuer = account.get("issuer")

        title = "%s:%s" % (issuer, name)
        if len(sys.argv) == 1:
            print(title)
            echo_code(get_code(totp_secret))

        elif title.lower().find(sys.argv[1].lower()) != -1:
            print(title)
            echo_code(get_code(totp_secret))


if __name__ == '__main__':
    main()
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/729592950/  

