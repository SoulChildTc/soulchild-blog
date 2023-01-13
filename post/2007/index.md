# js-操作节点

<!--more-->
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <div class="parent">
        <div class="son"></div>
    </div>
    <span>brother</span>
    <ul>
        <li>aaa</li>
    </ul>
    <button>删除第一个li节点</button>
    <script>
        // 元素节点  nodeType为1
        // 属性节点  nodeType为2
        // 文本节点  nodeType为3
        var par = document.querySelector(".parent");
        ///////////////////////////////获取子节点和元素//////////////////////////////
        //获取所有子节点
        console.log("所有子节点:",par.childNodes); // div有三个子节点，分别是"换行符"、"div .son"、"换行符"
        // 获取第一个和最后一个子节点
        console.log("第一个子节点:",par.firstChild);
        console.log("最后一个子节点:",par.lastChild);


        // 获取所有子元素
        console.log("所有子元素:",par.children);
        // 获取第一个和最后一个子元素
        console.log("第一个子元素:",par.firstElementChild);
        console.log("最后一个子元素:",par.lastElementChild);
        
        //////////////////////////////获取兄弟节点和元素////////////////////////////// 
        //获取上一个和下一个兄弟节点
        console.log("下一个兄弟节点:",par.nextSibling);
        console.log("上一个兄弟节点:",par.previousSibling);
        //获取上一个和下一个兄弟元素
        console.log("下一个兄弟元素:",par.nextElementSibling);  // 下一个兄弟节点是span
        console.log("上一个兄弟元素:",par.previousElementSibling); // 上一个兄弟节点是null

        //////////////////////////////获取父弟节点和元素////////////////////////////// 
        console.log("父节点:",par.parentNode);
        console.log("父元素:",par.parentElement);


        //////////////////////////////创建元素节点////////////////////////////// 
        // 父元素中追加一个新的元素
        // 先获取父级标签
        var ul = document.querySelector("ul")
        // 创建一个新的元素
        var li = document.createElement("li")
        // 填写内容和追加
        li.innerHTML="我是追加的"
        ul.appendChild(li)
        
        // 在某个元素的前面插入
        //获取在谁前面插入
        // var aaa = document.querySelector("ul>li")
        var aaa = ul.children[0]
        // 创建一个新的元素
        var li2 = document.createElement("li")
        // 填写内容和追加
        li2.innerHTML = "我是插入的"
        ul.insertBefore(li2,aaa)

        //////////////////////////////删除节点////////////////////////////// 
        var btn = document.querySelector("button")
        btn.onclick = function(){
            if (ul.children[1] === undefined){
                this.disabled=true
            }
            ul.removeChild(ul.children[0])
        }
    </script>
</body>
</html>

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2007/  

