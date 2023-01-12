# Istio-集成遥测插件kiali、jaeger、prometheus

<!--more-->
### 部署jaeger
1.安装
```bash
k apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/jaeger.yaml
```

### 部署kiali
1.安装
```bash
k apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/kiali.yaml
```
> 由于部署顺序问题，可能会导致创建失败，再运行一次上面命令即可。


2.检查部署状态
```bash
k rollout status deployment/kiali -n istio-system
```

3.接入prometheus、grafana、jaeger
修改configmap
```bash
k edit -n istio-system cm kiali
```
内容如下:
```yaml
    external_services:
      custom_dashboards:
        enabled: true
      prometheus:
        url: http://prometheus-k8s.monitoring:9090
      grafana:
        enabled: true
        in_cluster_url: "http://grafana.monitoring:3000"
        url: "http://192.168.2.10:30462"
      tracing:
        enabled: true
        in_cluster_url: "http://tracing.istio-system/jaeger"
        url: "http://192.168.2.10:32344/jaeger"
```

4.重启pod
```bash
k rollout -n istio-system restart deployment kiali
```

### grafana-istio仪表盘
```yaml
Istio Control Plane Dashboard: 7645
Istio Mesh Dashboard: 7639
Istio Performance Dashboard: 12153
Istio Service Dashboard: 7636
Istio Wasa Extension Dashboard: 13277
Istio Workload Dashboard: 7630
```




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2678/  

