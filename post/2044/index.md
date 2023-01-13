# django-模型关联查询

<!--more-->
## 关联查询（一对多）
多类中定义的建立关联的类属性叫做【关联属性】

定义模型类
```python
# 定义一个模型类，继承models.Model
class BookInfo(models.Model):
    # # id字段,不写也可以，默认就会有id字段
    # id = models.AutoField(primary_key=True)

    # 图书名称字段。字符数据类型字段，最大长度20
    btitle = models.CharField(max_length=20, null=False)
    # 图书出版日期字段。
    bpub_date = models.DateField()

    def __str__(self):
        return self.btitle


# 定义一个人物模型类,与图书类是一对多的关系
class HeroInfo(models.Model):
    # 人物姓名
    hname = models.CharField(max_length=20)

    # 人物性别
    hgender = models.BooleanField(default=False)

    # 备注
    hcomment = models.CharField(max_length=100)

    # 一本书对应多个人物,在人物这边加外键。关联BookInfo表
    hbook = models.ForeignKey('BookInfo', on_delete=models.SET_NULL, null=True, to_field="id")

    def __str__(self):
        return self.hname
```


导入模型类：
from app1.moldels import BookInfo,HeroInfo

** 例1：查询`id为1的图书`关联的英雄的信息。**

通过对象查询
```
# 先查询id=1的图书
b = BookInfo.objects.get(id=1)

# 查询关联的英雄
# select * from booktest2_heroinfo where hbook_id = 1
b.heroinfo_set.all()
```

通过模型类查询：
```
# hbook是关联属性
HeroInfo.objects.filter(hbook__id=1)
```

** 例2：查询`id为10的英雄`关联的图书信息。 **
```
# 先查询id=10的英雄
h = HeroInfo.objects.get(id=10)

# 在查询关联的图书
# select * from booktest2_bookinfo where id = 3   # h.hbook_id是3
h.hbook

```

例2: 通过模型类查询
```
最终的结果是谁就写那个模型类,多对一的关系中,如果这边是一的话，就使用类名小写+字段+比较类型 做为条件
BookInfo.objects.filter(heroinfo__id=10)
```


----------


例1：查询图书信息，要求图书关联的`英雄的描述包含'八'`

最终的结果是谁就写那个模型类,多对一的关系中,如果这边是一的话，就使用类名小写+字段+比较类型 做为条件
`BookInfo.objects.filter(heroinfo__hcomment__contains='八')`

例2：查询图书信息，要求图书中的英雄的id大于3.
`BookInfo.objects.filter(heroinfo__id__gt=3)`


例3：查询书名为“天龙八部”的所有英雄。
HeroInfo模型类有关联属性，就用关联属性hbook查询
`HeroInfo.objects.filter(hbook__btitle='天龙八部')`



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2044/  

