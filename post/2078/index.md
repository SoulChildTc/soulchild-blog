# scrapy-命令行持久化数据到本地

<!--more-->
```python
import scrapy


class FirstSpider(scrapy.Spider):
    name = 'first'

    # allowed_domains = ['www.soulchild.cn']
    start_urls = ['http://www.qiushibaike.com/text']

    def parse(self, response):
        div_list = response.xpath('//div[contains(@class,"article") and contains(@class,"mb15")]')
        all_data = []
        for i in div_list:
            author = i.xpath('./div[@class="author clearfix"]//h2/text()')[0].get()
            content = ''.join(i.xpath('.//div[@class="content"]/span//text()').getall())
            res = {
                "author": author,
                "content": content,
            }
            all_data.append(res)
        return all_data
```

将parse方法的返回值输出到本地csv文件中
```bash
scrapy crawl first -o qs.csv
```


支持的格式：
`'json', 'jsonlines', 'jl', 'csv', 'xml', 'marshal', 'pickle'`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2078/  

