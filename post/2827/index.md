# shell脚本实现多进程

<!--more-->
```bash

#!/bin/bash

function init(){
    [ -e fd1 ] || mkfifo fd1
    exec 5<>fd1
    rm -f fd1
    NUM=${1:-10}

    for (( i=1;i<=${NUM};i++ ))
    do
      echo >&5
    done
}

function start(){
    while true;
    do
        [ -f lock ] && break
        read -u5
        {
            #script body
            echo >&5
        } &
        sleep ${1:-0}
    done
    wait
}

# 初始化,指定进程数
init $1
# 开始执行,如果要加执行间隔可以指定
start $2

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2827/  

