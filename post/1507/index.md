# k8s使用pod hook钩子函数

<!--more-->
### 1.postStart

这个钩子在创建容器之后立即执行。 但是，并不能保证钩子在容器本身的初始命令(ENTRYPOINT)之前运行。 主要用于资源部署、环境准备等。不过需要注意的是如果钩子花费时间过长以及于不能运行或者挂起，容器将不能达到Running状态。

yaml举例:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: start-hook
  labels:
    app: test
spec:
  containers:
  - name: start-hook
    image: nginx
    ports:
    - name: nginx-port
      containerPort: 80
    lifecycle:
      postStart:
        exec:
          command: ["/bin/bash", "-c", "echo before running &gt; /postStart.txt"]
```

### 2.PreStop

在容器终止之前立即调用此钩子。 它是阻塞的，所以只有此钩子执行完后，才会执行删除容器的操作

主要用于优雅关闭应用程序、通知其他系统等。如果钩子在执行期间挂起，Pod阶段将停留在Running状态并且不会达到failed状态
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: stop-hook
  labels:
    app: test
spec:
  containers:
  - name: stop-hook
    image: nginx
    ports:
    - name: nginx-port
      containerPort: 80
    lifecycle:
      preStop:
        exec:
          command: ["/usr/sbin/nginx", "-s", "quit"]
```

> 优雅退出： 当pod被删除时，会处于Terminating状态，同时会将他从ep中摘除，kube-proxy更新ipvs规则摘除流量，也就是说这个pod就不会再有新的请求进来了。那么如果preStop使用了sleep 30，会等待30秒后真正删除pod，这30秒可以用来处理没有处理完的请求


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1507/  

