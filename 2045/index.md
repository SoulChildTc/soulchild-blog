# django-模型自定义模型管理器

<!--more-->
1.在models.py中添加一个类
```python
class BookInfoManager(models.Manager):
    """自定义模型管理器"""

    # 1. 改变查询的结果集
    # 比如现在通过all方法是查询所有的结果,但是我们不想要is_delete=1的数据
    def all(self):
        """重新封装all方法"""
        # 1. 调用父类的all方法
        books = super().all()
        # 2. 过滤is_delete=1的数据
        books = books.exclude(is_delete=1)
        return books

    # 2. 添加额外的方法
        # 封装一个添加数据的方法
    def create_book(self, btitle, bpub_date, bread, bcomment):  # self是BookInfoManager实例化后的对象
        # book_obj = BookInfo()  # 类名写死了不好,用下面的方法
        print(self)  # self是BookInfoManager实例化后的对象
        print(self.model)  # self.model可以获取到调用的模型类名,<class 'booktest2.models.BookInfo'>
        book_obj = self.model()  # 加括号就可以实例化一个模型类对象
        book_obj.btitle = btitle
        book_obj.bpub_date = bpub_date
        book_obj.bread = bread
        book_obj.bcomment = bcomment
        book_obj.save()
        return self
```

2.修改模型类
```python
class BookInfo(models.Model):
    # 图书名称
    btitle = models.CharField(max_length=20)

    # 出版日期
    bpub_date = models.DateField()

    # 阅读量
    bread = models.IntegerField(default=0)

    # 评论量
    bcomment = models.IntegerField(default=0)

    # 删除标记
    is_delete = models.BooleanField(default=0)

    # 自定义管理器对象,替换继承的objects
    objects = BookInfoManager()

    def __str__(self):
        return self.btitle
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2045/  

