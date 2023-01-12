# hostNetwork方式部署traefik2.2

<!--more-->
方式1:helm安装
1.给node添加标签，方便pod调度到指定节点
```
kubectl label nodes k8s-node04 traefik=true
```

2.自定义资源清单配置
vim my_values.yaml
```
# 使用hostNetwork,service就不需要了
service:
  enabled: false

# traefik是dashboard的配置，web和websecure是入口的配置
ports:
  traefik:
    expose: false
    port: 9000
  web:
    expose: false
    port: 80
  websecure:
    expose: false
    port: 443

# 监听1024以下的端口需要修改traefik默认的安全上下文配置
securityContext:
  capabilities:
    drop: []
  readOnlyRootFilesystem: false
  runAsGroup: 0
  runAsNonRoot: false
  runAsUser: 0

# 使用hostNetwork
hostNetwork: true

# 控制pod调度
nodeSelector:
  traefik: "true"
```

3.安装traefik
```
helm install traefik traefik/traefik --version=8.9.1 -f my_values.yaml
```

4.获取hostIP
```
kubectl get pod -l app.kubernetes.io/name=traefik  -o jsonpath={.items[0].status.hostIP};echo
```

5.做好解析后访问
```
http入口:
http://traefik.my.com/

https入口:
https://traefik.my.com/

dashboard:
http://traefik.my.com:9000/dashboard/
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1910/  

