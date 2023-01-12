# k8s中subpath的使用

<!--more-->
#### 有两种情况：
1.做为volumes使用时,subPath代表存储卷的子路径：
```
apiVersion: v1
kind: Pod
metadata:
  name: testpod0
spec:
  containers:
  - name: testc
    image: busybox
    command: ["/bin/sleep","10000"]
    volumeMounts:
      - name: data
        mountPath: /opt/data    # 挂载的路径
        subPath: data           # volume的子路径
      - name: data
        mountPath: /opt/model
        subPath: model
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: test-data
```


2.作为configmap/secret使用时,subPath代表configmap/secret的子路径：
configmap:
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: config-test
data:
  config.ini: "hello"
  config.conf: "nihao"
```

单独挂载一个key为文件：
```
apiVersion: v1
kind: Pod
metadata:
  name: testpod
spec:
  containers:
  - name: testc
    image: busybox
    command: ["/bin/sleep","10000"]
    volumeMounts:
      - name: config-test
        mountPath: /etc/config.ini   # 最终在容器中的文件名
        subPath: config.ini  #要挂载的confmap中的key的名称
  volumes:
    - name: config-test
      configMap:
        name: config-test
```

挂载多个key为文件：
```
apiVersion: v1
kind: Pod
metadata:
  name: testpod2
spec:
  containers:
  - name: testc
    image: busybox
    command: ["/bin/sleep","10000"]
    volumeMounts:
      - name: config-test
        mountPath: /etc/config.ini   # 最终在容器中的文件名
        subPath: config.ini  #要挂载的confmap中的key的名称
      - name: config-test
        mountPath: /etc/config.conf   # 最终在容器中的文件名
        subPath: config.conf  #要挂载的confmap中的key的名称
  volumes:
    - name: config-test
      configMap:
        name: config-test
```

多个container挂载不同的key：
```
apiVersion: v1
kind: Pod
metadata:
  name: testpod1
spec:
  containers:
  - name: testc
    imagePullPolicy: Never
    image: busybox
    command: ["/bin/sleep","10000"]
    volumeMounts:
      - name: config-test
        mountPath: /etc/config/config.ini
        subPath: config.ini
  - name: testc1
    imagePullPolicy: Never
    image: busybox
    command: ["/bin/sleep","10000"]
    volumeMounts:
      - name: config-test
        mountPath: /etc/config/config.conf
        subPath: config.conf
  volumes:
    - name: config-test
      configMap:
        name: config-test
        items:
        - key: config.ini
          path: config.ini
        - key: config.conf
          path: config.conf
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1911/  

