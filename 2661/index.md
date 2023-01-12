# k8s强制删除namespace

<!--more-->
```yaml
ns=ingress-nginx

kubectl get namespace ${ns} -o json | jq '.spec.finalizers=[]' | kubectl replace --raw /api/v1/namespaces/${ns}/finalize -f -
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2661/  

