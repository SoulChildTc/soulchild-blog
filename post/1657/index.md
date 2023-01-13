# k8s污点和容忍

<!--more-->
如果一个节点标记为 Taints ，除非 pod 被标识为可以容忍污点节点，否则该 Taints 节点不会被调度 pod。

使用kubeadm搭建的k8s集群，默认master节点是有污点的。

可以通过下面的命令查询污点：
<pre class="pure-highlightjs"><code class="null">kubectl describe nodes  test-k8s-master |grep Taints</code></pre>
&nbsp;

污点的类型有三种：

NoSchedule: 新的pod不能调度过来，但是老的运行在node上不受影响

NoExecute：新的pod不能调度过来，老的pod也会被驱逐

PreferNoSchedule：尽量不调度

&nbsp;

添加一个污点：
<pre class="pure-highlightjs"><code class="null">kubectl taint nodes node1 key1=value1:NoSchedule</code></pre>
删除一个污点：
<pre class="pure-highlightjs"><code class="null">kubectl taint nodes node1 key1:NoSchedule-</code></pre>
&nbsp;

pod.spec.tolerations字段含义：

effect：指定污点类型。空意味着匹配所有污点。允许的值为NoSchedule、PreferNoSchedule、NoExecute。

key：指定污点的key。空匹配所有污点的key

value：指定污点的value

operator：Equal意味着这个值等于value。如果是Exists,则不需要填写value，只要有这个key就容忍

tolerationSeconds：容忍时间，意思为如果被驱逐，则等待定义的时间再去被驱逐，默认是0秒

&nbsp;

下面创建一个pod，利用污点创建pod到master节点上：
<pre class="pure-highlightjs"><code class="null">apiVersion: v1
kind: Pod
metadata:
  name: test-nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - name: http
      containerPort: 80
  tolerations:
  - key: node-role.kubernetes.io/master
    operator: Exists
    effect: NoSchedule
  nodeSelector:
    kubernetes.io/hostname: master</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1657/  

