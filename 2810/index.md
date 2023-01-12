# traefik配置跨域策略

<!--more-->
### 1.这里用到traefik的middleware,用于添加响应头
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: test-cors
  namespace: default
spec:
  headers:
    customResponseHeaders: 
      Access-Control-Allow-Origin: "http://soulchild.cn:8080"
      Access-Control-Allow-Methods: "*"
      Access-Control-Allow-Headers: "*"
    # 另一种写法
    #accessControlAllowMethods:
    #  - "*"
    #accessControlAllowOriginList:
    #  - "http://soulchild.cn:8080"
    #accessControlAllowHeaders:
    #  - "*"
    #accessControlMaxAge: 100
    #addVaryHeader: true
```

### 2.和路由关联
#### 这里说两种,一种是ingress资源，另一种是ingressroute
在ingress中添加annotations就可以关联了
```bash
traefik.ingress.kubernetes.io/router.middlewares: default-test-cors@kubernetescrd
```

如果使用的是ingressroute
```bash
spec:
  entryPoints:
  - web
  routes:
  - kind: Rule
    match: PathPrefix(`/api/xxx`)
    middlewares:
    - name: test-cors
      namespace: default
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2810/  

