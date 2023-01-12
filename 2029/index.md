# django-模型类常用字段类型

<!--more-->
https://docs.djangoproject.com/zh-hans/3.1/ref/models/fields/#field-options
## 字段类型
1. AutoField
自动增长的IntegerField，通常不用指定，不指定时Django会自动创建属性名为id的自动增长属性。

2. BooleanField
布尔字段，值为True或False。

3. NullBooleanField
支持Null、True、False三种值

4. CharField
字符串。参数max_length表示最大字符个数

5. TextField
大文本字段，一般超过4000个字符时使用。 

6. IntegerField
整数

7. DecimalField
十进制浮点数。参数max_digits表示总位数。参数decimal_places表示小数的位数。

8. FloatField
浮点数。参数同上。没有上面的精确度高

9. DateField
    日期
    1)auto_now表示每次保存时，自动设置该字段为当前时间，用于"最后一次修改"的时间戳，它总是使用当前日期，默认为false。
    2)auto_now_add表示当对象第一次被创建时自动设置当前时间，用于创建的时间戳，它总是使用当前日期，默认为false。
    3)auto_now_add和auto_now是相互排斥的，组合将会发生错误。只能二选一

10. TimeField
时间，参数同DateField

11. DateTimeField
日期时间，参数同DateField。

12. FileField
上传文件字段。

13. ImageField
继承于FileField，对上传的内容进行校验，确保是有效的图片。


## 字段属性
1. default	
默认值。设置默认值。

2. primary_key
若为True，则该字段会成为模型的主键字段，默认值是False，一般作为AutoField的选项使用。

3. unique
如果为True, 这个字段在表中必须有唯一值，默认值是False。

4. db_index
若值为True, 则在表中会为此字段创建索引，默认值是False。

5. db_column
字段的名称，如果未指定，则使用属性的名称。

6. null
如果为True，表示允许为空，默认值是False。

7. blank
如果为True，则该字段允许为空白，默认值是False。决定后台管理的表单输入框可否为空









---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2029/  

