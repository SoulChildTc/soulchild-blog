# rabbitmq3.6.5常用配置

<!--more-->
本文转自：https://www.cnblogs.com/zhming26/p/6140307.html

简单的rabbitmq配置可无需配置文件，只有需要定制复杂应用时，才需要用到配置文件

rabbitmq-env.conf配置
常用参数：
```bash
RABBITMQ_NODE_IP_ADDRESS= //IP地址，空串bind所有地址，指定地址bind指定网络接口
RABBITMQ_NODE_PORT=       //TCP端口号，默认是5672
RABBITMQ_NODENAME=        //节点名称。默认是rabbit
RABBITMQ_CONFIG_FILE= //配置文件路径 ，即rabbitmq.config文件路径
RABBITMQ_MNESIA_BASE=     //mnesia所在路径
RABBITMQ_LOG_BASE=        //日志所在路径
RABBITMQ_PLUGINS_DIR=     //插件所在路径
```

rabbitmq.config配置
如果是用rpm包安装，可从默认docs目录复制配置文件样例：
cp /usr/share/doc/rabbitmq-server-3.6.5/rabbitmq.config.example /etc/rabbitmq.config

```erlang
tcp_listerners    #设置rabbimq的监听端口，默认为[5672]。
disk_free_limit     #磁盘低水位线，若磁盘容量低于指定值则停止接收数据，默认值为{mem_relative, 1.0},即与内存相关联1：1，也可定制为多少byte.
vm_memory_high_watermark    #设置内存低水位线，若低于该水位线，则开启流控机制，默认值是0.4，即内存总量的40%。
hipe_compile     #将部分rabbimq代码用High Performance Erlang compiler编译，可提升性能，该参数是实验性，若出现erlang vm segfaults，应关掉。
force_fine_statistics    #该参数属于rabbimq_management，若为true则进行精细化的统计，但会影响性能。
frame_max     #包大小，若包小则低延迟，若包则高吞吐，默认是131072=128K。
heartbeat     #客户端与服务端心跳间隔，设置为0则关闭心跳，默认是600秒。
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1770/  

