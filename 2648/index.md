# Istio学习笔记

<!--more-->
# Istio学习笔记

## 架构概述

### 数据平面

- Envoy 
    被部署为sidecar。发送到业务容器的请求都将会转发到envoy的端口中(通过iptables nat规则)。 envoy支持动态配置，例如监听端口、路由规则、服务发现
	
### 控制平面
1.5之前的版本istio采用微服务架构，1.5之后istio回归单体应用,控制平面的组件都在istiod中

- Pilot 
    管理和配置envoy sidecar
	为`Envoy sidecar`提供服务发现、智能路由、流量管理的功能配置（例如，A/B 测试、金丝雀发布等）以及弹性功能配置（超时、重试、熔断器等）。
- Citadel
    实现服务到服务之间的身份认证(比如双向数字证书)
- Galley
    提供istio中的配置管理服务,验证Istio的CRD资源的合法性.


## 流量管理
istio会自动检测k8s service 和 endpoint,enovy代理默认通过轮询的方式分发流量。也可以对流量进行更细粒度的控制。如A/B测试、按照流量百分比、为特定的服务实例子集应用不同的负载均衡策略、对流量进出的控制，这些都可以由Istio Api来配置。

### 流量管理相关API
#### VirtualService: 
vs定义命中什么规则访问什么服务(k8s service)。 比如匹配uri前缀`/aaa`访问A服务，匹配`/bbb`访问B服务。这里定义的内容将会被istiod(pilot组件)通过apiserver监听到，最后转换为envoy配置，下发给envoy sidecar
由一组路由规则组成，用于匹配后端服务。如果有流量命中了某条路由规则，就会将其发送到对应的服务或者服务的一个版本中。
官方API文档: https://istio.io/v1.9/zh/docs/reference/config/networking/virtual-service/

示例:
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  exportTo: # 表示当前vs的配置对哪些命名空间生效,默认是所有。在1.9版本中只能写`.` or `*`. 表示当前和所有命名空间
  - "*"
  hosts: # 一个列表，指定服务端的访问地址。可以是IP、域名(包括service)。`*`代表匹配所有。(暂时理解为nginx的server_name-->升级理解:当前规则作用在哪个访问地址上)
  - reviews
  http: # 定义路由规则的方式，可以是http、tcp、tls
  - match: # 定义匹配规则
    - headers: # 匹配header。其他选项请移步https://istio.io/v1.9/zh/docs/reference/config/networking/virtual-service/#HTTPMatchRequest
        end-user: # header的key
          exact: jason # 使用精确匹配,匹配的value是jason。也可以写prefix、regex匹配
    route: # 这里指定路由,上面的规则匹配成功后访问的实际backend
    - destination: 
        host: reviews # 这里指定的是service名称 简写和完整的都可以
        subset: v2 # 这里表示使用service的v2子集。service的子集需要在DestinationRule中配置。使用subset时,必须要有DestinationRule,否则会503
  - route: # 这里是第二条规则,规则是空的,所以当第一条规则不匹配时，流量会直接进入reviews v3子集
    - destination: 
        host: reviews
        subset: v3
