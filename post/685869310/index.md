# zk客户端报错Invalid config event received


<!--more-->

### 完整报错信息

```bash
[main-EventThread] ERROR org.apache.curator.framework.imps.EnsembleTracker - Invalid config event received: {server.2=192.168.124.67:2888:3888:participant, server.1=192.168.124.66:2888:3888:participant, server.3=192.168.124.68:2888:3888:participant, version=0}
```

### 原因

新版本中的配置规范改了, 需要使用新的格式, 尽管报错了, 但实际上应该不会有问题。
issue: <https://issues.apache.org/jira/browse/CURATOR-526>
doc: <https://zookeeper.apache.org/doc/r3.5.3-测试版/zookeeperReconfig.html#ch_reconfig_format>

### 解决方法

原zk配置

```bash
server.1=zk1.pulsar.ops.cn:2888:3888
server.2=zk2.pulsar.ops.cn:2888:3888
server.3=zk3.pulsar.ops.cn:2888:3888
```

修改后

```bash
server.1=zk1.pulsar.ops.cn:2888:3888;2181
server.2=zk2.pulsar.ops.cn:2888:3888;2181
server.3=zk3.pulsar.ops.cn:2888:3888;2181
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/685869310/  

