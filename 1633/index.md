# jenkins集成github登陆

<!--more-->
1.安装插件

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

2.配置github

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

添加一个应用

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

记录ClientID和Secret

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

3.配置jenkins

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

保存后退出登陆，发现没有权限了，比如这样。。。

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

解决方法：

修改jenkins的config.xml文件

在&lt;assignedSIDs&gt;字段中添加&lt;sid&gt;你的用户名&lt;/sid&gt;

<img src="images/256dcf851f0670bb1e8b393133e1f1ae.png" />

&nbsp;

保存后重启即可。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1633/  

