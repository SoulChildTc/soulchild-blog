# dble学习-基本配置和概念(一)

<!--more-->
官方文档: https://actiontech.github.io/dble-docs-cn

## 拆分类型
### 垂直拆分
不同的表放到不同的库中
table_a -> mysql1
table_b -> mysql2
table_c -> mysql3


### 水平拆分
相同的表放到不同的库中,但需要明确拆分规则，比如按照id大小拆分到不同的库中。
table_a -> mysql1
table_a -> mysql2
table_a -> mysql3


## dble执行架构
```bash
Application -> dble接收请求 -> 简单查询 -> 直接查询返回结果
                    |
                 复杂查询
                    |
                 执行查询
                    |
        代码层处理join、group、order等操作
                    |
                 返回结果
```

### 重新加载配置
restart
reload: 重新获取分片以及用户权限两个部分
reload all: 在reload的基础上重启获取mysql连接信息并重建连接池。比较常用


## 分片表类型
### 分片表
数据根据水平拆分的表。比如ad表数据量太大，需要分到不同的mysql节点中。

### 分片子表
附属于某分片表的子表，和父表以同样的规则进行水平拆分的表。

比如:
customer(分片表)  按照id分片，均匀的分配到每个mysql节点上
order(分片子表)   包含customer id，为了业务方便，期望用户和订单都存在同一个节点中, 比如id=1的用户的数据分配到mysql2中，那么与他相关联的订单数据也要分配到mysql2中

### 全局表
在每个mysql节点中都拥有一份全量的数据，比如字典数据可以用到全局表。

### 非分片表
不分片，垂直分片表，只在其中一个mysql节点中存储，比如日志表

## 如何分片

### schema.xml
定义具体的table要存放到哪个mysql节点中的哪个database中，包括mysql连接信息，用户、密码、ip、端口以及存放数据的database。

** 配置语法格式 **

schema部分
```xml
<schema name="TESTDB"> <!-- 虚拟库名称 -->
  <!-- 定义的是分片表类型。分别对应表名，分片表可以存到哪些节点、分片规则名称 -->
  <table name="travelrecord" dataNode="dn1,dn2" rule="sharding-by-hash2" />

  <!-- 定义的是全局表类型。分别对应表名、主键列、类型是全局表、全局表可以存到哪些节点、自增属性-->
  <table name="company" primaryKey="ID" type="global" dataNode="dn1,dn2,dn3,dn4" autoIncrement="true" />

  <!-- 定义分片子表,外面和分片表一样 -->
  <table name="customer" primaryKey="ID" dataNode="dn1,dn2" rule="sharding-by-mod">
    <!-- 定义分片子表类型,分别对应表名、主键列、子表中的id、父表中的id -->
    <childTable name="orders" primaryKey="ID" joinKey="customer_id" parentKey="id" /> <!-- 找到父表中id列等于子表中的customer_id列的记录，被分片到哪个节点中。子表的数据也会被分配到和父表同一个节点中 -->
  </table>
  
  <!-- 非分片表类型 -->
  <table name="logs" dataNode="dn2" />
</schema>
```

** dataNode、dataHost部分 **
```xml
<!-- 定义mysql节点名称、mysql的连接信息(dataHost)、mysql的database -->
<dataNode name="dn1" dataHost="dh1" database="db1" />
<dataNode name="dn2" dataHost="dh1" database="db2" />

<!-- 定义数据库连接信息名称 -->
<dataHost name="dh1" maxCon="1000" minCon="10" balance="0" switchType="-1" slaveThreshold="100">

  <!-- dble用来检测数据库是否可以连接的sql命令 -->
  <heartbeat>show slave status</heartbeat>

  <!-- 后端mysql的具体连接信息,支持读写分离 -->
  <writeHost host="hostM1" url="127.0.0.1:3306" user="root" password="123456" >
    <readHost host="hostS1" url="127.0.0.1:3307"  user="root" password="1234567" >
  </writeHost>
</dataHost>
```
> 参数具体含义: https://actiontech.github.io/dble-docs-cn/history/2.19.03.0/1.config_file/1.02_schema.xml.html

### rule.xml
分片具体使用的规则、分片数量、分片细节

配置语法格式:
```xml
<tableRule name="id-enum"> <!-- 分片规则名称 -->
  <rule>
    <columns>id</columns> <!-- 分片列 -->
    <algorithm>enum</algorithm> <!-- 指定分片方法名,对应下面的function名称 -->
  </rule>
</tableRule>

<function name="enum" class="Enum"> <!-- 分片方法名和类名(类名只能是Enum,NumberRange,Hash,StringHash,Date,PatternRange,jumpStringHash) -->
  <property name="mapFile">partition-hash-int.txt</property>
  <property name="defaultNode">0</property>
  <property name="type">0</property>
</function>
```
> function可以写一个分片细节，tableRule用来引用这个分片细节。
> 比如coustomer要按照id分片，order要按照cid来分片。他们的分片逻辑是一样的，那么他们可以指向同一个function。


### wrapper.conf
jvm配置相关

### myid.properites
dble集群配置,暂未了解






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2829/  

