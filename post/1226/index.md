# 简略版deployment、pv、pvc资源文件模板

<!--more-->
## deployment
```
apiVersion: v1
kind: Service
metadata:
  labels:
    app: {name}
  name: {name}
  namespace: {namespace}
spec:
  ports:
  - port: {cluster ip端口}
    protocol: TCP
    targetPort: {容器端口}
    nodePort: {宿主机端口}

  selector:
    app: {name}
  type: NodePort

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}
  namespace: {namespace}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {name}
  template:
    metadata:
      labels:
        app: {name}  #和matchLabels中的一致
    spec:
      imagePullSecrets:
      - name: {secret}
      containers:
      - name: {container-name}
        image: {image_name}
        ports:
        - containerPort: {容器端口}
        command: ['java']
        args: ['-Dspring.profiles.active=test','-jar','xx.jar']
        volumeMounts: # 将存储卷挂载到容器中
          - name: {name}   # 指定使用哪个存储卷
            mountPath: "/data/www/images"
      volumes: #定义存储卷
      - name: {volumes_name} #定义存储卷名称
        persistentVolumeClaim:
          claimName: {pvc_name} #指定使用哪个pvc
```
## pv
```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: {name}
spec:
  capacity:
    storage: 40Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: "/nfsdata/xxx"
    server: 10.0.0.10
    readOnly: false
```

## pvc
```
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: {name}
  namespace: {namespace}
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 40Gi
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1226/  

