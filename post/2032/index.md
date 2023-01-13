# django-模型查询函数

<!--more-->
通过模型类.objects属性可以调用如下函数
- `get`:
返回表中满足条件的一条且只能有一条数据。返回值是一个模型类对象。参数中写查询条件。
>1)如果查到多条数据，则抛异常MultipleObjectsReturned
>2)查询不到数据，则抛异常：DoesNotExist

- `all`: 返回模型类对应表的所有数据。返回值是QuerySet类型
<br>

- `filter`: 返回满足条件的数据。返回值是QuerySet类型
> 参数写查询条件。

- `exclude`: 返回不满足条件的数据。返回值是QuerySet类型
> 参数写查询条件。

- `order_by`: 对查询结果进行排序。返回值是QuerySet类型
> 参数中写根据哪些字段进行排序。


## all: 所有数据
```python
# BookInfo模型类对应表的所有数据
b = BookInfo.objects.all()
```

## filter:满足条件
```python
# 指定查询 __exact(可忽略) iexact:不区分大小写
b = BookInfo.objects.filter(id__exact=1)  # 这并不会查询，只有在调用的时候才会真正查询
b[0].btitle


# 模糊查询 __contains
# select * from booktest2_bookinfo where btitle like binray '%天%'
b = BookInfo.objects.filter(btitle__contains="天")    # btitle字段含天的记录
b = BookInfo.objects.filter(btitle__startswith='天')  # btitle字段以天开头的记录
b = BookInfo.objects.filter(btitle__endswith='部')    # btitle字段以部结尾的记录


# 比较查询 __gt,__lt,__gte,__lte
# select * from booktest2_bookinfo where id > 2
b = BookInfo.objects.filter(id__gt=2)  # id大于2的记录


# 范围查询 __in
# select * from booktest2_bookinfo where id in (1, 3, 5)
b = BookInfo.objects.filter(id__in=[1,3,5])  # id为1,3,5的记录


# 判空查询 __isnull
# select * from booktest_bookinfo where btitle is null;
b = BookInfo.objects.filter(btitle__isnull=True)  # 查询btitle字段为null的记录



# 日期查询__xxx
# 查找指定年月的记录
# select  * from booktest2_bookinfo where bpub_date between '1980-01-01' and '1980-12-31'
BookInfo.objects.filter(bpub_date__year=1980)  # bpub_date字段是1980年的记录

# select  * from booktest2_bookinfo where extract(month from bpub_date) = 5
BookInfo.objects.filter(bpub_date__month=5)  # bpub_date字段是5月的记录

# 日期比较
from datetime import date
# select  * from booktest2_bookinfo where bpub_date > '1980-01-01'
BookInfo.objects.filter(bpub_date__gt=date(1980,1,1))  # 大于1980年1月1日的记录

# select  * from booktest2_bookinfo where bpub_date >= '1986-7-24'
BookInfo.objects.filter(bpub_date__gte='1986-7-24')  # 大于等于1986年7月24日的记录

```

## exclude: 排除

```python
# 查询id不为3的记录
select * from booktest2_bookinfo where not id=3;
BookInfo.objects.exclude(id=3)
```

## order_by: 排序
```python
# 按照id从小到大排序
BookInfo.objects.all().order_by('id')
# 按照id从大到小排序
BookInfo.objects.all().order_by('-id')

# 可以基于上面几个方法进行排序
BookInfo.objects.filter(id__gt=2).order_by('id')  # 先查找id>2的记录，然后在根据id排序

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2032/  