```
> 上面示例的整体含义: 将规则作用到reviews这个service上，匹配header中end-user是jason的请求，将它路由到reviews服务的v2子集中。其他请求进入reviews v3子集。配置仅对网格内生效(被注入的pdo)，外部流量进来还是按照k8s的流量路线走。(对外生效可能需要配置gateways,后续学习测试)

> 建议添加一个无条件或者基于权重的规则,作为VirtualService的最后一条规则,从而确保流量至少能匹配一条路由规则。


总结:
VirtualService指定匹配规则，将匹配的规则路由到不同的服务或不同服务的子集。
vs功能列举: 故障注入、设置跨域策略、设置请求头、流量镜像、重试策略、重定向、url重写、匹配规则、路由、

猜想: vs控制的是envoy sidecar的配置， gateway控制的是istio-ingressgateway的配置


#### DestinationRule
在经过vs路由时,如果配置了subset则会遵循DestinationRule配置的流量执行策略，如service的子集、熔断、负载均衡策略、连接池大小 和 健康检查(驱逐负载均衡池中不健康的主机)

具体配置可以查看官方文档示例

#### Gateway
Gateway资源允许外部流量进入Istio服务网格，Gateway资源是在ingressgateway后方，在egressgateway的前方，所以流量从外部进入网格后会和Gateway资源匹配,用于控制接受什么样的流量(比如某个域名或者某种协议).
virtualservice资源和Gateway可以做绑定，这样Gateway就可以对外部流量进行路由规则匹配，从而发往相应的服务。 除了进入网格的流量可以控制，我们也可以控制和过滤离开网格的流量。

** 主要功能总结 **
1. Gateway允许指定L4-L6的设置：端口及TLS设置
2. 对于L7的功能，Istio允许将VirtualService与Gateway绑定起来,通过virtualservice来提供能力

> 分离的好处：用户可以像使用传统的负载均衡设备一样管理进入网格内部的流量，绑定虚拟IP到虚拟服务器上 。便于传统技术用户无缝迁移到微服务

** 字段介绍 **
selector选择你的流量入口网关pod
servers 配置哪些流量可以进入gateway
  - hosts 配置的是可以通过哪些域名访问到gateway
  - port 配置可以通过哪些端口访问到gateway(测试下来可以写gateway service的port和targetPort)
#### ServiceEntry

#### Sidecar


## 可观测性: 

kiali通过istio_requests_total{destination_service_name = "productpage"}指标获取实时数据并绘制图形


## Istio流量走向逻辑


## Istio诊断排错相关
1. 配置完gw、vs、dr后访问出现404
检查网关配置，确认gw的hosts和协议端口号信息正确后、检查vs的hosts和gateways(注意当gw在不同namespace时需要指定gw的namespace.例如: istio-system/public-gateway)

2.  

3. 修改envoy sidecar日志级别`istioctl proxy-config log ingress-nginx-controller-66c6bdcc4b-zpwkj.ingress-nginx --level http:debug`


## 使用Istio注意点
1. pod中的标签需要包含app和version这两个标签
2. 在service中要给端口命名(以http、http2、grpc、mongo、redis这种开头，但是不使用这些，实际测试中未发现问题，不知道作用在哪) [协议选择](https://istio.io/v1.9/zh/docs/ops/configuration/traffic-management/protocol-selection/)


## 迁移注意点
1. 老的服务如果使用了http健康检查(liveness、readiness、startup)，istio中开启了服务间TLS加密通信。会导致k8s probe无限失败，pod会无限重启。因为kubelet发往业务容器的流量会被istio-proxy劫持。

2. 网关迁移(南北向流量)
  1. 改动ingress方式
将目前所有ingress的后端指向istio-ingressgateway。需要改动大量ingress配置。日志收集也需要改动。 流量走向 client-->slb-->ingress-nginx-controller-->istio-ingressgateway-->envoy

  2. 使用istio-ingressgateway 
需要迁移loadbalance，将原slb的地址迁移到istio网关的svc上。老服务会停机 日志收集可能需要改动。流量走向client-->slb-->istio-ingressgateway-->envoy

  3. 注入方式使用ingress-nginx-controller作为网关
istio注入enovy将nginx-controller变成网格内,理论上讲几乎无需改动(还没测试过),只需滚动升级nginx-controller。流量走向client-->slb-->ingress-nginx-controller-->envoy




### 灰度发布

#### 使用双deployment方式


0. 事先准备virtualservice和destinationrule，定义当前流量全部流向当前线上版本

1. 获取老版本的Deployment版本，例如job-v1

2. 创建新版本的Deployment，例如job-v2

3. 修改destinationrule中子集的label selector，配置service的两个子集(线上版本和新版本)

4. 修改virtualservice, 配置灰度策略。可以是header、权重、cookie等

5. kiali观察流量和运行状态，监控观察日志和pod负载

6. 观察正常后，修改virtualservice，将流量切到job-v2。

7. 删除job-v1相关资源




### 悟道
怎么才算网格内？ pod包含envoy sidecar代理。(不知对不对)

如何实现nginx-ingress-controller + istio。  目前想的是把envoy sidecar注入到nginx-ingress-controller将它变成网格内(后面已经实现，可跳到最后)


gateway配置的TCP端口，会在istio-ingressgateway pod中开启， 但是需要手动暴露这个端口，需要修改svc或者添加svc。


virtualService超时？ http.timeout下配置，表示当前服务向其他服务请求的超时时间。比如当前服务是A，设置超时为5s。A在请求B服务时，如果B服务响应时间超过5s,那么A服务会返回给客户端504 Gateway Timeout.   其实是envoy sidecar请求其他服务时的超时时间,最终的504也是envoy返回的。



virtualService故障注入
设置当前服务的延迟或者中断。 
- 延迟：延迟N秒后envoy代理将请求发送至业务服务。  
- 中断：envoy直接处理客户端请求，可以设置响应状态码。


### 未知领域
双向TLS通信
kiali为什么要对接grafana
Istio CNI插件是什么，为什么需要(代替了istio-init容器所实现的功能)

### 探索与未来



### 渡劫
vs中配置了gateways后，通过内部访问时(其他pod中)，vs规则失效了(变成轮询了)，删除了就恢复正常。(猜测是绑定了gateway后,只有通过网关的流量才会生效vs配置的路由规则所以绑定gateway要慎重) 总结: 内部调用的时候vs不配置gateways，外部调用才配置gateways。  后面在文档中发现需要在gateways中添加mesh，表示网格内也会生效，所以要同时生效的话需要加这个。







annotation解释
https://istio.io/v1.9/zh/docs/reference/config/annotations/

准备: 创建额外的nginx-controller(防止影响现有ingress) https://help.aliyun.com/document_detail/151524.html?spm=5176.21213303.J_6028563670.21.374e3edahOhK8h&scm=20140722.S_help%40%40%E6%96%87%E6%A1%A3%40%40151524.S_0%2Bos0.ID_151524-RL_nginxDAScontroller-OR_helpmain-V_2-P0_3

1. 给nginx-controller注入sidecar
sidecar.istio.io/inject: 'true'


2. 让nginx处理入口流量
traffic.sidecar.istio.io/includeInboundPorts: ""   # 将指定端口的流量重定向到envoy sidecar
traffic.sidecar.istio.io/excludeInboundPorts: "80,443"   # 将指定端口的流量不重定向到envoy sidecar
traffic.sidecar.istio.io/excludeOutboundIPRanges: "10.1.0.1"    # 将指定ip范围的流量不重定向到envoy sidecar。`k get svc kubernetes -o jsonpath='{.spec.clusterIP}'`

3. 修改ingress配置
\# 注意这是在Ingress资源中配置的

nginx.ingress.kubernetes.io/service-upstream: "true"    # 默认nginx是将流量直接打到pod ip中的,而不是通过service ip。这个配置用来禁用它，使他的流量发往service ip，这样做的目的是让envoy sidecar更好的接管流量

nginx.ingress.kubernetes.io/upstream-vhost: "xxx.default.svc.cluster.local"    # 这里写的是后端Service的完整fqdn。目的是修改Host请求头的值。这样的话vs对象配置的hosts就能匹配上了。


4. 设置nginx-controller的envoy sidecar配置
这里还不是太了解、简单了解了一下，大概意思是控制nginx-controller的envoy sidecar发出的流量只允许发到哪些namespace或service。 我测试下来没有配置这个，nginx-controller+istio集成跑通了,应该是默认全允许。后面需要单独了解一下。
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Sidecar
metadata:
  name: ingress
  namespace: ingress-namespace
spec:
  egress:
  - hosts:
    # only the frontend service in the prod-us1 namespace
    - "prod-us1/frontend.prod-us1.svc.cluster.local"
    # any service in the prod-apis namespace
    - "prod-apis/*"
    # tripping hazard: make sure you include istio-system!
    - "istio-system/*"
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2648/  

