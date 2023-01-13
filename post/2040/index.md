# django-模型查询函数F&amp;Q对象,多条件查询

<!--more-->
## Q对象`~`、`&`、`|`查询
作用：用于多个条件的查询

使用之前需要先导入：
from django.db.models import Q

例：查询id字段大于3`和`bread字段大于30的记录
```
# 默认指定多个参数就是和的意思
# select * from booktest2_bookinfo where bread>30 and id >3
BookInfo.objects.filter(id__gt=3, bread__gt=30)

# 使用Q对象的方式
# select * from booktest2_bookinfo where bread>30 and id >3
BookInfo.objects.filter(Q(id__gt=3) & Q(bread__gt=30))
```

例：查询id字段大于3`或`bread字段大于30的记录
```
# select * from booktest2_bookinfo where bread>30 or id >3
BookInfo.objects.filter(Q(id__gt=3) | Q(bread__gt=30))
```

例：查询id不等于3图书的信息。
```
select * from booktest2_bookinfo where not id=3;
BookInfo.objects.filter(~ Q(id=3))
```


## F对象（比较查询）
作用：用于字段之间的比较。

使用之前需要先导入：
from django.db.models import F

例：查询bread字段大于bcomment字段的记录
```
BookInfo.objects.filter(bread__gt=F('bcomment'))
```

例：查询bread字段大于bcomment字段2倍的记录
```
BookInfo.objects.filter(bread__gt=F('bcomment')*2)
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2040/  

