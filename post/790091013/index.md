# Kafka 4_x 集群部署（KRaft 模式）


<!--more-->

参考:
- https://kafka.apache.org/documentation/#kraft
- https://kafka.apache.org/quickstart
- https://raw.githubusercontent.com/apache/kafka/trunk/docs/operations/kraft.md

<!--more-->

4.0 起 Kafka 彻底移除了 ZooKeeper（2.8 引入 KRaft，3.3 生产可用），部署一个三节点集群只需要一个安装包，不需要再装 ZK。本文以 3 节点合并模式为例（每个节点同时是 broker + controller），单机部署的差异在文中以备注标出。

### 一、节点规划

| 节点 | IP | node.id | 角色 | 端口 |
|---|---|---|---|---|
| kafka1 | 172.16.1.11 | 1 | broker,controller | 9092 / 9093 |
| kafka2 | 172.16.1.12 | 2 | broker,controller | 9092 / 9093 |
| kafka3 | 172.16.1.13 | 3 | broker,controller | 9092 / 9093 |

- 9092: 数据面（客户端读写、broker 间复制）
- 9093: 控制面（controller 之间 Raft 通信、broker 心跳）

> 合并模式 3 节点可容忍挂 1 台。官方建议 controller 角色用 3 或 5 台：3 台容忍 1 故障，5 台容忍 2 故障
>
> 大规模集群可以把角色拆开（`process.roles=controller` 单独部署 3 台 controller，broker 只跑数据），小规模用合并模式即可

### 二、前置条件（所有节点）

```bash
# Java 17+ 是 4.x 硬性要求
java -version
# openjdk version "17.0.x"

# 所有节点配置主机名解析(用主机名做监听地址, 换 IP 时不用改配置)
cat >> /etc/hosts <<'EOF'
172.16.1.11 kafka1
172.16.1.12 kafka2
172.16.1.13 kafka3
EOF

# 创建数据目录
mkdir -p /data/kafka
```

### 三、下载解压（所有节点）

```bash
# 版本号在 https://downloads.apache.org/kafka/ 找最新的
cd /server/tools
wget https://downloads.apache.org/kafka/4.3.1/kafka_2.13-4.3.1.tgz
tar -xzf kafka_2.13-4.3.1.tgz -C /server/
ln -s /server/kafka_2.13-4.3.1 /server/kafka
```

> `2.13` 是 Scala 编译版本号，不是 Kafka 版本

### 四、配置文件

三个节点的配置只有 `node.id` 和 `advertised.listeners` 两处不同，其余完全一致。下面以 kafka1 为例：

```properties
# KRaft 角色定义, 合并模式两者都写; 纯 controller 节点只写 controller
process.roles=broker,controller
# 节点 ID, 集群内唯一, kafka1/2/3 分别为 1/2/3 (取代老版本的 broker.id)
node.id=1
# controller quorum 成员地址, 三个节点写完全一样 (动态 quorum 用法)
controller.quorum.bootstrap.servers=kafka1:9093,kafka2:9093,kafka3:9093
# 监听器: 9092 数据面, 9093 控制面
listeners=PLAINTEXT://:9092,CONTROLLER://:9093
# broker 之间复制走数据面监听器
inter.broker.listener.name=PLAINTEXT
# 对外通告地址, 客户端拿到元数据后按这个地址来连, 必须写其他机器可达的地址
advertised.listeners=PLAINTEXT://kafka1:9092,CONTROLLER://kafka1:9093
controller.listener.names=CONTROLLER
listener.security.protocol.map=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
# 数据目录(元数据日志和数据分区都在这里), 生产环境放独立数据盘
log.dirs=/data/kafka
# 新建 topic 默认分区数
num.partitions=3
# 自动创建 topic 的默认副本数(不配默认是 1, 相当于裸奔)
default.replication.factor=3
# 消息保留时长, 默认 7 天
log.retention.hours=168
# 单个日志段文件大小, 到了就滚动新 segment, 删除过期数据按 segment 整个删
log.segment.bytes=1073741824
# 消费位移 topic 的副本数, 必须在首次启动前设对, 内部 topic 建好后再改不生效
offsets.topic.replication.factor=3
# 事务状态 topic 副本数和最小 ISR
transaction.state.log.replication.factor=3
transaction.state.log.min.isr=2
```

