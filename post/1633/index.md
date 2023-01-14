# jenkins集成github登陆

<!--more-->
1.安装插件

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

2.配置github

<img src="images/bad7c0b224edd9ba8af1ee8c23564a0b.png" />

&nbsp;

<img src="images/6a26a2601adec8815c5217bc4f3d3657.png" />

&nbsp;

添加一个应用

<img src="images/41b2cafc848fbcc0e45a6f21e091f40b.png" />

&nbsp;

记录ClientID和Secret

<img src="images/3f5628b56b61015a6083cb08fe634bff.png" />

3.配置jenkins

<img src="images/e8eb3b431102acf9fc836c2c2cf7cd7c.png" />

&nbsp;

保存后退出登陆，发现没有权限了，比如这样。。。

<img src="images/fa5a06ed24c2669b8f2adddb02edaa85.png" />

&nbsp;

解决方法：

修改jenkins的config.xml文件

在&lt;assignedSIDs&gt;字段中添加&lt;sid&gt;你的用户名&lt;/sid&gt;

<img src="images/607e145cf1ac344eea47987fcd67b6bc.png" />

&nbsp;

保存后重启即可。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1633/  

