# Istio-virtualservice功能测试

<!--more-->
### http rewrite
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: web-server-headers
spec:
  gateways:
  - istio-system/public-gw
  hosts:
  - '*'
  http:
  - match:
    - uri:
        prefix: '/headers/'
    - uri:
        prefix: '/headers'
    rewrite:
      uri: '/'
    route:
    - destination:
        host: web-server-headers
        port:
          number: 5000
```
> 当我们访问: http://ops.cn/headers/version，上面的例子中如果没有rewrite,那么我们的后台服务收到的请求将是/headers/version。有时候我们的服务只需要/version。所以我们配置rewrite，将/headers/和/headers重写为/，然后交给后台服务

### http redirect
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: web-server-headers
spec:
  gateways:
  - istio-system/public-gw
  hosts:
  - '*'
  http:
  - match:
    - uri:
        prefix: '/headers/'
    - uri:
        prefix: '/headers'
    redirect:
      authority: soulchild.cn
      redirectCode: 301
      uri: '/aaa'
```
> 客户端将会重定向到指定的站点。authority指定重定向到哪个主机,redirectCode是响应状态码，uri是请求的路径

### fault
这里有个疑问,故障注入的延迟是发生在哪里的？客户端还是服务端的sidecar？
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: web-server-headers
spec:
  gateways:
  - istio-system/public-gw
  hosts:
  - '*'
  http:
  - match:
    - uri:
        prefix: '/headers/'
    - uri:
        prefix: '/headers'
    rewrite:
      uri: '/'
    fault:
      delay:
        fixedDelay: 10s
        percent: 100
    route:
    - destination:
        host: web-server-headers
        port:
          number: 5000
```
> 测试流量的方法: 
> 1. 开启一个客户端POD
> 2. 抓取istio-ingressgateway这个POD的数据包(只抓取客户端POD的IP和后端服务的IP)
> 3. 抓取后端服务POD的数据包(只抓取gateway的IP)
> 4. 客户端POD请求目标服务(curl -I http://istio-ingressgateway.istio-system/headers)
> 5. 观察数据包情况

> 分析:
> 当curl执行后gateway马上出现请求包，后端服务的数据包没有内容。
> 等待10s后，gateway才将请求转发到后端服务，此时后端服务收到数据包并响应。
> 由此可见延迟的故障注入是发生在服务的请求方的，

> 最后注意:
> 上面的配置仅对gateway生效,如果想在网格内生效请在gateways添加mesh。添加mesh后同样故障注入是在client端的


未完待续。。。




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2723/  

