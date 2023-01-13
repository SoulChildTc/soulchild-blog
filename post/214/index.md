# curl命令简单使用

<!--more-->
&nbsp;

curl参数说明：

-v    显示请求详细信息

-H    修改请求头部内容    举例：curl -v -H Host:www.baidu.com   www.soulchild.com

-I     只显示请求头部

-o    将网页访问结果内容保存到指定位置

-O    将网页访问结果内容按照服务器的文件名保存到本地

-s     静默模式。不显示进度表或错误消息。

-w    按照指定格式输出

-L     跟随重定向跳转

-X    指定访问方式GET、POST

-d    指定POST提交数据

--data-ascii &lt;data&gt; 以ascii的方式post数据

--data-binary &lt;data&gt; 以二进制的方式post数据

-c     操作结束后把cookie写入到这个文件中

-b     cookie字符串或文件读取位置

<!--more-->

<hr />

取http状态码方法1：

curl -s -w "%{http_code}\n"   -o /dev/null  www.soulchild.com

取http状态码方法2：

curl -s -I www.soulchild.com | awk 'NR==1{print $2}'

查看响应时间:
curl -s -w ' dns:%{time_namelookup}, conn:%{time_connect}, c-s_resp:%{time_starttransfer}, total:%{time_total}, down:%{speed_download}byte/s  ' 1.1.1.1:8080/actuator/health/liveness


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/214/  

