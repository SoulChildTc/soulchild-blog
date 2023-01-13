# python-三元表达式、列表字典集合推导式、生成器表达式

<!--more-->
## 1.三元表达式:
if成立返回左边的值(1)，不成立返回右边的值(0)
```python
x = "\n"
print(1 if x == "\n" else 0)

Out: 1
```

## 2.列表推导式
```python
nums = [i for i in range(0, 10)]
print(nums)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

nums = [i for i in range(0, 10) if i > 5]
print(nums)
[6, 7, 8, 9]

nums = [(i, k) for i in range(0, 2) for k in range(1, 4)]
print(nums)
[(0, 1), (0, 2), (0, 3), (1, 1), (1, 2), (1, 3)]
```

## 3.集合推导式
集合和字典一样,把`[]`换成`{}`
```python
nums = {i for i in range(0, 10)}
print(nums)
{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}

nums = {i for i in range(0, 10) if i > 5}
print(nums)
{8, 9, 6, 7}

nums = {(i, k) for i in range(0, 2) for k in range(1, 4)}
print(nums)
{(0, 1), (1, 2), (1, 3), (0, 2), (0, 3), (1, 1)}
```

## 4.字典推导式
```python
nums = {i + 1: i for i in range(0, 10)}
print(nums)
{1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9}

nums = {i + 1: i for i in range(0, 10) if i > 5}
print(nums)
{7: 6, 8: 7, 9: 8, 10: 9}
```

## 5. 生成器表达式
使用括号表示，结果返回一个生成器对象
```python
nums = (i for i in range(0, 100))
print(nums)
<generator object <genexpr> at 0x10a90af68>
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1974/  

