# django-模型类,基本操作

<!--more-->
## 定义
1.定义模型类：
```python
from django.db import models


# Create your models here.

# 定义一个模型类,表名BookInfo,继承models.Model
class BookInfo(models.Model):
    # # id字段,不写也可以，默认就会有id字段
    # id = models.AutoField(primary_key=True)

    # 图书名称字段。字符数据类型字段
    btitle = models.CharField(max_length=20, null=False)

    # 图书出版日期字段。
    bpub_date = models.DateField()


# 定义一个人物模型类,与图书类是一对多的关系
class HeroInfo(models.Model):
    # 人物姓名
    hname = models.CharField(max_length=20)

    # 人物性别
    hgender = models.BooleanField(default=False)

    # 备注
    hcomment = models.CharField(max_length=100)

    # 一本书对应多个人物,在人物这边加外键。关联BookInfo表的id字段
    hbook = models.ForeignKey('BookInfo', on_delete=models.SET_NULL, null=True, to_field="id")
```
> on_delete参数：
>>级联删除：models.CASCADE
>>当关联表中的数据删除时，该外键也删除

>>置空：models.SET_NULL
>>当关联表中的数据删除时，该外键置空，当然，你的这个外键字段得允许为空，null=True

>>设置默认值：models.SET_DEFAULT
>>删除的时候，外键字段设置为默认值，所以定义外键的时候注意加上一个默认值。

>to_field参数：
>>自定义关联表的id



2.生成迁移脚本
```bash
# 将模型类生成django识别的迁移脚本
python manage.py makemigrations
```

3.生成表
```bash
# 根据迁移脚本生成表
python manage.py migrate
```

每次修改模型类,需要重新生成迁移脚本,然后再生成表

## 操作
进入django shell `python manage.py shell`


```python
>>> from booktest.models import BookInfo

# 自己实例化一个书对象,然后插入数据
>>> b = BookInfo()
>>> b.btitle = '天龙八部'
>>> from datetime import date
>>> b.bpub_date = date(1990,1,1)
>>> b.save()

# 获取表中所有数据
b1 = BookInfo.objects.all()
b1[0].btitle

# 通过条件查找,查找的记录必须是唯一的。返回一个对象
b2 = BookInfo.objects.get(id=1)
# 使用这个对象可以进行读取、修改、删除等操作
b2.btitle
b2.delete()

```


** 通过人物获取书名 **
```
# 人物对象,插入数据
>>> h1 = HeroInfo()
>>> h1.hname = '虚竹'
>>> h1.hgender = False
>>> h1.hcomment = '和尚'
>>> h1.hbook_id = 1
>>> h1.save()

# 通过条件查找,查找的记录必须是唯一的。返回一个对象
h2 = HeroInfo.objects.get(id=1)
# 使用这个对象可以进行读取、修改、删除等操作
h2.hname

# 获取外键id
h2.hbook_id

# 当前人物关联的表的记录(返回对象)
h2.hbook

# 获取人物对应的书名
h2.hbook.btitle
```

** 通过书名获取人物信息 **
```python
b = BookInfo.objects.get(id=1)
# 返回关联的所有人物对象
b.heroinfo_set.all()
```













---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2024/  

