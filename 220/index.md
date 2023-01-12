# nginx配置文件的location规则配置

<!--more-->
官方文档：http://nginx.org/en/docs/http/ngx_http_core_module.html#location

location主要用来匹配URI

&nbsp;

Syntax: location [ = | ~ | ~* | ^~ ] uri { ... }

location @name { ... }

Default: —

Context: server, location

&nbsp;

=：精确匹配。<span style="color: #e53333;"><strong>优先级最高</strong></span>

^~:不匹配正则表达式。<strong><span style="color: #e53333;">优先级第二</span></strong>

~*:匹配正则表达式，不分区大小写。还可以使用逻辑操作符取反：!,!~,!~*。<strong><span style="color: #e53333;">优先级第三</span></strong>

~：匹配正则表达式，区分大小写。<span style="color: #e53333;"><strong>优先级第四</strong></span>

&nbsp;

&nbsp;

location = / {                访问的地址uri部分没有内容和只有/的时候匹配
[ configuration A ]
}
location / {                 默认规则  其他条件都不匹配的时候使用此规则
[ configuration B ]
}
location /documents/ {       匹配路径(uri中包含指定的目录时匹配)  www.soulchild.cn/documents/访问此地址时会匹配成功
[ configuration C ]
}
location ^~ /images/ {       优先匹配路径(uri中包含指定的目录时匹配) www.soulchild.cn/images/admin可以匹配成功
[ configuration D ]
}

location ~* \.(gif|jpg|jpeg)$ {   正则匹配 不区分大小写，访问的uri中以指定内容结尾时匹配成功
[ configuration E ]
}

&nbsp;

&nbsp;

举例：只有指定ip可以访问admin目录，其他人禁止访问

location /admin/ {
root /app/www/;
index index.html;
allow 10.0.0.0/24;
deny all;
}

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/220/  

