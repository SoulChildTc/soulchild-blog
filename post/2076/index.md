# scrapy-环境安装+基本配置

<!--more-->
## 1.安装
```bash
pip install scrapy
```


## 2.创建项目
```
scrapy startproject 项目名称
```
>例: `scrapy startproject firstBlood`

### 2.1目录结构
```bash
firstBlood/
├── firstBlood
│   ├── __init__.py
│   ├── items.py
│   ├── middlewares.py
│   ├── pipelines.py
│   ├── settings.py
│   └── spiders            # 爬虫文件存放目录
│       └── __init__.py
└── scrapy.cfg
```

## 3.生成爬虫文件
进入项目目录 `cd firstBlood`

```python
scrapy genspider 爬虫名称 起始url
```
>例: `scrapy genspider first www.soulchild.cn`

创建后的文件在`firstBlood/spiders/first.py`目录

## 4.运行爬虫
```python
scrapy crawl 爬虫名称
```
>例: `scrapy crawl first`


## 配置修改
`settings.py`
```python

USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'

ROBOTSTXT_OBEY = False

LOG_LEVEL = 'ERROR'
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2076/  

