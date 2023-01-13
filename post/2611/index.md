# k8s 中pod的QoS

<!--more-->
官方文档: https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/

### 前言
在k8s中可以设置request和limit对Pod进行资源限制,不同的设置方法会影响这个Pod的QoS级别。 

### QoS级别分为三种:
- `Guaranteed`: Pod中的所有容器必须同时设置cpu和memory的request和limit，并且限制的值要相同。(还有一种情况是只设置了limit没有设置request,这种情况k8s会自动加上request的限制，所以这种情况也属于Guaranteed)
- `Burstable`: 不满足Guaranteed时,只要设置了request或者limit就是这种类型
- `BestEffort`: 既没有设置request也没有设置limit


### 三种类型的影响
当宿主机资源不足时,kubelet会对Pod进行驱逐(Eviction),驱逐的阈值在kubelet的evictionHard字段中配置。

哪些Pod会被优先驱逐就和QoS等级有关了,驱逐的顺序如下:
1. `BestEffort`
2. `Burstable`
3. `Guaranteed`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2611/  

