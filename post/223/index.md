# nginx状态码模块配置信息说明

<!--more-->
#状态码模块

编译安装时需要指定--with-http_stub_status_module

&nbsp;

在server字段中添加如下内容：

location /status/ {
stub_status;

#1.75之前的版本使用stub_status on

}

&nbsp;

浏览器中输入IP/status/

即10.0.0.7/status/，可以看到如下内容

#############################################

<span style="color: #e53333;">Active connectio</span><span style="color: #e53333;">ns</span>: 1

server <span style="color: #e53333;">accepts</span> <span style="color: #e53333;">han</span><span style="color: #e53333;">dled</span> <span style="color: #e53333;">requests</span>

3          3           7

<span style="color: #e53333;">Rea</span><span style="color: #e53333;">ding</span>: 0 <span style="color: #e53333;">W</span><span style="color: #e53333;">riting</span>: 1 <span style="color: #e53333;">Waiting</span>: 0

#############################################

<strong><span style="color: #e53333; font-size: 14px;">含义说明：</span></strong>

<span style="color: #e53333;">Active connections</span>: 包括等待连接在内的当前活动客户端连接数。(与服务器已经建立的连接的连接数量, 当前并发数量)

<span style="color: #e53333;">accepts</span>：已接受的客户端连接总数

<span style="color: #e53333;">han</span><span style="color: #e53333;">dled</span>：已处理的连接总数(正常情况下与已接受的数量一致)

<span style="color: #e53333;">req</span><span style="color: #e53333;">uests</span>：客户端一共发起的请求总数

<span style="color: #e53333;">Re</span><span style="color: #e53333;">ading</span>:nginx正在读取多少个用户的请求头

<span style="color: #e53333;">Writ</span><span style="color: #e53333;">ing</span>:nginx正在响应多少用户的请求头

<span style="color: #e53333;">Wait</span><span style="color: #e53333;">ing</span>: 当前空闲客户端 等待连接的总数

&nbsp;

官方给出的解释：

Active connections

The current number of active client connections including Waiting connections.

accepts

The total number of accepted client connections.

handled

The total number of handled connections. Generally, the parameter value is the same as accepts unless some resource limits have been reached (for example, the worker_connections limit).

requests

The total number of client requests.

Reading

The current number of connections where nginx is reading the request header.

Writing

The current number of connections where nginx is writing the response back to the client.

Waiting

The current number of idle client connections waiting for a request.

&nbsp;
<pre></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/223/  

