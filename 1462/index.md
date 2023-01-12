# k8s使用env控制容器环境变量

<!--more-->
修改配置文件
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-yaml">spec:
  containers:
  - name: envar-demo-container
    image: gcr.io/google-samples/node-hello:1.0
    env:
    - name: JAVA_OPTS
      value: "-Xms500m -Xmx950m -XX:MaxNewSize=250m -XX:+UseConcMarkSweepGC"</code></pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1462/  

