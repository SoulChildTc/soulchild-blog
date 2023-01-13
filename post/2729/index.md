# 解决virtualservice前缀路由匹配冲突问题

<!--more-->
### 背景
当我们有两个virtualservice并且路由匹配都是使用match.uri.prefix,第一个路由r1是匹配/it前缀，第二个路由r2匹配/item前缀。

这时你会发现无论是访问/it、/it/、/it/xxx，/item，/item/，/item/xx都会匹配到r1对应的服务。

由于vs不支持priority，可以通过下面几种方法解决
1. 合并virtualservice(推荐)
2. 使用regex匹配路由
3. 写一个prefix: /it/ 一个exact: /it

下面使用regex的方式来解决这个问题。

### 一、部署测试服务
部署两个nginx服务用于测试路由
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n1
  namespace: istio-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
      version: v1
  template:
    metadata:
      labels:
        app: nginx
        version: v1
    spec:
      containers:
      - name: nginx
        image: nginx:1.14-alpine
        imagePullPolicy: IfNotPresent
        ports:
        - name: http
          containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: n1-svc
  namespace: istio-demo
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 80
    targetPort: 80
  selector:
    app: nginx
    version: v1
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n2
  namespace: istio-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
      version: v2
  template:
    metadata:
      labels:
        app: nginx
        version: v2
    spec:
      containers:
      - name: nginx
        image: nginx:1.14-alpine
        imagePullPolicy: IfNotPresent
        ports:
        - name: http
          containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: n2-svc
  namespace: istio-demo
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 80
    targetPort: 80
  selector:
    app: nginx
    version: v2
```
> 上面只是单纯的创建了两个nginx应用和两个service，后面通过浏览器访问，观察nginx日志来确认流量进入了哪个应用

### 二、配置有问题的路由规则

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: r1
  namespace: istio-demo
spec:
  gateways:
  - istio-system/public-gateway
  hosts:
  - 'n1-svc'
  - 'headers.t.cn'
  http:
  - route:
    - destination:
        host: n1-svc
    match:
    - uri:
        prefix: '/it'
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: r2
  namespace: istio-demo
spec:
  gateways:
  - istio-system/public-gateway
  hosts:
  - 'n2-svc'
  - 'headers.t.cn'
  http:
  - route:
    - destination:
        host: n2-svc
    match:
    - uri:
        prefix: /item
```
测试访问情况:
1. 首先打开两个控制台观察pod的日志
2. 在浏览器访问/it、/it/、/it/xxx、/item、/item/、/item/xxx均访问到n1服务上(n2服务的规则失效)
3. 删除n1的路由匹配规则，此时/item、/item/、/item/xxx均访问到n2服务上


### 解决方法
修改prefix为regex
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: r1
  namespace: istio-demo
spec:
  gateways:
  - istio-system/public-gateway
  hosts:
  - 'n1-svc'
  - 'headers.t.cn'
  http:
  - route:
    - destination:
        host: n1-svc
    match:
    - uri:
        # 匹配/it/开头或/it的uri
        regex: '(\/it\/.*)|(\/it\/?)'
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: r2
  namespace: istio-demo
spec:
  gateways:
  - istio-system/public-gateway
  hosts:
  - 'n2-svc'
  - 'headers.t.cn'
  http:
  - route:
    - destination:
        host: n2-svc
    match:
    - uri:
        # 匹配/item/开头或/item的uri,这里其实不改也可以,因为r1路由已经不会影响到r2路由了
        regex: '(\/item\/.*)|(\/item\/?)'
```

经测试
访问/it、/it/、/it/xxx会路由到n1应用
访问/item、/item/、/item/xxx会路由到n2应用


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2729/  

