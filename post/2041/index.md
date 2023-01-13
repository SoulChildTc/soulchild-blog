# django-模型聚合函数

<!--more-->
官方文档: https://docs.djangoproject.com/zh-hans/3.1/topics/db/aggregation/

## 聚合函数

作用：对查询结果进行聚合操作。将一列数据做为一个整体,进行纵向计算
sum count avg max min

使用前导入：
from django.db.models import Sum, Count, Avg, Max, Min

例：查询所有记录的总数目。
```
BookInfo.objects.all().aggregate(Count('id'))
{'id__count': 5}
```

例：查询所有图书阅读量的总和。
```
BookInfo.objects.aggregate(Sum('bread'))
{'bread__sum': 126}
```

例：查询记录的总数目,bread字段的最大值和最小值，还可以提供别名
```python
BookInfo.objects.aggregate(book_nums=Count('id'), read_height=Max('bread'), read_low=Min('bread'))

{'book_nums': 5, 'read_height': 58, 'read_low': 0}
```

例：查询is_delete字段为0的数目
```
# 可以配合filter等方法使用，先查出条件符合的记录,在做聚合
BookInfo.objects.filter(is_delete=0).aggregate(nums=Count('id'))
```

> 查询所有的时候all()可以省略


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2041/  

