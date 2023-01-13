# docker可以pull镜像，但是k8s不能pull，配置私有仓库secret

<!--more-->
由于仓库需要认证的原因，所以需要k8s生成secret：

&nbsp;
<pre class="line-numbers" data-start="1"><code class="language-bash">#创建secret
kubectl create secret docker-registry secret名称 --docker-server=仓库地址 --docker-username=用户名 --docker-password=密码

#通过获取data下的dockerconfigjson值做出反解，可以获取原始信息
kubectl get -n shjj secrets my-secret --output="jsonpath={.data.\.dockerconfigjson}" | base64 -d</code></pre>
&nbsp;

应用到deployment资源yaml文件中：
<pre class="line-numbers" data-start="1"><code class="language-bash">---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      imagePullSecrets:
      - name: registry-secret
      containers:
      - name: app
        image: {image_name}
        ports:
        - containerPort: 9998
</code></pre>
&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1121/  

