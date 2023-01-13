# traefik-IngressRoute基本配置(二)

<!--more-->
IngressRoute是traefik编写的一个自定义资源(CRD),可以更好的配置traefik所需的路由信息
https://doc.traefik.io/traefik/reference/dynamic-configuration/kubernetes-crd/#resources

## 一、使用helm安装traefik
1.添加traefik仓库
```
helm repo add traefik https://helm.traefik.io/traefik
helm repo update
```
2.安装traefik
```
kubectl create ns traefik-v2
helm install --namespace=traefik-v2 traefik traefik/traefik 
```

3.暴露traefik的dashboard
端口说明:
9000是dashboard
8000是http入口
8443是https入口

`kubectl port-forward --address=0.0.0.0 -n traefik-v2 $(kubectl get pods -n traefik-v2 --selector "app.kubernetes.io/name=traefik" --output=name) 9000:9000`

通过master节点`IP:9000/dashboard/`访问traefik仪表盘

> 以上安装方式仅为学习使用.

![58456-zpguelkyx.png](images/4043256750.png)


## 二、traefik IngressRoute资源配置
下面有一个nginx应用
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-test
  namespace: kube-ops
spec:
  selector:
    matchLabels:
      app: nginx
      test: "true"
  template:
    metadata:
      labels:
        app: nginx
        test: "true"
    spec:
      containers:
        - name: nginx-test
          ports:
            - name: http
              containerPort: 80
          image: nginx:1.17.10
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-test
  namespace: kube-ops
spec:
  selector:
    app: nginx
    test: "true"
  type: ClusterIP
  ports:
    - name: web
      port: 80
      targetPort: http
```

让我们通过IngressRoute来配置一个规则
```
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: nginx-test
  namespace: kube-ops
spec:
  entryPoints:
    # 指定入口点为web。这里的web就是traefik静态配置(启动参数)中的 --entryPoints.web.address=:8000,通过仪表盘也可以看到
    - web
  routes:
    - kind: Rule
      match: Host(`test.com`) # 匹配规则,第三部分说明
      services:
        - name: nginx-test
          port: 80
```
可以看到我门刚才配置的规则已经生效了。

![88637-g703qcu4v6.png](images/407132451.png)


现在将入口点web暴露出来，通过9001端口。
`kubectl port-forward --address=0.0.0.0 -n traefik-v2 $(kubectl get pods -n traefik-v2 --selector "app.kubernetes.io/name=traefik" --output=name) 9001:8000`

在本地做hosts解析
`x.x.x.x    test.com`

现在我们打开test.com:9001可以看到nginx已经正常访问
![40593-17h09vnq5qx.png](images/743072421.png)


## 三、路由匹配规则
- Headers(\`key\`, \`value\`): 判断请求头是否存在，key是请求头名称，value是值

- HeadersRegexp(\`key\`, \`regexp\`): 同上,可以使用正则来匹配

- Host(\`example.com\`, ...): 检查请求Host请求头,判断其值是否为给定之一

- HostHeader(\`example.com\`, ...): 同上

- HostRegexp(\`example.com\`, \`{subdomain:[a-z]+}.example.com\`, ...): 同上，可以使用正则

- Method(\`GET\`, ...): 检查请求方法是否为给定的一个methods（GET，POST，PUT，DELETE，PATCH）

- Path(\`/path\`, \`/articles/{cat:[a-z]+}/{id:[0-9]+}\`, ...): 匹配确切的请求路径。接受正则表达式

- PathPrefix(\`/products/\`, \`/articles/{cat:[a-z]+}/{id:[0-9]+}\`): 匹配请求前缀路径。接受正则表达式

- Query(\`foo=bar\`, \`bar=baz\`): 匹配查询字符串参数


注意点:
> 1. 为了与Host和Path表达式一起使用正则表达式，必须声明一个任意命名的变量，后跟用冒号分隔的正则表达式，所有这些都用花括号括起来。例如`/posts/{id:[0-9]+}`,id为变量名

> 2. 您可以使用AND（&&）和OR（||）运算符组合多个匹配器。您也可以使用括号。

> 3. 规则评估后可以使用中间件，在请求被转发到服务之前对规则进行评估


## 四、https配置
1. 生成证书secret
`kubectl create secret tls nginx-test --cert=tls.crt --key=tls.key`

2. 修改之前的IngressRoute
```
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: nginx-test
  namespace: kube-ops
spec:
  entryPoints:
    # 指定入口点为web。这里的web就是traefik静态配置(启动参数)中的 --entryPoints.web.address=:8000,通过仪表盘也可以看到
    - web
  routes:
    - kind: Rule
      match: Host(`test.com`) # 匹配规则,第三部分说明
      services:
        - name: nginx-test
          port: 80
  tls:
    secretName: nginx-test
```
因为不是正常的证书,所以访问过不去
![54073-f0d04jeun5l.png](images/4030331602.png)



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2159/  

