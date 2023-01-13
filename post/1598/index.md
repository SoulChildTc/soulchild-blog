# k8s使用基于nfs的storage class

<!--more-->
## 1.安装nfs服务（略）

## 2.配置yaml文件

可以提前拉镜像：docker pull quay.io/external_storage/nfs-client-provisioner:latest

<a href="https://github.com/kubernetes-incubator/external-storage/blob/master/nfs-client/deploy/deployment.yaml">deployment.yaml</a>

需要修改你的nfs地址，和nfs共享目录
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: quay.io/external_storage/nfs-client-provisioner:latest
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: fuseim.pri/ifs
            - name: NFS_SERVER
              value: 10.0.0.100
            - name: NFS_PATH
              value: /data/sc-test/
      volumes:
        - name: nfs-client-root
          nfs:
            server: 10.0.0.100
            path: /data/sc-test/</code></pre>
```

<a href="https://github.com/kubernetes-incubator/external-storage/blob/master/nfs-client/deploy/rbac.yaml">rbac.yaml</a>

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: nfs-client-provisioner-runner
rules:
  - apiGroups: [""]
    resources: ["persistentvolumes"]
    verbs: ["get", "list", "watch", "create", "delete"]
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "list", "watch", "update"]
  - apiGroups: ["storage.k8s.io"]
    resources: ["storageclasses"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "update", "patch"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-nfs-client-provisioner
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: ClusterRole
  name: nfs-client-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["endpoints"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
subjects:
  - kind: ServiceAccount
    name: nfs-client-provisioner
    # replace with namespace where provisioner is deployed
    namespace: default
roleRef:
  kind: Role
  name: leader-locking-nfs-client-provisioner
  apiGroup: rbac.authorization.k8s.io</code></pre>
```

<a href="https://github.com/kubernetes-incubator/external-storage/blob/master/nfs-client/deploy/class.yaml">class.yaml</a>
```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: test-nfs-storage
provisioner: fuseim.pri/ifs # fuseim.pri/ifs这个名称要和上面的delpoyment中PROVISIONER_NAME环境变量一致
parameters:
  archiveOnDelete: "false"  # archiveOnDelete为false表示不存档，即删除数据，true表示存档，即重命名路径。格式为archieved-${namespace}-${pvcName}-${pvName}
```
创建资源上面所有的资源


## 3.创建PVC
```
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-pvc
  annotations:
    volume.beta.kubernetes.io/storage-class: "test-nfs-storage" # 注解需要指定对应的storageclass
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Mi
```
现在可以通过kubectl get pvc查看pvc的状态了

NAME STATUS VOLUME CAPACITY ACCESS MODES STORAGECLASS AGE
test-pvc Bound pvc-1bdc10af-860c-11ea-a9e0-000c29a221f1 1Mi RWX test-nfs-storage 42m

pv的状态

NAME CAPACITY ACCESS MODES RECLAIM POLICY STATUS CLAIM STORAGECLASS REASON AGE
pvc-1bdc10af-860c-11ea-a9e0-000c29a221f1 1Mi RWX Delete Bound default/test-pvc test-nfs-storage 6m35s

**当注解中指定storage-class时，pv会被自动创建,即上面的**`volume.beta.kubernetes.io/storage-class: "test-nfs-storage"`

**如果没有在pvc中写注解的话，可以在storage-class中修改配置，在metadata下添加如下内容。修改后默认会自动创建pv，但是这样灵活性就会变差**

kubectl edit sc test-nfs-storage
```
annotations:
  storageclass.kubernetes.io/is-default-class: "true"
```

** 测试一下没有注解的pvc，创建后可以发现依然会自动创建pv，我们上面修改的目的达到了**
```
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-pvc2
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Mi
```

NAME STATUS VOLUME CAPACITY ACCESS MODES STORAGECLASS AGE
test-pvc Bound pvc-1bdc10af-860c-11ea-a9e0-000c29a221f1 1Mi RWX test-nfs-storage 73m
test-pvc2 Bound pvc-c83e647a-8614-11ea-a9e0-000c29a221f1 1Mi RWX test-nfs-storage 11m

**pvc(pv)创建成功后会在nfs的共享目录（/data/sc-test）创建一个`${namespace}-${pvcName}-${pvName}`这样的目录**

## 4.配置测试pod
```
kind: Pod
apiVersion: v1
metadata:
  name: test-pod
spec:
  containers:
  - name: test-pod
    image: busybox:1.24
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "touch /mnt/SUCCESS &amp;&amp; exit 0 || exit 1"
    volumeMounts:
      - name: nfs-pvc
        mountPath: "/mnt"
  restartPolicy: "Never"
  volumes:
    - name: nfs-pvc
      persistentVolumeClaim:
        claimName: test-pvc
```
当看到SUCCESS文件代表成功了

/data/sc-test/default-test-pvc-pvc-1bdc10af-860c-11ea-a9e0-000c29a221f1/SUCCESS


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1598/  

