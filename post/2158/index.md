# traefik2配置简介(一)

<!--more-->
Traefik中的配置可以引用两种不同的内容：
- 路由配置（称为动态配置）`路由的配置`
- 启动配置（称为静态配置）`traefik本身的配置`


## 一、动态配置
traefik从providers动态获取路由配置信息

providers包括：`docker`,`kubernetes-Ingress`,`kubernetes-IngressRoute`,`rancher`,`consul`,`zookeeper`等等

动态配置的文档: https://doc.traefik.io/traefik/routing/overview/


## 二、静态配置
在traefik中定义了三种不同的定义方式（只能同时使用一种方式）：
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




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2158/  

