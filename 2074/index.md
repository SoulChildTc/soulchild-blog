# BeautifulSoup-基础

<!--more-->
安装模块
```bash
pip install bs4 lxml
```


```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
"""
@author:soulchild
@file:bs4_learn.py
@time:2020/11/16
"""

from bs4 import BeautifulSoup
import requests

if __name__ == '__main__':
    # 一、加载本地html文件
    # fp = open('./xxx.html', 'r', encoding='utf-8')
    # soup = BeautifulSoup(fp, 'lxml')

    # 二、加载网络资源
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36"}
    resp = requests.get('https://soulchild.cn', headers=headers).content.decode('utf-8')
    soup = BeautifulSoup(resp, 'lxml')

    # 查找标签##################################################################################
    # 打印第一个a标签
    print(soup.a)  # soup.xxx  xxx代表html标签名

    # 按照属性查找
    print(soup.find('a', class_='current'))
    print(soup.find('a', id='logo'))
    print(soup.find('a', href='https://soulchild.cn/'))

    # 查找所有a标签
    print(soup.find_all('a'))

    # 使用html选择器来选择标签
    print('---------', soup.select('#logo'))
    print('---------', soup.select('.col-mb-12 h2'))
    


    #获取内容##################################################################################
    # 获取标签中的文本数据
    print('*' * 50)
    print(soup.find('a', class_='current').get_text())
    print(soup.find('a', class_='current').text)
    print(soup.find('a', class_='current').string)  # 只能获取标签本身的文本数据,子标签的不会获取

    # 获取标签的属性值
    print(soup.find('a', class_='current')['href'])








```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2074/  

