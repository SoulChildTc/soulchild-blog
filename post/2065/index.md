# nginx+uwsgi部署django项目

<!--more-->
## 1. uwsgi配置文件
```ini
[uwsgi]
;socket监听地址
socket=/tmp/app.sock

;http监听地址
;http=127.0.0.1:8000

;项目目录
chdir=/application/xxx

;配置wsgi接口模块文件路径,wsgi.py这个文件所在的目录名
;wsgi-file=xxx/wsgi.py

;启动的进程数
processes=4

;每个进程的线程数
threads=2

;启动管理主进程
master=true

;存放主进程的pid文件
pidfile=uwsgi.pid

;后台运行,并设置一个日志文件路径
daemonize=uwsgi.log

;设置虚拟环境路径
;virtualenv=/xxx/.virtualenvs/xxx/


```

### 启动停止相关命令：

启动: `uwsgi --ini uwsgi.ini`
停止: `uwsgi --stop uwsgi.pid`
重新加载: `uwsgi --reload`


## 2.收集django静态文件
2.1在settings.py中添加如下配置:

`STATIC_ROOT = BASE_DIR / "nginx"`

2.2收集静态文件
```bash
python3 manage.py collectstatic
```


## 3.配置nginx
```bash
server {
    listen 80;
    server_name test.com;
    location / {
       uwsgi_pass    127.0.0.1:8000;
       include       /etc/nginx/uwsgi_params;
    }

    # 配置静态文件目录
    location /static {
        alias /xxxx/nginx/;
    }
}

```








---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2065/  

