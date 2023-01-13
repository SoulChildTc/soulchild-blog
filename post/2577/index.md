# k8s 使用statefulset部署mysql主从

<!--more-->
### 前言
原文档地址: https://kubernetes.io/zh/docs/tasks/run-application/run-replicated-stateful-application/
使用本文档部署需要集群中提前配置好storage-class，或者手动创建pv，pvc

### 1.创建configmap mysql配置文件
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql
  labels:
    app: mysql
data:
  master.cnf: |
    [mysqld]
    log-bin
  slave.cnf: |
    [mysqld]
    super-read-only
```

### 2.创建svc
```bash
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
  labels:
    app: mysql
spec:
  ports:
  - name: mysql
    port: 3306
  clusterIP: None
  selector:
    app: mysql
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-read
  labels:
    app: mysql
spec:
  ports:
  - name: mysql
    port: 3306
  selector:
    app: mysql
```
> 一个headless service和一个普通service，headless用于statefulset,给每个pod提供一个固定的dns记录，普通service提供负载均衡

### 3.创建statefulset
```bash
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  # service-headless为每个pod提供一个固定的dns解析,eg:mysql-0.mysql,mysql-1.mysql
  serviceName: mysql
  replicas: 3
  template:
    metadata:
      labels:
        app: mysql
    spec:
      initContainers:
      # 用于生成主从配置文件的容器
      - name: init-mysql
        image: mysql:5.7
        volumeMounts:
        - name: conf
          mountPath: /mnt/conf.d
        - name: config-map
          mountPath: /mnt/config-map
        command:
        - bash
        - "-c"
        - |
          set -ex
          # 使用正则匹配pod序号,结果会存在BASH_REMATCH变量中
          [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
          # 获取序号
          ordinal=${BASH_REMATCH[1]}
          # server-id=0有特出含义,因此给ID+100来避开它
          serverid=$(($ordinal+100))
          # 写入到配置文件中
          echo -e "[mysqld]\nserver-id=$serverid" > /mnt/conf.d/server-id.cnf
          # 如果是主节点,将主节点配置文件复制到/mnt/conf.d,负责复制从节点
          if [[ $ordinal == 0 ]];then
            cp /mnt/config-map/master.cnf /mnt/conf.d/
          else
            cp /mnt/config-map/slave.cnf /mnt/conf.d/
          fi
      # 用于从节点容器启动时复制数据
      - name: clone-mysql
        image: registry.cn-shanghai.aliyuncs.com/soulchild/xtrabackup:2.4
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
          subPath: mysql
        command:
        - bash
        - -c
        - |
          set -ex
          # 复制数据操作只有在第一次没有数据的时候需要,所以判断数据存在则跳过
          [[ -d /var/lib/mysql/mysql ]] && exit 0
          # 正则匹配序号,匹配失败则异常退出
          [[ `hostname` =~ -([0-9]+$) ]] || exit 1
          # 获取序号
          ordinal=${BASH_REMATCH[1]}
          # 主节点不需要复制操作
          [[ $ordinal == 0 ]] && exit 0
          # 使用ncat从前一个节点中复制数据,3307端口是我们启动的一个sidecar容器，他是使用ncat运行的一个服务,这个服务的具体操作可以看xtrabackup容器的配置
          ncat --recv-only mysql-$((ordinal-1)).mysql 3307 | xbstream -x -C /var/lib/mysql
          # --prepare参数,在备份完成后，数据尚且不能用于恢复操作，因为备份的数据中可能会包含尚未提交的事务或已经提交但尚未同步至数据文件中的事务.
          xtrabackup --prepare --target-dir=/var/lib/mysql
      containers:
      - name: mysql
        image: mysql:5.7
        ports:
        - name: mysql
          containerPort: 3306
        env:
        - name: MYSQL_ALLOW_EMPTY_PASSWORD
          value: "1"
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
          subPath: mysql
        - name: conf
          mountPath: /etc/mysql/conf.d
        resources:
          requests:
            memory: 1Gi
            cpu: 500m
          limits:
            memory: 1Gi
            cpu: 500m
        startupProbe:
          exec:
            command: ["mysql", "-h", "127.0.0.1", "-e", "select 1"]
        livenessProbe:
          exec:
            command: ["mysqladmin", "ping"]
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
        readinessProbe:
          exec:
            command: ["mysql", "-h", "127.0.0.1", "-e", "select 1"]
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 2
      - name: xtrabackup
        image: registry.cn-shanghai.aliyuncs.com/soulchild/xtrabackup:2.4
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
          subPath: mysql
        - name: conf
          mountPath: /etc/mysql/conf.d
        command:
        - bash
        - "-c"
        - |
          set -ex
          cd /var/lib/mysql
          # xtrabackup备份后会生成一个文件,有两种情况,xtrabackup_slave_info和xtrabackup_binlog_info
          if [[ -f xtrabackup_slave_info ]];then
              # xtrabackup_slave_info存在则表示这个备份来自一个从节点,文件包含change master to sql语句,将这个文件改为change_master_to.sql.in
              cat xtrabackup_slave_info | sed -E 's/;$//g' > change_master_to.sql.in
              rm -f xtrabackup_slave_info
          elif [[ -f xtrabackup_binlog_info ]];then
              # 如果只存在xtrabackup_binlog_info文件则备份来自主节点,这个文件包含了bin-log文件名和position偏移量,需要我们自己解析成change master to sql
              # 使用正则解析获取binlog信息,并生成change master to sql
              [[ `cat xtrabackup_binlog_info` =~ ^(.*?)[[:space:]]+([0-9]+)$ ]] || exit 1
              echo "CHANGE MASTER TO MASTER_LOG_FILE='${BASH_REMATCH[1]}', MASTER_LOG_POS=${BASH_REMATCH[2]}" > change_master_to.sql.in
              # 删除xtrabackup_binlog_info,防止下一次没有经过备份时,重复生成change_master_to.sql.in
              rm -f xtrabackup_binlog_info
          fi
          # 判断initcontainer是否进行了备份,如果进行了备份会经过我们上面的逻辑生成change_master_to.sql.in,如果存在change_master_to.sql.in，则需要执行相应的sql
          if [[ -f change_master_to.sql.in ]];then
              # 等待mysql容器启动
              echo 'Waiting for mysqld to be ready (accept connections)'
              until mysql -h 127.0.0.1 -e 'select 1';do sleep 1;done
              sleep 5
              echo 'Initializing replication from clone position'
              # 执行change master sql
              sql="$(<change_master_to.sql.in), master_host='mysql-0.mysql', master_user='root', master_password='', master_connect_retry=10; start slave;"
              mysql -h 127.0.0.1 -e "$sql" || exit 1
              # 重命名change_master_to.sql.in文件，防止重复执行change master
              mv change_master_to.sql.in change_master_to.sql.in.orig
          fi
          # 使用ncat监听3307端口,在收到传输请求时会执行xtrabackup备份操作,然后传输数据给请求数据的节点
          # 使用exec将ncat作为常驻进程,决定这个容器的生命周期
          exec ncat --listen --keep-open --send-only --max-conns=1 3307 -c "xtrabackup --backup --slave-info --stream=xbstream --host=127.0.0.1 --user=root"
      volumes:
      - name: conf
        emptyDir: {}
      - name: config-map
        configMap:
          name: mysql
  volumeClaimTemplates:
  - metadata:
      name: mysql-data
    spec:
      storageClassName: nfs-storage
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 10Gi
```

### 4. statefulset配置说明

#### 4.1 initContainer
下面介绍的是两个初始化容器配置，会在pod启动时优先启动的容器

**1.init-mysql容器**

该容器挂载了两个volume，分别是conf，config-map(在volumes中定义)。conf是pod中容器之间的共享卷(使用的emptyDir)，configmap是分别包含mysql主从的配置文件。conf挂载到/mnt/conf.d目录，configmap挂载到/mnt/config-map目录

这个容器在启动时会判断当前pod属否为master节点，这里的mysql-0指定为master节点，如果pod id是0则将id+100作为mysql server-id，并将配置内容写入到/mnt/conf.d/server-id.conf，同时将mysql主配置文件复制到/mnt/conf.d/目录下

此时conf这个卷包含了mysql主的配置文件和server-id配置文件

**2.clone-mysql容器**

这个容器是为从节点准备的,从节点在第一次启动时需要从主节点或前一个从节点进行全量数据同步
同样这里也使用了数据卷mysql-data，挂载到了/var/lib/mysql，同步的数据会存放在/var/lib/mysql中,提供给mysql主容器使用

mysql-data是通过pvc模版配置，这个卷的内容在每个pod中是不一样的。这需要你的k8s集群中支持storage-class

#### 4.2 常驻容器
下面介绍的是pod中的两个常驻容器，一个是mysql用于提供mysql服务。另一个是xtrabackup用于提供在其他节点首次启动时同步数据的功能和执行change master to sql将当前节点配置为从节点

**1.mysql容器**

这个容器挂载了两个数据卷，一个是conf用于存放mysql配置文件的，挂载到了/etc/mysql/conf.d中
另一个是mysql-data用于存放mysql数据文件，这个卷挂载到了/var/lib/mysql下，这个目录的数据由clone-mysql容器提供

**2.xtrabackup容器**
这个容器挂载了mysql-data数据卷，用于判断当前pod中的mysql是否需要执行change to master sql

第二个功能是使用ncat开启一个常驻进程，提供tcp传输mysql备份数据的能力



### 5.测试
#### 主节点造数据
```bash
k exec -it mysql-0 mysql

mysql> create database soulchild;
mysql> use soulchild
mysql> create table my_test(id int);
mysql> insert into my_test values(1);
```

#### 从节点查数据
```bash
k exec -it mysql-1 -- mysql -e 'show databases;'
+------------------------+
| Database               |
+------------------------+
| information_schema     |
| mysql                  |
| performance_schema     |
| soulchild              |
| sys                    |
| xtrabackup_backupfiles |
+------------------------+

k exec -it mysql-1 -- mysql -e 'use soulchild;show tables;'
+---------------------+
| Tables_in_soulchild |
+---------------------+
| my_test             |
+---------------------+

k exec -it mysql-1 -- mysql -e 'use soulchild;select id from my_test;'
+------+
| id   |
+------+
|    1 |
+------+
```













 


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2577/  

