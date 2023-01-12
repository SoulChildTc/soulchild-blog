# js-获取操作元素

<!--more-->
1.获取元素
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="i1">ok</div>
    <div id="i2">fuck</div>
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li name='1'>5</li>
    </ul>
    <div class="box">盒子1</div>
    <div class="box">盒子2</div>
    <script>
        // 根据id获取
        console.log(document.getElementById("i1"));
        //根据标签获取,返回数组
        console.log(document.getElementsByTagName("li"));
        //根据name属性获取,返回数组
        console.log(document.getElementsByName("1")[0].innerText)

        // h5新增
        //根据class名获取
        console.log(document.getElementsByClassName("box"));
        //指定一个选择器,返回第一个元素对象
        console.log(document.querySelector(".box"))
        console.log(document.querySelector("#i2"))
        //指定一个选择器,返回所有元素对象
        console.log(document.querySelectorAll(".box"));
    </script>
</body>
</html>
```

2.操作标签
tags = document.getElementsByTagName("div")
```javascript
tags[0].innerText = "xxx"
tags[0].innerHtml = "<p>xxx</p>"
tags[0].style.color = "skyblue"
```




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2001/  

