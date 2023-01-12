# logrotate日志切割归档

<!--more-->
## 命令
```
# 尝试日志切割(不会真正切割)
logrotate -d /etc/logrotate.d/xxx

# 强制尝试日志切割(不会真正切割，未达到切割时间也会模拟执行切割操作)
logrotate -d -f /etc/logrotate.d/xxx

# 强制切割
logrotate -f /etc/logrotate.d/xxx
```
> /etc/cron.daily/logrotate中有个任务每天执行
## 默认配置文件
vim /etc/logrotate.conf
```
# see "man logrotate" for details
# 切割周期,daily-每天切割, weekly-每周切割, monthly-每月切割,
weekly

# 默认保留4个文件
rotate 4

# 切割后创建新的日志文件
create

# 使用日期做为切割后文件的后缀名
dateext

# 切割后的日志压缩
#compress

# RPM packages drop log rotation information into this directory
include /etc/logrotate.d

# no packages own wtmp and btmp -- we'll rotate them here
/var/log/wtmp {
    monthly  # 每月切割
    create 0664 root utmp  # 创建日志文件的权限、属主和属组
        minsize 1M  # 日志大于等于1M才会切割 
    rotate 1  # 保留一个日志
}

/var/log/btmp {
    missingok  # 切割期间丢失的日志，错误忽略
    monthly  # 每月切割
    create 0600 root utmp  # 创建日志文件的权限、属主和属组
    rotate 1 # 保留一个日志
}
```

## 常用参数：
```
# weekly、daily、monthly、yearly切割周期，hourly需要自己修改定时任务
daily

# 保留10个日志
rotate 10
    
# create和下面的copytruncate二选一
# 如果程序支持重新加载配置、重写日志，例如nginx
create 0644 www root

# 如果程序不支持重新加载配置，为了不影响日志写入，可以使用copytruncate。例如redis,nohup
copytruncate

# 压缩切割后的日志文件
compress

# 使用日期做为切割后文件的后缀名
dateext
# 日期格式，仅支持%Y%m%d%H%s
dateformat -%Y%m%d.%s
# 使用昨天的日期
dateyesterday

# 保留.log扩展名
extension .log


# 日志为空不切割
notifempty

# 如果日志文件不存在，不会发出错误
missingok

# 切割后的日志文件放到指定的目录
olddir /backup/logs/
# olddir指定的目录不存在，则会创建该目录
createolddir 755 root root

# 定期切割日志时会判断文件大小，达到2M才会切割(可以使用k,M,G单位)
minsize   2M

# 当文件达到5M，即使没有达到切割周期也会切割日志(需要单独写定时任务)
maxsize   5M
```
执行脚本部分
```
    sharescripts
    prerotate
      echo "切割日志前执行"
    endscript
    postrotate
      echo "切割日志后执行"
    endscript
```


## 模板：
```
# 日志路径
/var/log/xxx/*.log {
    daily
    rotate 10
    create 0644 www root
    dateext
    compress
    notifempty
    missingok
    sharedscripts
    postrotate
        /bin/kill -USR1 `cat /run/nginx.pid 2>/dev/null` 2>/dev/null || true
    endscript
}
```




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1902/  

