# elasticsearch核心概念

<!--more-->
### 一、NRT(近实时)
从数据被写到ES到可被检索可以达到秒级

### 二、Document(文档)
理解为一个JSON数据。比如下面是一个商品文档
```json
{
    "name": "键盘",
    "desc": "这是一个红轴键盘",
    "price": 1200,
    "brand": "cherry",
}
```

### 三、Field(字段)
文档中的属性,理解为json中的key

### 四、Index(索引)
一个index包含多个数据结构相似的document。

### 五、Type(类型)
每个索引中可以包含多个type，type可以为index做逻辑分类,不同的分类可以定义不同的field。比如一个商品索引，可以包含许多不同种类的商品，不同种类的商品数据结构字段可能不相同。举个例子:

下面有两个商品
```json
外设分类
{
    "name": "键盘",
    "desc": "这是一个红轴键盘",
    "price": 1200,
    "brand": "cherry"
}

食品分类
{
    "name": "方便面",
    "desc": "香辣牛肉面",
    "price": 15,
    "shelfLife": "6个月"
}
```

### 六、Mapping(映射)
映射是定义文档如何存储和索引的过程，所以创建索引时要指定索引和文档的映射关系。例如下面定义了字段的数据类型
```json
{
    "mappings": {
        "peripheral": {
            "properties": {
                "name": {"type": "string"},
                "desc": {"type": "string"},
                "price": {"type": "double"},
                "brand": {"type": "string"}
            }
        }
    }
}
```

### 七、Shard(分片)
Shard也称为Primary Shard
es可以将一个索引中的数据切分成多个较小的Shard，分布在不同的Node上存储。
ES会把查询发送给每个相关的分片,从而提高吞吐量。这样就可以解决单台机器性能瓶颈问题。
默认情况下有5个Primary Shard

### 八、Replica(副本)
Replica也称为Replica Shard
当某个Node发生故障时,shard会处于丢失状态,因此可以为每个shard创建多个副本。好处如下

冗余能力
当某个Node故障时可以使用其他Node中的replica来作为备用。
提高检索性能
Replica Shard也可以提供查询的能力，所以在执行多个检索操作的时候可以将请求发送到不通的副本中

默认情况下每个Primary Shard有1个Replica Shard。Replica Shard不能和Primary Shard在同一节点上。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2735/  

