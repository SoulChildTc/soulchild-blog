# Istio卸载

<!--more-->
```yaml
# 删除官方示例的插件
kubectl delete -f samples/addons

# 删除istio组件
istioctl manifest generate --set profile=demo | kubectl delete --ignore-not-found=true -f -

# 删除namespace
kubectl delete namespace istio-system

# 删除相关label
kubectl label namespace xxx istio-injection-

# 删除istio-crd
kubectl delete namespace istio-operator
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2656/  

