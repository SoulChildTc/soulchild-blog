# selenium入门

<!--more-->
## 一、下载配置driver
https://npm.taobao.org/mirrors/chromedriver/83.0.4103.39/
解压后移动到下面目录
mv chromedriver /usr/local/bin/

## 二、安装selenium
`pip install selenium`

## 三、简单使用
```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-
"""
@author:soulchild
@file:selenium_learn.py
@time:2020/11/26
"""

from selenium import webdriver
import time

# 实例化driver对象
driver = webdriver.Chrome()  # 如果没有配置环境变量,可以用executable_path指定浏览器驱动文件路径

# 打开浏览器发送请求
driver.get("http://soulchild.cn")

# 获取输入框元素
search_element = driver.find_element_by_id('search').find_element_by_tag_name('input')

# 向元素发送内容
search_element.send_keys('docker')

# 点击搜索
# driver.find_element_by_id('search').find_element_by_id('stss').click()
driver.execute_script("document.getElementById('stss').click()")


# 其他操作
# driver.page_source 当前标签页浏览器渲染之后的网页源代码
# driver.current_url 当前标签页的url
# driver.title 当前标签页标题
# driver.close() 关闭当前标签页，如果只有一个标签页则关闭整个浏览器
# driver.quit() 关闭浏览器
# driver.forward() 页面前进
# driver.back() 页面后退
# driver.save_screenshot('img_name') 页面截图
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2085/  