> **单机版差异**: `node.id=1`；`controller.quorum.bootstrap.servers=localhost:9093`；`advertised.listeners=PLAINTEXT://localhost:9092`；三个 replication.factor 相关参数保持 1（单机没得选）
>
> 老版本教程里常见的 `controller.quorum.voters=1@kafka1:9093,...` 是静态 quorum 用法，和 `controller.quorum.bootstrap.servers` 二选一，动态 quorum 下配了 voters 反而起不来
>
> 元数据日志默认放在 `log.dirs` 的第一个目录里，不用单独配 `metadata.log.dir`

### 五、格式化存储（首次启动前必须做）

新版本强制手动格式化，防止空目录自动格式化掩盖故障（比如多数 controller 拿空日志选主，元数据就没了）。

```bash
# 在 kafka1 上生成 1 个集群 ID + 3 个节点目录 ID, 记下这 4 个值
CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
C1="$(bin/kafka-storage.sh random-uuid)"
C2="$(bin/kafka-storage.sh random-uuid)"
C3="$(bin/kafka-storage.sh random-uuid)"

# 在每个节点分别执行 format, 三个节点的 --initial-controllers 参数值必须完全一致
# 格式: <node.id>@<controller地址>:<端口>:<该节点的目录ID>
# kafka1 上执行:
bin/kafka-storage.sh format --cluster-id ${CLUSTER_ID} \
  --initial-controllers "1@kafka1:9093:${C1},2@kafka2:9093:${C2},3@kafka3:9093:${C3}" \
  -c /server/kafka/config/server.properties
# kafka2、kafka3 上执行同样的命令(参数不变)

# 输出类似: Formatting /data/kafka with metadata.version 4.3-IV0.
```

> **单机版差异**: 不用生成节点目录 ID，也用不着 `--initial-controllers`，直接
> `bin/kafka-storage.sh format --standalone -t ${CLUSTER_ID} -c /server/kafka/config/server.properties`

### 六、启动（所有节点）

```bash
# 前台启动(调试看日志用)
bin/kafka-server-start.sh /server/kafka/config/server.properties

# 后台启动, 堆默认 -Xmx1G -Xms1G(启动脚本写死), 生产按流量调
KAFKA_HEAP_OPTS="-Xmx1G -Xms1G" bin/kafka-server-start.sh -daemon /server/kafka/config/server.properties

# 确认进程
jps -l | grep kafka
# xxx kafka.Kafka
```

### 七、systemd 服务管理（所有节点）

```bash
cat > /etc/systemd/system/kafka.service <<'EOF'
[Unit]
Description=Apache Kafka (KRaft)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
Environment=KAFKA_HEAP_OPTS=-Xmx1G -Xms1G
ExecStart=/server/kafka/bin/kafka-server-start.sh /server/kafka/config/server.properties
ExecStop=/server/kafka/bin/kafka-server-stop.sh
Restart=on-failure
LimitNOFILE=100000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable kafka --now
```

### 八、验证

```bash
# 1. 看 controller quorum 状态: Leader 应该是某个 node.id, 两个 Follower
bin/kafka-metadata-quorum.sh describe --status --bootstrap-server kafka1:9092
# ClusterId:              xxx
# LeaderId:               1
# LeaderEpoch:            1
# HighWatermark:          10
# [FollowerId: 2, ...] [FollowerId: 3, ...]

# 2. 看 controller 复制是否同步: Lag 应为 0
bin/kafka-metadata-quorum.sh describe --replication --bootstrap-server kafka1:9092

# 3. 建 topic 副本分散到三台
bin/kafka-topics.sh --create --topic test --partitions 3 --replication-factor 3 --bootstrap-server kafka1:9092

# 4. 每个 partition 的 Leader/Replicas/Isr 应该是三个不同节点
bin/kafka-topics.sh --describe --topic test --bootstrap-server kafka1:9092
# Topic: test  Partition: 0  Leader: 2  Replicas: 2,3,1  Isr: 2,3,1
# Topic: test  Partition: 1  Leader: 3  Replicas: 3,1,2  Isr: 3,1,2
# Topic: test  Partition: 2  Leader: 1  Replicas: 1,2,3  Isr: 1,2,3

# 5. 收发消息验证
bin/kafka-console-producer.sh --topic test --bootstrap-server kafka1:9092
bin/kafka-console-consumer.sh --topic test --from-beginning --bootstrap-server kafka1:9092
```

### 九、防火墙

```bash
firewall-cmd --permanent --add-port=9092/tcp --add-port=9093/tcp
firewall-cmd --reload
```

