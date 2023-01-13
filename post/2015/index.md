# django-模板基本操作

<!--more-->
## 1.变量
```
普通变量: x = 'ok'
{{ x }}

字典:d1 = {"name": "zs"}
{{ d1.name }}


列表: l1 = [0,1,2,3,4]
{{ l1.0 }}

```

## 2.if判断
```
<!-- 也可以if in xxx-->
{% if score < 60 %}
    <p>成绩不及格</p>
{% elif score == 60 %}
    <p>刚刚及格</p>
{% else %}
    <p>成绩及格</p>
{% endif %}
```

## 3.for循环
```
<ul>
    {% for i in l1 %}
        <li>{{ i }}</li>
    {% endfor %}
</ul>

<!-- 反向遍历 -->
<ul>
    {% for i in l1 reversed %}  
        <li>{{ i }}</li>
    {% endfor %}
</ul>

<!-- empty -->
<ul>
    {% for i in l1 %}  
        <li>{{ i }}</li>
    {% empty %}
        <li>l1没有内容</li>
    {% endfor %}
</ul>
```
> {{ forloop.counter }}:当前循环的计数，从1开始
> {{ forloop.counter0 }}:当前循环的计数，从0开始
> {{ forloop.revcounter }}:倒序的循环计数,到1结束
> {{ forloop.revcounter0 }}:倒序的循环计数,到0结束
> {{ forloop.first }}: 布尔值,是否为第一次循环
> {{ forloop.last }}: 布尔值,是否为最后一次循环
> {{ forloop.parentloop }}: 上一级循环

## 4.url标签
https://soulchild.cn/2013.html

其他内置标签:https://docs.djangoproject.com/zh-hans/2.2/ref/templates/builtins/#built-in-tag-reference

## 5.过滤器
过滤器理解为函数,方便使用的小功能
所有内置过滤器：https://docs.djangoproject.com/zh-hans/2.2/ref/templates/builtins/#built-in-filter-reference

自定义过滤器: https://soulchild.cn/2049.html
### 5.1 add 相加
```
{{ 1|add:1 }}    <!-- 2 -->
{{ l1|add:l2 }}  <!-- 两个列表合并 -->
{{ 1|add:"a" }}  <!-- 不能加 -->
{{ 1|add:"1" }}  <!-- 2 -->
```
### 5.2 cut 替换
```
<!-- 替换所有的内容 -->
{{ "abc1a2bc3d"|cut:'a' }}  <!-- bc12bc3d -->
```
### 5.3 date时间格式化
https://docs.djangoproject.com/zh-hans/2.2/ref/templates/builtins/#date
```
# 返回给模板时间对象
return render(request, 'index.html', {'today': datetime.now()})

{{ today|date }}  <!-- 2020年10月10日 -->
{{ today|date:'Y-m-d H:i:s' }}   <!-- 2020-10-10 11:10:23 -->
```











---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2015/  

