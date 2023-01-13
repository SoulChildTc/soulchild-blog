# tesseract识别简单数字图片

<!--more-->
```yaml

#!/usr/bin/python
# -*- coding: UTF-8 -*-
"""
@author:soulchild
@file:ocr-code.py
@time:2021/08/26
"""
from PIL import Image
import requests
import pytesseract
import os

# 下载图片
header = {'user-agent': 'xxx'}
img = requests.get('https://xxx.xxx/f636a042.png', headers=header).content

# 保存图片
with open('resources/hotline.png', 'wb') as f:
    f.write(img)

# 图片灰度处理
im = Image.open('resources/hotline.png')
x, y = im.size
try:
    p = Image.new('RGBA', im.size, (0, 0, 0))
    p.paste(im, (0, 0, x, y), im)
    p.save('resources/hotline.png')
except:
    pass


im = Image.open('resources/hotline.png')
im = im.convert("L")
# im.save('resources/hotline.jpg')
res = pytesseract.image_to_string(im, config='--psm 6 -c tessedit_char_whitelist=1234567890')
print(res)

os.remove("resources/hotline.png")

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2644/  

