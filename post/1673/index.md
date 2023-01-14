# kafka常用基本操作

<!--more-->
工具均在kafka安装目录中的bin目录下：

为了使用方便我临时做一个别名：
```bash
alias kfk='sh /usr/local/kafka/bin/kafka-topics.sh --zookeeper elk1:2181,elk2:2181,elk3:2181'
```
### 一、显示topic列表

kfk --list

### 二、创建一个topic，并指定topic属性（副本数、分区数等）

--replication-factor ：为topic创建多少个副本

kfk --create --replication-factor 3 --partitions 3 --topic mytopic

### 三、查看某个topic的状态

kfk --describe --topic mytopic

<img src="images/d8e3c45c934afbf34f87604e52cf17fe.png "d8e3c45c934afbf34f87604e52cf17fe"" />

第一行是topic的基本信息

下面三行代表每个topic的分区分布情况

leader 负责读写partiton的节点，每个节点都有可能成为leader。

replicas 当前partition的副本存储在哪些节点，不管该节点是否是leader或者是否存活都会显示。

isr 副本节点中存活的节点列表，并且都和leader同步



mytopic这个Topic举例解释:

编号为0的Partition,Leader在broker.id=2这个节点上.副本分布在broker.id为2,3,1这三个节点. 副本2,3,1处于存活状态，并跟leader(broker.id=2这个节点)同步

编号为1的Partition,Leader在broker.id=3这个节点上.副本分布在broker.id为3,1,2这三个节点. 副本3,1,2处于存活状态，并跟leader(broker.id=3这个节点)同步



### 四、生产消息、消费消息

进入生产者控制台：

./kafka-console-producer.sh --broker-list elk1:9092,elk2:9092,elk3:9092 --topic mytopic

进入消费者控制台：

./kafka-console-consumer.sh --bootstrap-server elk1:9092,elk2:9092,elk3:9092 --topic mytopic

此时在生产者控制台输入内容，会直接被消费者取出：

<img src="images/df819454daf8d640b09c246856fc7bd2.png "df819454daf8d640b09c246856fc7bd2"" />

<img src="images/b3125098248861863b12cd0699d8ca91.png "b3125098248861863b12cd0699d8ca91"" />

添加--from-beginning参数可以一次性取出所有消息

### 五、删除topic
```bash
/usr/local/kafka/bin/kafka-topics.sh --zookeeper elk1:2181,elk2:2181,elk3:2181 --delete --topic mytopic
```

### 六、删除消费者组
```bash
./kafka-consumer-groups.sh --bootstrap-server elk1:9092,elk2:9092,elk3:9092 --delete --group xxxxx
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1673/  

