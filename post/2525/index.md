# flannel完全卸载

<!--more-->
1.删除flannel
```bash
# k8s部署的
kubectl delete daemonset -n kube-system kube-flannel

# 二进制部署的
systemctl stop flanneld
rm -f /etc/systemd/system/flanneld.service
rm -f /usr/local/bin/flanneld
```

2.删除flannel和cni网卡等配置
```bash
# cni
ifconfig cni0 down
ip link delete cni0
rm -rf /var/lib/cni/
rm -f /etc/cni/net.d/*

# flannel
ifconfig flannel.1 down
ip link delete flannel.1
rm -fr /var/run/flannel/
rm -fr /etc/kube-flannel
```

3.手动清除路由
```bash
route del -net 10.244.x.x/24 gw xxx.xxx.xxx.xxx
```

4.重启kubelet
```bash
systemctl restart kubelet
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2525/  

