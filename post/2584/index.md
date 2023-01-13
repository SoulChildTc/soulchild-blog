# 使用etcdhelper查询etcd中k8s的资源数据

<!--more-->
项目地址: https://github.com/openshift/origin

k8s存在etcd中的数据是经过protobuf序列化的,直接查看会存在乱码的情况,使用etcdhelper可解决这个问题

### 一、编译安装
```bash
# 拉取代码
git clone --depth 1 https://github.com/openshift/origin.git

# 跨平台编译二进制文件(我是mac系统,编译成linux可执行二进制文件)
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build tools/etcdhelper/etcdhelper.go

# 如果你是windows,请使用以下命令
SET CGO_ENABLED=0
SET GOOS=linux
SET GOARCH=amd64
go build tools/etcdhelper/etcdhelper.go

# 将编译好的二进制程序放入系统环境变量可识别的地方
mv etcdhelper /usr/local/bin/
```

这里有一个我已经编译好的: [http://soulchild.cn/down/etcdhelper](http://soulchild.cn/down/etcdhelper)


### 二、使用
用alias起个别名,方便使用
```
# 这里endpoint不可以写多节点
echo 'alias etcdhelper="etcdhelper -endpoint https://172.17.20.201:2379 -cacert /etc/kubernetes/pki/ca/ca.pem -key /etc/kubernetes/pki/etcd/etcd-key.pem -cert /etc/kubernetes/pki/etcd/etcd.pem"' >> ~/.bashrc

source ~/.bashrc
```

使用方法:
```bash
# 查看key列表
etcdhelper ls

# 查看key的value
etcdhelper get /registry/pods/default/my-pod
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2584/  

