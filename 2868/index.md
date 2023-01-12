# nginx-ingress丢失header问题

<!--more-->
最近从其他地方迁移过来一个没人维护的服务,容器化后跑在k8s上, 都配置完后发现无法正常访问,看日志说没获取到token,心想可能是nginx代理这块丢失了header信息。

ingress配置如下
```bash
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
  name: xxxx
  namespace: arch
spec:
  rules:
  - host: app.xxx.cn
    http:
      paths:
      - backend:
          serviceName: xxx-service
          servicePort: 443 
        path: /
```


证实一下,跳过ingress直接通过访问pod和svc访问
`k -n arch port-forward --address 0.0.0.0 xxx-service-575cc8dc76-sftz9 443:443`
`k -n arch port-forward --address 0.0.0.0 service/xxx-service 443:443`
测试完发现都是没问题的。

最终原因就是请求头里包含了下划线，nginx默认是会忽略下划线的，所以导致后端读取header会找不到。

解决方式有两个，一个是全局开启识别下划线，一个是指定的ingress用注解开启。

全局开启
```bash
k edit cm -n kube-system nginx-configuration
# 增加如下内容
enable-underscores-in-headers: enabled
```
> 需要重启ingress-controller

使用注解
```bash
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/server-snippet: |
      underscores_in_headers on;
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2868/  

