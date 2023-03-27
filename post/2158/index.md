# traefik-概念简介(一)

<!--more-->

在traefik中一个请求的走向 入口点 -> 路由器 -> middleware -> service -> upstream

Traefik中的配置可以引用两种不同的内容：
- 路由配置（称为动态配置）`路由的配置`
- 启动配置（称为静态配置）`traefik本身的配置`


## 一、动态配置(provider)
动态配置定义 traefik 如何​​处理请求。此配置可以热重载，不会造成任何请求中断或连接丢失。traefik 从 provider 中获取动态配置, 比如 traefik 从 `kubernetes-Ingress` 中获取配置,那么它对应的 provider name 是 `kubernetes`。

providers包括：`docker`,`kubernetes-Ingress`,`kubernetes-IngressRoute`,`rancher`,`consul`,`zookeeper`等等。
[不同provider对应的名称](https://doc.traefik.io/traefik/providers/overview/#supported-providers)

Provider Namespace
在 Traefik 动态配置中声明某些对象时，例如中间件、服务、TLS 选项、TCP，它们位于这个 provider 的命名空间中，所以在使用多个 provider 时，如果希望引用在另一个 provider 中声明的此类对象（例如，引用像中间件这样的跨提供者对象），则引用的对象名称 格式为 `<resource-name>@<provider-name>` , kubernetes 比较特殊, 因为 kubernetes 也有Namespace的概念，他需要使用这样的格式 `<middleware in k8s namespace>-<middleware name>@kubernetescrd`。

例如使用 kubernetes CRD 声明了一个中间件，他的 provider name 是 kubernetescrd 
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: stripprefix
  namespace: appspace
spec:
  stripPrefix:
    prefixes:
      - /stripit
```

使用 ingress 引用他
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress
  namespace: appspace
  annotations:
    # 引用格式 <middleware in k8s namespace>-<middleware-name>@kubernetescrd
    "traefik.ingress.kubernetes.io/router.middlewares": appspace-stripprefix@kubernetescrd
spec: 
  ...
```

使用 IngressRoute 引用它
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: ingressroutestripprefix
spec:
  entryPoints:
    - web
  routes:
    - match: Host(`example.com`)
      kind: Rule
      services:
        - name: whoami
          port: 80
      middlewares:
        - name: stripprefix@kubernetescrd
          namespace: appspace
```


动态配置的文档: https://doc.traefik.io/traefik/routing/overview/


## 二、静态配置
在traefik中定义了三种不同的定义方式
1. [在配置文件中](https://doc.traefik.io/traefik/reference/static-configuration/file/)
2. [在命令行参数](https://doc.traefik.io/traefik/reference/static-configuration/cli/)
3. [在环境变量中](https://doc.traefik.io/traefik/reference/static-configuration/env/)

优先级按照上面的顺序

### 配置文件位置
在启动时,traefik搜索一个名为traefik.toml(或traefik.yml或traefik.yaml)的文件

搜索路径如下:
`/etc/traefik/`
`$XDG_CONFIG_HOME/`
`$HOME/.config/`
`.` 当前工作目录

也可以使用命令行参数来配置
`traefik --configFile=foo/bar/myconfigfile.toml`


## 三、入口点
Traefik的入口点（Entry Point）是指客户端与Traefik之间通信的协议和端口。它定义了如何接收和处理来自客户端的网络流量，并将其路由到正确的服务实例。
Traefik支持多种类型的入口点，包括HTTP、HTTPS、TCP和UDP，每个入口点都有一个唯一名称，可以同时启用多个入口点。

入口点属于静态配置,[配置参考](https://doc.traefik.io/traefik/routing/entrypoints/#configuration-examples)如下
```yaml
entryPoints:
  customName:
    # 监听地址和端口,默认tcp
    address: ":8888" # 指定udp":9999/udp"
    http2:
      # 一个TCP连接可以同时处理多少个请求, 默认250
      maxConcurrentStreams: 42

    # 启用 HTTP/3 协议。 
    http3:
      advertisedPort: 8888

    forwardedHeaders:
      # insecure: true # 始终信任 X-Forwarded-* 头, 默认false

      # 指定信任的上层代理IP。如果请求traefik的ip不在这个列表中,那么traefik会将 X-Forwarded-For 覆写为remote_addr
      # 如果请求traefik的ip在这个列表中, 那么traefik会在 X-Forwarded-For 后面追加remote_addr
      # 如果没有指定信任的IP, 那么traefik会将 X-Forwarded-For 覆写为remote_addr, 除非insecure=true
      trustedIPs: 
        - "127.0.0.1/32"
        - "192.168.1.7"

    transport:
      # 优雅停止
      lifeCycle:
        # 接收到停止信号后，保持接受请求的时间, 默认0s。 看源码就是一个sleep, 然后走到graceTimeOut，不知道有啥用。
        requestAcceptGraceTimeout: 42s
        # 接收到停止信号后, 停止接收请求,处理未处理完的请求, 到指定的时间强制关闭server。
        graceTimeOut: 42s
      respondingTimeouts:
        # 读取整个请求(包括body)的最长持续时间,默认0,没有超时。
        readTimeout: 42
        # 从请求头读取结束到响应写入结束的时间。默认0,没有超时。
        writeTimeout: 42
        # 空闲连接在关闭之前保持空闲的最长时间。默认180s
        idleTimeout: 42

    # 开启proxyProtocol协议
    proxyProtocol:
      # 信任所有IP
      # insecure: true
      # 只有信任的IP才会使用Proxy Protocol报文中的客户端IP, 不信任的IP不会使用,并拒绝响应
      trustedIPs:
        - "127.0.0.1"
        - "192.168.0.1"
```

## 四、路由器
https://doc.traefik.io/traefik/routing/routers/#services

路由器支持HTTP、TCP、UDP协议，他的定义就是路由规则，按照不同的host、path、header等信息转发到不同的服务中，在此过程中，路由器可能会使用中间件来更新请求。

一个路由器默认会接收所有 入口点 的请求，也可以显式的指定仅接收来自哪些入口点的请求。


## 五、服务
服务包含了实际的upstream servers, 它可以由简单的k8s service提供, 也可以由拥有高级功能的TraefikService提供

服务中还可以包含服务，比如 Host 为 example.com 的流量路由到了service A, service A 包含了 service B 和 service C,并设置了对应的权重，那么路由过来的流量会按照权重转发到service B 和 service C中, 这很适用于灰度发布

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2158/  

