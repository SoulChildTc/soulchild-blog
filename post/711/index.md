# k8s-rc资源创建、滚动升级

<!--more-->
镜像需要提前准备好，registry:5000是本地私有仓库地址

&nbsp;

1.创建一个rc资源
<pre>kubectl create -f nginx-rc.yaml</pre>
nginx-rc.yaml：
<pre class="line-numbers" data-start="1"><code class="language-bash">apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 5
  selector:
    app: myweb
  template:
    metadata:
      labels:
        app: myweb
    spec:
      containers:
      - name: myweb
        image: registry:5000/nginx:1.13
        ports:
        - containerPort: 80</code></pre>
2.创建svc资源(提供网络访问、暴露端口)
<pre>kubectl create -f nginx-svc.yaml</pre>
nginx-svc.yaml：
<pre class="line-numbers" data-start="1"><code class="language-bash">apiVersion: v1
kind: Service
metadata:
  name: myweb
spec:
  type: NodePort
  ports:
    - port: 80
      nodePort: 30001
      targetPort: 80
  selector:
    app: myweb</code></pre>
3.查看pod状态，都为running
<pre>kubectl get all -o wide</pre>
打开测试访问：

http://10.0.0.13:3001

&nbsp;

将nginx1.13升级到nginx1.15

<span style="color: #ff0000; font-size: 12pt;"><strong>镜像升级</strong></span>

1.指定镜像升级,每10秒升级一个
<pre>kubectl rolling-update nginx --image=registry:5000/nginx:1.15 --update-period=10s</pre>
&nbsp;

<span style="font-size: 12pt;"><strong><span style="color: #ff0000;">yaml文件升级和回滚</span></strong></span>

2.基于yaml文件升级
<pre>kubectl rolling-update nginx -f nginx-rc1.15.yaml --update-period=10s
#修改svc的标签选择器为myweb2
kubectl edit svc myweb
 selector:
 app: myweb2</pre>
nginx-rc1.15.yaml：
<pre class="line-numbers" data-start="1"><code class="language-bash">apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx2
spec:
  replicas: 5
  selector:
    app: myweb2
  template:
    metadata:
      labels:
        app: myweb2
    spec:
      containers:
      - name: myweb2
        image: registry:5000/nginx:1.15
        ports:
        - containerPort: 80</code></pre>
<strong><span style="color: #ff0000;">回滚：</span></strong>
<pre>kubectl rolling-update nginx2 -f nginx-rc.yaml --update-period=1s
#修改svc的标签选择器为myweb
kubectl edit svc myweb
 selector:
 app: myweb</pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/711/  

