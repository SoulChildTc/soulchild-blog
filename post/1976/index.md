# python-lambda匿名函数

<!--more-->
## lambda匿名函数:
一般用于将自身做为参数传递给另一个函数

### 语法:
`lambda 参数:返回值`

### 1.计算一个列表中每个元素的平方
```python
x = list(map(lambda n: n ** 2, [i for i in range(10)]))
print(x)
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

### 2.多个参数的时候
```python
x = list(map(lambda n, z: n ** 2 + z, [i for i in range(10)], [1, 2, 3]))
print(x)
[1, 3, 7]
```

> map参数1指定一个函数，后面的其他参数为可迭代对象。可迭代对象的每个元素会做为参数传递给参数1指定的函数。后面可以指定多个可迭代对象，每个可迭代对象会有个映射关系
> 上面的函数中range(10)：[0,1,2,3,4,5,6,7,8,9]和[1,2,3]的映射关系就是(0,1),(1,2),(2,3)
> 分三次执行lambda函数。前面的值就是n，后面的值就是z
相当于0 \*\* 2 + 1----> 1 \*\* 2 + 2 ---->2 \*\* 2 + 3

可以看下下面这个例子：
```python
x = list(map(lambda n, z: (n, z), ["a", "b", "c"], [1, 2, 3]))
print(x)
[('a', 1), ('b', 2), ('c', 3)]
```

### 3.按照指定的元素进行列表排序
```python
info = [{"name": "jack", "age": 18}, {"name": "soul", "age": 16}, {"name": "tony", "age": 20}]
info.sort(key=lambda x: x['age'])
print(info)
[{'name': 'soul', 'age': 16}, {'name': 'jack', 'age': 18}, {'name': 'tony', 'age': 20}]
```

### 4.列表过过滤

```python
ages = [87, 71, 12, 18, 1, 24, 68, 10]
print(list(filter(lambda x: x > 12, ages)))
[87, 71, 18, 24, 68]
```
> filter参数1指定一个函数，参数2：可迭代对象。可迭代对象的每个元素会做为参数传递给参数1指定的函数，参数1的函数返回值为True时,就保留这个元素，否则会丢弃。







---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1976/  

