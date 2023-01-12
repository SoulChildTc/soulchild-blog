# k8s 1.14.2 使用kubeadm给证书续期

<!--more-->
参考：https://www.ancii.com/ahevxud6j/

证书到期后会提示:```Unable to connect to the server: x509: certificate has expired or is not yet valid```

查看证书过期时间：
```bash
# 方法1
kubeadm alpha certs check-expiration

# 方法2
openssl x509 -noout -dates -in /etc/kubernetes/pki/apiserver.crt
```

各个证书的过期时间

```bash
/etc/kubernetes/pki/apiserver.crt                #1年有效期
/etc/kubernetes/pki/front-proxy-ca.crt           #10年有效期
/etc/kubernetes/pki/ca.crt                       #10年有效期
/etc/kubernetes/pki/apiserver-etcd-client.crt    #1年有效期
/etc/kubernetes/pki/front-proxy-client.crt       #1年有效期
/etc/kubernetes/pki/etcd/server.crt              #1年有效期
/etc/kubernetes/pki/etcd/ca.crt                  #10年有效期
/etc/kubernetes/pki/etcd/peer.crt                #1年有效期
/etc/kubernetes/pki/etcd/healthcheck-client.crt  #1年有效期
/etc/kubernetes/pki/apiserver-kubelet-client.crt #1年有效期
```

1.备份配置文件和etcd
```bash
cp -rp /etc/kubernetes /etc/kubernetes.bak
cp -r /var/lib/etcd /var/lib/etcd.bak
```

2.生成集群配置文件
```bash
kubeadm config view > ./cluster.yaml
```

3.证书续期
```bash
kubeadm alpha certs renew all --config=./cluster.yaml
```

4.重新生成配置文件
```bash
rm -f /etc/kubernetes/*.conf
kubeadm init phase kubeconfig all --config=./cluster.yaml
```

5.重启kubelet、apiserver、controller-manager、scheduler、etcd
```bash
docker ps |grep -E 'k8s_kube-apiserver|k8s_kube-controller-manager|k8s_kube-scheduler|k8s_etcd_etcd' | awk -F ' ' '{print $1}' |xargs docker restart
```

6.查看证书过期时间
```bash
for item in `find /etc/kubernetes/pki -maxdepth 2 -name "*.crt"`;do openssl x509 -in $item -text -noout| grep Not;echo ======================$item===============;done
```

7.复制新的认证文件
```bash
rm -fr ~/.kube/
cp /etc/kubernetes/admin.conf ~/.kube/config
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1558/  

