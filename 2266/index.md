# ELK-filebeat队列简介(六) 

<!--more-->
事件被发送前会被存储到内部队列中，队列负责缓冲事件，并将其组合成可由output使用的批处理。output将使用批量操作在一个事务中发送一批事件。


## 内存队列：

当队列中有512个事件或者收到事件5秒后，则此示例配置将事件转发到output：
```
queue.mem:
  events: 4096  
  flush.min_events: 512  
  flush.timeout: 5s
```

### 参数说明
#### events
队列可以存储的最大事件数，默认4096

#### flush.min_events
默认: 2048。队列存储的最小事件数，如果设置为0，则直接将事件发送到output

#### flush.timeout
默认: 1s. 收到一个事件等待10秒后,将队列中的事件发送到output。
如果设置为0，则直接将队列中事件发送到output

> `flush.min_events`和`flush.timeout`无论哪个参数先符合要求都会将事件发送到output

> output中的`bulk_max_size`可以限制一次处理事件的数量


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2266/  