### 十、运维常用知识点

```bash
# 1. 消费组管理(最常用)
# 查看所有消费组(4.x 新增 kafka-groups.sh, 能看到组的类型)
bin/kafka-groups.sh --bootstrap-server kafka1:9092 --list
# GROUP                    TYPE                     PROTOCOL
# my-consumer-group        Consumer                 consumer
# my-share-group           Share                    share

# 老命令同样可用
bin/kafka-consumer-groups.sh --bootstrap-server kafka1:9092 --list
# test-consumer-group

# 查看某组消费进度和积压(核心: LAG = LOG-END-OFFSET - CURRENT-OFFSET)
bin/kafka-consumer-groups.sh --describe --group <组名> --bootstrap-server kafka1:9092
# 只看组状态和成员数
bin/kafka-consumer-groups.sh --describe --group <组名> --state --bootstrap-server kafka1:9092
# 删除空消费组(要求组内无活跃成员, 常用于清理测试遗留的组)
bin/kafka-consumer-groups.sh --delete --group <组名> --bootstrap-server kafka1:9092
```

```bash
# 2. topic 级配置动态修改: 单独给某个 topic 改保留时间(覆盖 broker 的 log.retention.hours)
# 例: test 保留 3 天
bin/kafka-configs.sh --bootstrap-server kafka1:9092 --entity-type topics \
  --entity-name test --alter --add-config retention.ms=259200000
# 删除 topic 级配置(恢复用 broker 默认值)
bin/kafka-configs.sh --bootstrap-server kafka1:9092 --entity-type topics \
  --entity-name test --alter --delete-config retention.ms
# 注意: topic 分区数只能加不能减
```

```bash
# 3. 排查数据: 用 --partition 裸读, 不产生消费组、不提交位移、不残留垃圾组
bin/kafka-console-consumer.sh --topic test --partition 0 --offset earliest --bootstrap-server kafka1:9092
# 看某 topic 每个分区的起止位移
bin/kafka-get-offsets.sh --topic test --bootstrap-server kafka1:9092
```

```bash
# 4. controller quorum 健康检查(每次巡检/变更后必看)
bin/kafka-metadata-quorum.sh describe --status --bootstrap-server kafka1:9092
bin/kafka-metadata-quorum.sh describe --replication --bootstrap-server kafka1:9092   # Lag 应为 0
```

```bash
# 5. 服务日志位置: 进程日志不在这里! 默认 $KAFKA_HOME/logs(LOG_DIR 环境变量可改)
# systemd 部署时 LOG_DIR 未设置, 日志在 /server/kafka/logs/, 注意和数据目录 /data/kafka 区分开
```

```bash
# 6. 核心监控指标(JMX, 配 Prometheus JMX Exporter 采集)
# kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions    期望 0, >0 有副本掉出 ISR
# kafka.server:type=ReplicaManager,name=UnderMinIsrPartitionCount    期望 0, >0 写入面临拒绝(NotEnoughReplicas)
# kafka.controller:type=KafkaController,name=ActiveControllerCount   全集群仅 1 台为 1, 其余为 0
# kafka.controller:type=KafkaController,name=OfflinePartitionsCount  期望 0, >0 有分区无 leader, 业务中断
# kafka.server:type=KafkaRequestHandlerPool,name=RequestHandlerAvgIdlePercent  处理线程空闲率, 持续偏低说明 CPU 扛不住了
```

> 监控告警建议: UnderReplicatedPartitions 持续 > 0、OfflinePartitionsCount > 0、ActiveControllerCount ≠ 1，这三个是集群级红灯

### 总结

1. 集群版三步走: 改配置(只有 node.id 和 advertised.listeners 两个节点不同) -> format 存储 -> 启动
2. `--initial-controllers` 里的目录 ID 每个节点一个，但三个节点执行的 format 命令参数必须完全一致
3. `offsets.topic.replication.factor` 必须在首次启动前设成 3，内部 topic 建好后改配置无效
4. 动态 quorum 用 `controller.quorum.bootstrap.servers`，不要再配 `controller.quorum.voters`（二选一）
5. 验收集群是否健康: metadata-quorum 看 Leader 和 Lag，`--describe` 看 ISR 是否满 3 个
6. 日常运维三板斧: consumer-groups 看积压、metadata-quorum 看控制面、JMX 三个集群级红灯指标
7. 单机版差异: format 用 `--standalone`，副本数参数保持 1， advertised 写 localhost


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/790091013/  

