# k8s查询dashboard的token

<!--more-->
#无yaml重启pod

kubectl get pod "PODNAME" -n "NAMESPACE" -o yaml | kubectl replace --force -f -

&nbsp;

#查询dashboard的token

kubectl describe secrets -n kube-system `kubectl get secret -n kube-system | awk '/dashboard-admin/{print $1}'` | grep token: | awk '{print $2}'


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1223/  

