# k8s之Pod的liveness和readiness探针

<!--more-->
<span style="font-family: 'andale mono', monospace;">简单记录</span>

<span style="font-family: 'andale mono', monospace;">原文地址：https://www.kubernetes.org.cn/2362.html</span>

<span style="font-family: 'andale mono', monospace;">官方中文文档：https://v1-14.docs.kubernetes.io/zh/docs/concepts/workloads/pods/pod-lifecycle/</span>

&nbsp;

<span style="font-family: 'andale mono', monospace;">作用：</span>

<span style="font-family: 'andale mono', monospace;">liveness：</span>

<span style="font-family: 'andale mono', monospace;">Kubelet使用liveness probe（存活探针）来确定何时重启容器。例如，当应用程序处于运行状态但无法做进一步操作，liveness探针将捕获到deadlock，重启处于该状态下的容器，使应用程序在存在bug的情况下依然能够继续运行下去（谁的程序还没几个bug呢）。<span style="color: #ff0000;">（是否重启取决于重启策略）</span></span>

<span style="font-family: 'andale mono', monospace;">readiness：</span>

<span style="font-family: 'andale mono', monospace;">Kubelet使用readiness probe（就绪探针）来确定容器是否已经就绪可以接受流量。只有当Pod中的容器都处于就绪状态时kubelet才会认定该Pod处于就绪状态。该信号的作用是控制哪些Pod应该作为service的后端。如果Pod处于非就绪状态，那么它们将会被从service的load balancer中移除。<span style="color: #ff0000;">(不会改变容器运行状态，检测失败，pod的READ达不到预期的效果)</span></span>

&nbsp;

readiness和liveness一般配合使用，liveness负责健康状态检查，重启容器。readiness负责将pod从svc中移除，控制流量。

多个liveness时，只会影响对应的container。

&nbsp;

<span style="color: #ff0000;"><strong>定义liveness</strong></span>

exec：
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-yaml">apiVersion: v1
kind: Pod
metadata: 
  name: liveness-exec
  labels:
    app: liveness
spec:
  containers:
    - name: liveness
      image: busybox
      args:
      - /bin/sh
      - -c
      - touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600
      livenessProbe:
        exec:
          command:
          - cat
          - /tmp/healthy
        initialDelaySeconds: 3
        periodSeconds: 3</code></pre>
<code>periodSeconds</code> 规定kubelet要每隔3秒执行一次liveness probe。

<code>initialDelaySeconds</code> 告诉kubelet在第一次执行probe之前要的等待3秒钟。探针检测命令是在容器中执行 <code>cat /tmp/healthy</code> 命令。如果命令执行成功，将返回0，kubelet就会认为该容器是活着的并且很健康。如果返回非0值，kubelet就会杀掉这个容器并重启它。

&nbsp;

http：
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-yaml">apiVersion: v1
kind: Pod
metadata:
  name: liveness-http
  labels:
    app: liveness-http
spec:
  containers:
    - name: liveness-http
      image: cnych/liveness
      args:
      - /server
      livenessProbe:
        httpGet:
          port: 8080
          path: /healthz
        initialDelaySeconds: 3
        periodSeconds: 3</code></pre>
<code>periodSeconds</code> 指定kubelete需要每隔3秒执行一次liveness probe。

<code>initialDelaySeconds</code> 指定kubelet在该执行第一次探测之前需要等待3秒钟。该探针将向容器中的server的8080端口发送一个HTTP GET请求。如果server的<code>/healthz</code>路径的handler返回一个成功的返回码，kubelet就会认定该容器是活着的并且很健康。如果返回失败的返回码，kubelet将杀掉该容器并重启它。

任何大于200小于400的返回码都会认定是成功的返回码。其他返回码都会被认为是失败的返回码。

&nbsp;

tcpSocket：

大同小异

&nbsp;

&nbsp;

<span style="color: #ff0000;"><strong>定义readiness</strong></span>

有时，应用程序暂时无法对外部流量提供服务。 例如，应用程序可能需要在启动期间加载大量数据或配置文件。 在这种情况下，你不想杀死应用程序，但你也不想发送请求。 Kubernetes提供了readiness probe来检测和减轻这些情况。 Pod中的容器可以报告自己还没有准备，不能处理Kubernetes服务发送过来的流量。

readiness
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-yaml">apiVersion: v1
kind: Pod
metadata:
  name: readiness
  labels:
    app: readiness
spec:
  containers:
    - name: readiness
      image: cnych/liveness
      args:
      - /server
      readinessProbe:
        httpGet:
          port: 8080
          path: /healthz
        initialDelaySeconds: 3
        periodSeconds: 3</code></pre>
&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1512/  

