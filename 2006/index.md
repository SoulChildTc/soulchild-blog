# js-事件

<!--more-->
## 1. 基本事件
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="btn">点我</button>
    <script>
        // 事件三要素：事件源、触发事件类型(如何触发的，鼠标点击、经过、按下)、事件处理程序 
        
        // 1.获取元素
        var btn = document.getElementById("btn");

        // 2.绑定事件。// 3.事件处理程序 
        btn.onclick = function(e){alert("厉害了")} // e代表的是事件对象,可以看到事件的详细信息,console.dir(e)可以看到所有属性
    </script>
</body>
</html>
```

常见鼠标事件
```bash
onclick         鼠标点击左键触发
onmouseover     鼠标经过触发
onmouseout      鼠标离开触发
onfocus         获得鼠标焦点触发
onblur          失去鼠标焦点触发
onmousemove     鼠标移动触发
onmouseup       鼠标松开触发
onmousedown     鼠标按下触发
```

## 2.事件侦听器
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="btn">监听事件</button>
    <script>
        // 注册时间的两种方式
        // 传统注册方式：同一个元素同一个事件只能设置一个处理函数，最后绑定的处理函数会覆盖前面注册的

        // 方法监听方式：addEventListener()方法向指定元素添加事件句柄。IE9之前用attachEvent().
        // 同一个元素同一个事件可以注册多个事件侦听器，按注册顺序执行


        // 添加事件侦听器
            // 获取按钮元素
            var btn = document.querySelector("#btn") 
            // 1. 监听事件类型 不带on
            // 2. 下面的示例中满足 同一个元素(btn)、同一个事件(click)添加多个侦听器
            btn.addEventListener("click", e1)
            function e1(){
                alert("我是第一个click事件")
                // 删除事件,使用匿名函数则无法删除
                btn.removeEventListener("click",e1)
            }
            btn.addEventListener("click",function(){alert("我是第二个click事件")})
    </script>
</body>
</html>
```

## 3.DOM事件流
事件发生时会在元素节点之间按照特定的顺序传播，这个传播过程就是DOM事件流
比如我们给一个div注册了点击事件,会按照下面的顺序执行:
        捕获阶段: Document-->element html-->element body-->element div
        当前目标阶段: element div
        冒泡阶段: element div-->Document-->element html-->element body

        JS代码只会执行捕获阶段和冒泡阶段其中一个
        addEventListener方法的第三个参数为false就是冒泡阶段，为true就是捕获阶段

onclick和attachEvent只能的到冒泡阶段
有些事件没有冒泡noblur、onfocus、onmouseenter、onmouseleave


**下面是冒泡阶段示例，当点击son盒子的时候，parent、html和document也会依次触发相应事件**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .parent {
            overflow: hidden;
            height: 400px;
            width: 400px;
            margin: 100px auto;
            background-color: skyblue;
        }
        .son {
            margin: 125px auto;
            height: 150px;
            width: 150px;
            background-color: red;
        }
    </style>
</head>

<body>
    <div class="parent">
        <div class="son"></div>
    </div>
    <script>
        // son绑定事件
        var son = document.querySelector('.son')
        son.addEventListener('click',function(e){
            alert("son")
        })

        //parent绑定事件
        var parent = document.querySelector('.parent')
        parent.addEventListener('click',function(e){
            alert("parent")
        })

        //document绑定事件
        document.addEventListener('click',function(e){
            alert("document")
        })

        //html绑定事件
        var html = document.querySelector('html')
        html.addEventListener('click',function(e){
            alert("html")
        })
    </script>
</body>
</html>
```

## 4.阻止冒泡,我们在son的事件处理程序中添加`e.stopPropagation();`就不会触发其他元素的事件了
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .parent {
            overflow: hidden;
            height: 400px;
            width: 400px;
            margin: 100px auto;
            background-color: skyblue;
        }
        .son {
            margin: 125px auto;
            height: 150px;
            width: 150px;
            background-color: red;
        }
    </style>
</head>

<body>
    <div class="parent">
        <div class="son"></div>
    </div>
    <script>
        // son绑定事件
        var son = document.querySelector('.son')
        son.addEventListener('click',function(e){
            alert("son")
            e.stopPropagation();
        })

        //parent绑定事件
        var parent = document.querySelector('.parent')
        parent.addEventListener('click',function(e){
            alert("parent")
        })

        //document绑定事件
        document.addEventListener('click',function(e){
            alert("document")
        })

        //html绑定事件
        var html = document.querySelector('html')
        html.addEventListener('click',function(e){
            alert("html")
        })
    </script>
</body>
</html>
```
## 5.事件委托
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        li {
            width: 50px;
        }
    </style>
</head>
<body>
    <ul>
        <li>我是11</li>
        <li>我是12</li>
        <li>我是13</li>
        <li>我是14</li>
        <li>我是15</li>
    </ul>
    
    <script>
        // 事件委托的核心原理: 给父节点添加侦听器，利用事件冒泡影响每一个子节点
        var ul = document.querySelector("ul")
        ul.addEventListener('click',function(e){
            console.dir(e)
            alert(e.target.innerText);
            // 排他思想，将其他标签颜色设置为空
            for (var i=0;i<ul.childElementCount;i++){
                ul.children[i].style.backgroundColor = ""
            }
            e.target.style.backgroundColor = "skyblue"
        })
    </script>
</body>
</html>
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2006/  

