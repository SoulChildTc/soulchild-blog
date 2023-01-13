# Supervisor安装和简单使用

<!--more-->
## 安装

`yum install -y supervisor`


## 配置
配置模板
```
[program:你的应用名称]
command=/bin/cat              ; 启动命令
process_name=%(program_name)s_%(process_num)02d ; 启动多个副本时，指定不同的进程的名称
numprocs=1                    ; 要启动的副本数量
directory=/tmp                ; 在指定的目录执行程序
priority=999                  ; 启动优先级 (默认: 999)
autostart=true                ; 自动启动 (默认: true)
autorestart=true              ; 意外退出时重新启动 (默认: true)
startsecs=10                  ; 运行10秒后没有异常退出，就代表正常运行
startretries=3                ; 启动失败重新尝试启动的次数 (默认: 3)
exitcodes=0,2                 ; 进程正常退出的状态码 (默认: 0,2)
stopsignal=QUIT               ; 终止进程的方式 (默认: TERM)
user=chrism                   ; 用指定的用户启动
redirect_stderr=true          ; 将进程的stderr重定向到stdout（默认: false）
stdout_logfile=/a/path        ; stdout日志路径
stdout_logfile_maxbytes=1MB   ; stdout单个日志大小，满足后轮转(默认 50M)
stdout_logfile_backups=10     ; stdout日志文件备份数 (默认 10)
stderr_logfile=/a/path        ; stderr日志路径
stderr_logfile_maxbytes=1MB   ; stderr单个日志大小，满足后轮转(默认 50M)
stderr_logfile_backups=10     ; stderr日志文件备份数 (默认 10)
environment=A=1,B=2           ; 设置环境变量
```

写一个例子：
```
[program:app]
command=/usr/local/python3/bin/python3 app.py
directory=/root
autostart=true
autorestart=true
startsecs=10
startretries=3
exitcodes=0,2
stopsignal=QUIT
user=root
redirect_stderr=true
stdout_logfile=/var/log/app.log
stdout_logfile_maxbytes=1MB
stdout_logfile_backups=10
```
root目录下放一个app.py
```python
import logging
logging.basicConfig(format="%(asctime)s-%(name)s-%(levelname)s-%(message)s",level=logging.INFO)
log = logging.getLogger('demo')
while True:
  log.error("错啦错啦")
  log.info('挺好挺好')
```


## 启动supervisord程序
`systemctl start supervisord`或者`supervisord -c /etc/supervisord.conf`


### 常用命令
```
# 启动应用
supervisorctl start all      # 启动所有进程
supervisorctl start app      # 启动指定进程
supervisorctl start app:*    # 启动一组进程
# 重启应用
supervisorctl restart all    # 重启所有进程
supervisorctl restart app    # 重启指定进程
supervisorctl restart app:*  # 重启一组进程
# 停止应用
supervisorctl stop all       # 停止所有进程
supervisorctl stop app       # 停止指定进程
supervisorctl stop app:*     # 停止一组进程

# 查看被管理项目运行状态
supervisorctl status         # 查看所有进程状态
supervisorctl status app:*   # 查看一组进程状态

# 重新加载配置文件
supervisorctl update         # 重新加载所有配置文件，并重新运行进程
supervisorctl update app     # 重新加载指定配置文件，并重新运行进程

# 重新启动所有程序
supervisorctl reload         # 重新所有进程

# 清除日志
supervisorctl clear          # 清除日志
supervisorctl clear app      # 清除指定日志
```


## 检查
`tail -f /var/log/app.log`



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1865/  

