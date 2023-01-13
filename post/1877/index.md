# hadoop3.2.1集群部署

<!--more-->
HDFS的守护进程分别是NameNode, SecondaryNameNode,DataNode.
YARN的守护进程分别是ResourceManager, NodeManager,WebAppProxy.
## 一、安装前准备：
|主机名|IP|角色|
|-
|hadoop-01| 10.0.0.150|namenode、datanode、resourcemanager、nodemanager|
|hadoop-02| 10.0.0.151|datanode、nodemanager|
|hadoop-03| 10.0.0.152|datanode、nodemanager|

### 1.hosts解析：
三台机器配置
```
cat >> /etc/hosts <<EOF
10.0.0.150    hadoop-01
10.0.0.151    hadoop-02
10.0.0.152    hadoop-03
EOF
```
### 2.配置免密登陆
```
# 创建用户
useradd hadoop
su hadoop
ssh-keygen -P '' -t rsa -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> authorized_keys
chmod 600 ~/.ssh/authorized_keys
# 发送配置到其他机器
for i in {151..152};do scp -rp ~/.ssh/ root@10.0.0.$i:/home/hadoop/;done
for i in {151..152};do ssh root@10.0.0.$i chown -R hadoop:hadoop /home/hadoop/;done
```

### 3.准备安装包：
三台机器配置
```
mkdir  /server/packages -p
cd /server/packages
[root@hadoop-01 packages]# ls /server/packages/
hadoop-3.2.1.tar.gz  jdk-8u221-linux-x64.tar.gz
# 发送软件包到其他节点
for i in {151..152};do scp ./* hadoop@10.0.0.$i:`pwd`;done
```

## 二、安装jdk：
三台机器配置
```
tar xf jdk-8u221-linux-x64.tar.gz
mv jdk1.8.0_221/ /usr/local/jdk

```

## 三、安装hadoop
三台机器配置
```
tar xf hadoop-3.2.1.tar.gz
mv hadoop-3.2.1 /usr/local/hadoop
chown -R hadoop.hadoop /usr/local/hadoop
```

## 四、配置环境变量
三台机器配置
```
echo 'export JAVA_HOME=/usr/local/jdk' >> /etc/profile
echo 'export HADOOP_HOME=/usr/local/hadoop' >> /etc/profile
echo 'export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin' >> /etc/profile
source /etc/profile
```
## 五、配置hadoop
在每个节点配置JAVA_HOME
```
su hadoop
cd /usr/local/hadoop
sed -i 's@# export JAVA_HOME=@export JAVA_HOME=/usr/local/jdk@' etc/hadoop/hadoop-env.sh
```

#### etc/hadoop/core-site.xml
```
<configuration>
    <property>
        <!--使用默认文件系统-->
        <name>fs.defaultFS</name>
        <!--指定文件系统的IP和端口-->
        <value>hdfs://hadoop-01:9000</value>
    </property>
</configuration>
```

#### etc/hadoop/hdfs-site.xml
```
<!--默认值3,hdfs存储数据的副本数-->
<property>
    <name>dfs.replication</name>
    <value>3</value>
</property>
 
<!--dfs namenode web界面的监听地址-->
<property>
    <name>dfs.namenode.http-address</name>
    <value>hadoop-01:9870</value>
</property>

<!-- dfs保存namenode数据的路径-->
<property>
    <name>dfs.namenode.name.dir</name>
    <value>/data/hadoop/hdfs/name</value>
</property>  

<!-- dfs保存datanode数据的路径-->
<property>
    <name>dfs.datanode.data.dir</name>
    <value>/data/hadoop/hdfs/data</value>
</property>

```
#### etc/hadoop/yarn-site.xml
配置ResourceManager和NodeManager:
```
<property>
    <name>yarn.resourcemanager.hostname</name>
    <value>hadoop-01</value>
</property>

```
#### etc/hadoop/mapred-site.xml
配置MapReduce
```
<property>
    <!--执行框架设置为YARN-->
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
</property>
```


#### 添加工作节点信息
```
cat > etc/hadoop/workers <<EOF
hadoop-01
hadoop-02
hadoop-03
EOF
```

#### 复制配置文件
```
cd /usr/local/hadoop
for i in {151..152};do scp -rp etc/hadoop/* 10.0.0.$i:`pwd`/etc/hadoop;done
```

## 6.启动hdfs
```
# 格式化文件系统
hdfs namenode -format
# 启动nodename
hdfs --daemon start namenode
hdfs --daemon start datanode
```

#### hadoop-02，hadoop-03启动datanode
```
hdfs --daemon start datanode
```

## 7.启动yarn
hadoop-01启动resourcemanager、nodemanager
```
yarn --daemon start resourcemanager
yarn --daemon start nodemsnager
```

hadoop-02、hadoop-03启动nodemanager
```
yarn --daemon start nodemanager
```

hdfs web界面：
http://hadoop-01:9870

yarn web界面：
http://hadoop-01:8088/cluster/nodes






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1877/  

