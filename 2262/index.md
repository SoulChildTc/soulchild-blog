# ELK-filebeat常规设置选项(五) 

<!--more-->
## 一、全局选项
位于filebeat命名空间中。或者理解为字段

### filebeat.registry_file
指定注册表文件

### filebeat.registry_file_permissions
注册表文件的权限，默认是0600。

### filebeat.registry_flush
将注册表写入(刷新)至磁盘的时间间隔。默认值为0s，在成功发布每批事件后，注册表将写入磁盘。

### filebeat.shutdown_timeout 
Filebeat关闭前等待publisher发送事件的时间。

### filebeat.config.inputs
说明:类似于include,把其他input配置文件导入进来
用法:
```
filebeat.config.inputs:
  enabled: true
  path: configs/*.yml
  reload.enabled: true # 启用动态加载
  reload.period: 20s  # 20秒重新加载一次
```

### filebeat.config.modules
配置模块文件的路径
```
filebeat.config.modules:
  enabled: true
  path: ${path.config}/modules.d/*.yml
```


## 二、通用选项
所有Elastic Beats都支持这些选项。因为它们是通用选项，所以它们没有命名空间。
### name
如果该选项为空，则使用服务器的主机名。这个名称作为`beat.name`字段包含在每个发布的事务中。

### tags
值是一个列表，作为`tags`字段包含在每个发布的事务中。`tags`可以很容易地根据不同的逻辑属性对服务器进行分组。

例如，如果您有一个Web服务器集群，则可以将"WebServers"添加到每个服务器上的tags中，然后在Kibana Web界面中使用过滤器和查询以获取整个服务器组的可视化

### fields
可选字段，可以添加一些自定义字段。值是字典，支持多种类型嵌套组合

### fields_under_root
将自定义字段置到顶级，默认在fields字段下。

### processors
定义处理器，以便在事件发送到输出之前对其进行处理

### max_procs
设置可以同时执行的最大CPU数。默认值是系统中可用的逻辑CPU数。



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2262/  

