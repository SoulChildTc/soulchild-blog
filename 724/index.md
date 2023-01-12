# k8s-deployment资源创建、升级、回滚

<!--more-->
1.创建资源（--record可以记录历史版本，方便回滚）
<pre>kubectl create -f nginx-deploy.yaml --record</pre>
&nbsp;

nginx-deploy.yaml：
<pre class="line-numbers" data-start="1"><code class="language-bash">apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: registry:5000/nginx:1.13
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: 100m
          requests:
            cpu: 100m</code></pre>
&nbsp;

2.创建svc资源(提供网络访问、暴露端口)
<pre class="line-numbers" data-start="1"><code class="language-bash">apiVersion: v1
kind: Service
metadata:
  name: nginx-deployment
spec:
  type: NodePort
  ports:
    - port: 80
      nodePort: 3002
      targetPort: 80
  selector:
    app: nginx</code></pre>
<span style="color: #ff0000; font-size: 14pt;"><strong>镜像版本升级和回滚</strong></span>

升级镜像：
<pre>#参数说明
deployment :资源类型
nginx-deployment ：资源名称
nginx=registry:5000/nginx:1.15：给指定的容器修改镜像。通过kubectl get rs -o wide查看CONTAINER(S)中容器的名称

kubectl set image deployment nginx-deployment nginx=registry:5000/nginx:1.15</pre>
查看历史版本：
<pre>#参数说明
deployment ：资源类型
nginx-deployment ：资源名称

kubectl rollout history deployment nginx-deployment</pre>
回滚到上一个版本：
<pre>#参数说明
deployment ：资源类型
nginx-deployment ：资源名称

kubectl rollout undo deployment nginx-deployment</pre>
回滚到指定版本：
<pre>#参数说明
deployment ：资源类型
nginx-deployment ：资源名称
--to-revision=2 ：回滚到指定版本，通过history可以查看

kubectl rollout undo deployment nginx-deployment --to-revision=2</pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/724/  

