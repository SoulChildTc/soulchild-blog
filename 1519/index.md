# k8s之init容器

<!--more-->
init容器初始化不成功，主容器不会执行

1.举例

创建pod
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-yaml">apiVersion: v1
kind: Pod
metadata:
  name: blog
  labels:
    app: blog
spec:
  initContainers:
  - name: init-conf
    image: busybox
    command:
    - wget
    - -O
    - /work-dir/index.html
    - "https://soulchild.cn"
    volumeMounts:
    - name: work-dir
      mountPath: /work-dir/
  containers:
  - name: blog
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - name: work-dir
      mountPath: /usr/share/nginx/html/
  volumes:
    - name: work-dir
      emptyDir: {}</code></pre>
&nbsp;

创建svc
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-yaml">apiVersion: v1
kind: Service
metadata:
  name: blog
spec:
  selector:
    app: blog
  type: NodePort
  ports:
  - nodePort: 30002
    port: 80
    targetPort: 80</code></pre>
&nbsp;

创建后可以访问master或node的IP+30002


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1519/  

