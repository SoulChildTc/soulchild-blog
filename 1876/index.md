# hadoop3.2.1伪分布式模式安装

<!--more-->
### 1.安装jdk：
```
tar xf jdk-8u221-linux-x64.tar.gz
mv jdk1.8.0_221 /usr/local/jdk
```

### 2.安装hadoop：
```
wget https://mirrors.bfsu.edu.cn/apache/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz
mv hadoop-3.2.1 /usr/local/hadoop
useradd hadoop
chown -R hadoop.hadoop /usr/local/hadoop
```

### 3.配置环境变量
```bash
echo 'export JAVA_HOME=/usr/local/jdk' >> /etc/profile
echo 'export HADOOP_HOME=/usr/local/hadoop' >> /etc/profile
echo 'export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin' >> /etc/profile
```
### 4.设置主机名，配置hosts解析
```
hostnamectl set-hostname hadoop
echo '127.0.0.1    hadoop' >> /etc/hosts
```


### 5.配置免密通信
```
su hadoop
ssh-keygen -t rsa -f ~/.ssh/id_rsa -P ''
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 5.修改hadoop配置
su hadoop
vim /usr/local/hadoop/etc/hadoop/hadoop-env.sh
```
export JAVA_HOME=/usr/local/jdk
```

vim /usr/local/hadoop/etc/hadoop/core-site.xml:
```
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://hadoop:9000</value>
    </property>
</configuration>
```

vim /usr/local/hadoop/etc/hadoop/hdfs-site.xml
```
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

### 6.在本地运行MapReduce任务
#### 6.1 格式化文件系统
```
hdfs namenode -format
```
#### 6.2 启动NameNode守护程序和DataNode守护程序：
```
/usr/local/hadoop/sbin/start-dfs.sh
```
可以通过浏览器访问验证：```http://xx.xx.xx.xx:9870```

#### 6.3 创建hdfs目录
```
su hadoop
hdfs dfs -mkdir /user
bin/hdfs dfs -mkdir /user/hadoop
```

#### 6.4 将input file复制到分布式文件系统hdfs
```
hdfs dfs -mkdir input
hdfs dfs -put etc/hadoop/*.xml input
```

#### 6.5 运行一个示例
```
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar grep input output 'dfs[a-z.]+'
```

#### 6.6 检查输出文件：将输出文件从分布式文件系统hdfs复制到本地文件系统并检查它们：
```
hdfs dfs -get output output
cat output/*
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1876/  

