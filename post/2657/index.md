# Istio1.9 安装-operator方式

<!--more-->
### 前言
Istio版本1.9.8

### 一、安装istioctl
```yaml
wget https://github.com/istio/istio/releases/download/1.9.8/istio-1.9.8-linux-amd64.tar.gz

tar xf istio-1.9.8-linux-amd64.tar.gz
cp istio-1.9.8/bin/istioctl /usr/local/bin/
```

### 二、安装istio operator
```yaml
istioctl operator init
```
> 此命令运行 operator 在 istio-operator 命名空间中创建以下资源：
> operator CRD
> crd的控制器 deployment/istio-operator
> 一个service，用于暴露istio operator的metrics
> Istio operator运行所必须的RBAC规则




### 三、安装istio
```yaml
kubectl create ns istio-system

kubectl apply -f - <<EOF
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: istio-controlplane
spec:
  profile: default
EOF
```
> profile预定义配置: https://istio.io/v1.9/zh/docs/setup/additional-setup/config-profiles/

> profile自定义配置: https://istio.io/v1.9/zh/docs/reference/config/istio.operator.v1alpha1/

#### 不同配置的区别
获取清单配置
```bash
istioctl manifest generate > default.yaml
istioctl manifest generate --set profile=demo > demo.yaml
```
只获取IstioOperator配置
```bash
istioctl profile dump default > default.yaml
istioctl profile dump demo > demo.yaml
```

总体来看主要是demo配置中多了egressgateway
- configMap-->istio
  demo配置中多出如下内容:`accessLogFile: /dev/stdout` # 将日志输出到控制台,默认配置是禁用的。`

- deployment-->istio-egressgateway
  demo配置中多了istio-egressgateway组件

- hpa-->istiod、ingressgateway
  default配置有两个hpa相关的配置.可以到istio-system命名空间下找到`istio-ingressgateway`、`istiod`


### 四、查看安装结果
```bash
k get pod -n istio-system

k get istiooperators -n istio-system istio-controlplane
```

### 五、配置自动注入
```bash
k label namespace default istio-injection=enabled
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2657/  

