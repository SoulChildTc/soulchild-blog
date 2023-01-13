# js-基本操作

<!--more-->
## 基本数据类型：
### 1.数值：
    a = 18;
### 2.字符串：
https://www.w3school.com.cn/jsref/jsref_obj_string.asp
```js
    a = 'soulchild'
    a.chartAt(索引位置)
    a.substring(起始位置,结束位置)
    a.length           获取字符串长度
    a.indexOf('x')     查找字符串下标,第一次出现位置
    a.lastIndexOf("x") 查找字符串下标,最后一次出现的位置
    a.slice()          切片
    a.toLowerCase()    转换为小写
    a.toUpperCase()    转换为大写
    a.spliit()         分割
    a.math()           正则匹配
```
### 3.数组
https://www.w3school.com.cn/jsref/jsref_obj_array.asp
```js
    a = [1,2,3,4,5]
    a.push(6)       尾部追加元素
    a.push()        删除并返回数组的最后一个元素
    a.unshift(123)  首部追加元素
    a.shift()       删除并返回数组的第一个元素
    a.splice(start,delcount,values)   从第start个元素开始,删除delcount次元素。values代表要插入的值
```
  
for循环
```js
#1
a = [11,22,33,44]
for (var i in a){
  console.log(a[i])
}
#2
for (var i=0;i<10;i++){
  console.log(i)
}
```
判断
```js
if (条件){
  // 代码块
}else if (){
  // 代码块
}else{
  // 代码块
}
```
> ==：      值相等
> \===：    值和类型都相等
> &&：      and
> ||：      or


定时器：
```
  // 2秒运行一次
  setInterval("执行代码",时间间隔)
```


函数：
```js
function 函数名(c1,c2,c3){
  // 代码块
}
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2000/  

