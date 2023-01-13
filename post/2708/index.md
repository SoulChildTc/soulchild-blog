# Istio virtualservice匹配cookie

<!--more-->
Istio中的正则(RE2)使用起来不习惯,防止忘记特留此文

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: nginx-vs
  namespace: istio-demo
spec:
  exportTo:
  - '*'
  hosts:
  - nginx-svc
  http:
  - match:
    - headers:
        Cookie:
          regex: ^(.*?; )?(user=soulchild)(;.*)?$
    route:
    - destination:
        host: nginx-svc
        subset: v2
  - route:
    - destination:
        host: nginx-svc
        subset: v1
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2708/  

