# ingress-nginx配置basic认证

<!--more-->
## 1.创建认证文件(注意文件名必须叫auth)
```bash
htpasswd -bc auth admin 123456
```

## 2.生成secret
```bash
kubectl create secret generic --from-file=auth --namespace=kube-ops prome-basic-auth
```

## 3.配置ingress
```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: prometheus
  namespace: kube-ops
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: prome-basic-auth
    nginx.ingress.kubernetes.io/auth-realm: '提示信息'
spec:
  rules:
  - host: prom.soulchild.cn
    http:
      paths:
      - path: /
        backend:
          serviceName: prometheus
          servicePort: http
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1946/  

