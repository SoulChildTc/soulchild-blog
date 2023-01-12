# django-模型元选项

<!--more-->
https://docs.djangoproject.com/zh-hans/3.1/ref/models/options/

在定义模型类的时候有一些额外的选项可以使用,在模型类中定义`class Meta`即可：
```python
class AreaInfo(models.Model):
    """地区模型类"""
    # 地区名称
    atitle = models.CharField(max_length=20)

    # 关系属性, 表示当前地区的父级地区
    aParent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)  # 和自己关联

    class Meta:
        db_table = 'areainfo'  # 指定表名
        managed = False  # 告诉 Django 不要管理这个类对应的表的创建,修改和删除(migrate)

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2047/  

