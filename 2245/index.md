# ELK-filebeat安装和简介(一)

<!--more-->
更多安装方式：https://www.elastic.co/guide/en/beats/filebeat/6.8/filebeat-installation.html

rpm安装
```
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.8.5-x86_64.rpm
sudo rpm -vi filebeat-6.8.5-x86_64.rpm
```

二进制安装
```
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.8.14-linux-x86_64.tar.gz
tar xzvf filebeat-6.8.14-linux-x86_64.tar.gz
```

下文引用自: https://www.cnblogs.com/cjsblog/p/9495024.html
官方文档: https://www.elastic.co/guide/en/beats/filebeat/6.8/how-filebeat-works.html#how-filebeat-works
## Filebeat是如何工作的
Filebeat由两个主要组件组成：inputs 和  harvesters （直译：收割机，采集器）。这些组件一起工作以跟踪文件，并将事件数据发送到你指定的输出。

### 1.harvester是什么
一个harvester负责读取一个单个文件的内容。
harvester逐行读取每个文件（一行一行地读取每个文件），并把这些内容发送到输出。
每个文件启动一个harvester。
harvester负责打开和关闭这个文件，这就意味着在harvester运行时文件描述符保持打开状态。

在harvester正在读取文件内容的时候，文件被删除或者重命名了，那么Filebeat会续读这个文件。这就有一个问题了，就是只要负责这个文件的harvester没用关闭，那么磁盘空间就不会释放。默认情况下，Filebeat保存文件打开直到close_inactive到达。


### 2.input是什么
一个input负责管理harvesters，并找到所有要读取的源。
如果input类型是log，则input查找驱动器上与已定义的glob路径匹配的所有文件，并为每个文件启动一个harvester。
每个input都在自己的Go例程中运行。
下面的例子配置Filebeat从所有匹配指定的glob模式的文件中读取行：
```
filebeat.inputs:
- type: log
  paths:
    - /var/log/*.log
    - /var/path2/*.log
```

### 3.Filebeat如何保持文件状态

Filebeat保存每个文件的状态，并经常刷新状态到磁盘上的注册文件（registry）。状态用于记住harvester读取的最后一个偏移量，并确保所有日志行被发送（到输出）。如果输出，比如Elasticsearch 或者 Logstash等，无法访问，那么Filebeat会跟踪已经发送的最后一行，并只要输出再次变得可用时继续读取文件。当Filebeat运行时，会将每个文件的状态新保存在内存中。当Filebeat重新启动时，将使用注册文件中的数据重新构建状态，Filebeat将在最后一个已知位置继续每个harvester。

对于每个输入，Filebeat保存它找到的每个文件的状态。因为文件可以重命名或移动，所以文件名和路径不足以标识文件。对于每个文件，Filebeat存储惟一标识符，以检测文件是否以前读取过。

如果你的情况涉及每天创建大量的新文件，你可能会发现注册表文件变得太大了。

（画外音：Filebeat保存每个文件的状态，并将状态保存到registry_file中的磁盘。当重新启动Filebeat时，文件状态用于在以前的位置继续读取文件。如果每天生成大量新文件，注册表文件可能会变得太大。为了减小注册表文件的大小，有两个配置选项可用：clean_remove和clean_inactive。对于你不再访问且被忽略的旧文件，建议您使用clean_inactive。如果想从磁盘上删除旧文件，那么使用clean_remove选项。）

### 4.Filebeat如何确保至少投递一次（at-least-once）？

Filebeat保证事件将被投递到配置的输出中至少一次，并且不会丢失数据。Filebeat能够实现这种行为，因为它将每个事件的投递状态存储在注册表文件中。

在定义的输出被阻塞且没有确认所有事件的情况下，Filebeat将继续尝试发送事件，直到输出确认收到事件为止。

如果Filebeat在发送事件的过程中关闭了，则在关闭之前它不会等待输出确认所有事件。当Filebeat重新启动时，发送到输出（但在Filebeat关闭前未确认）的任何事件将再次发送。这确保每个事件至少被发送一次，但是你最终可能会将重复的事件发送到输出。你可以通过设置shutdown_timeout选项，将Filebeat配置为在关闭之前等待特定的时间。







---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2245/  

