# war包方式部署jenkins，并设置为中文

<!--more-->
最新war包下载地址：

<a href="https://mirrors.tuna.tsinghua.edu.cn/jenkins/war/2.181/jenkins.war">https://mirrors.tuna.tsinghua.edu.cn/jenkins/war-stable/latest/jenkins.war</a>

&nbsp;

将war包复制到tomcat站点目录：

cp jenkins.war /application/tomcat/webapps/

&nbsp;

1.打开web地址：

http://10.0.0.7:8080/jenkins

<img src="images/386acf9f6f48548800c0ccf1e6ae79fa.png "386acf9f6f48548800c0ccf1e6ae79fa"" />

&nbsp;

2.输入密码后继续，跳过插件安装

<img src="images/98ad50618bf360a1730adfbd490aa013.png "98ad50618bf360a1730adfbd490aa013"" />

3.安装Locale 插件

<img src="images/6ce2c85db804240be5b6a6e09131da0f.png "6ce2c85db804240be5b6a6e09131da0f"" />

<img src="images/b2d7c0c691da1d729743af4274c5ce7f.png "b2d7c0c691da1d729743af4274c5ce7f"" />

找到Locale插件安装即可

&nbsp;

4.配置中文

<img src="images/5f66074c81cca6dc5e44d45927e3ab4b.png "5f66074c81cca6dc5e44d45927e3ab4b"" />

<img src="images/2431ff99887e614a0068cf60095aac7a.png "2431ff99887e614a0068cf60095aac7a"" />

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/475/  

