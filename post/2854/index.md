# 配置ack的nas storageclass

<!--more-->
主要是备忘,前提要有alicloud-nas-controller
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: alicloud-nas-devops
mountOptions:
- nolock,tcp,noresvport
- vers=4
parameters:
  server: xxx.xxx.nas.aliyuncs.com:/
  volumeAs: subpath
  archiveOnDelete: "true"
provisioner: alicloud/nas
reclaimPolicy: Delete
volumeBindingMode: Immediate
```

pvc测试
```bash
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  labels:
    app: test
  name: test
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: alicloud-nas-devops
  volumeMode: Filesystem
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2854/  

