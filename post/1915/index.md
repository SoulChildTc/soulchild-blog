# etcd备份

<!--more-->
命令:

```bash
etcdctl --cacert=/etc/kubernetes/pki/etcd/ca.crt  --cert=/etc/kubernetes/pki/etcd/peer.crt  --key=/etc/kubernetes/pki/etcd/peer.key
```

集群节点列表：

```bash
ETCDCTL_API=3 etcdctl \
--cacert=/etc/kubernetes/pki/etcd/ca.crt  \
--cert=/etc/kubernetes/pki/etcd/peer.crt  \
--key=/etc/kubernetes/pki/etcd/peer.key  \
member list
```

etcd备份：

```bash
ETCDCTL_API=3 etcdctl \
--cacert=/etc/kubernetes/pki/etcd/ca.crt  \
--cert=/etc/kubernetes/pki/etcd/peer.crt  \
--key=/etc/kubernetes/pki/etcd/peer.key \
snapshot save 202008131304.db
```

etcd恢复：

```bash
ETCDCTL_API=3 etcdctl \
--cacert=/etc/kubernetes/pki/etcd/ca.crt  \
--cert=/etc/kubernetes/pki/etcd/peer.crt  \
--key=/etc/kubernetes/pki/etcd/peer.key \
snapshot restore 202008131304.db
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1915/  

