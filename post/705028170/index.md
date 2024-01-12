# Config Syncer(kubed) K8s Secret&configmap同步工具


<!--more-->

## 一、概述

Config Syncer 可跨命名空间和集群保持 ConfigMap 和 Secret 同步

## 二、安装

config-syncer 之前称为 kubed, 目前安装 config-syncer 需要申请 license , 老版本的 kubed 不需要license, 如果求方便也可以装 kubed, 下面两个安装二选一即可。

### kubed 

kubed 安装比较简单

```bash
helm repo add appscode https://charts.appscode.com/stable/
helm repo update
helm install kubed appscode/kubed --namespace kube-system #--set config.configSourceNamespace=demo
```

### config-syncer

config-syncer 需要先申请 license

```bash
# 1. 注册
# 注册成功后会发送 token 到你的邮箱中
curl -d "email=***" -X POST https://license-issuer.appscode.com/register

# 2. 获取集群ID
k get ns kube-system -o jsonpath='{.metadata.uid}'

# 2. 申请license, 有效期1个月
curl -s -X POST -H "Content-Type: application/json" https://license-issuer.appscode.com/issue-license -d \ 
'{"name":"{{自定义名称}}","email":"{{你的邮箱}}","product":"config-syncer","cluster":"{{集群UID}}","tos":"true","token":"{{TOKEN}}"}' > license.txt

```

安装

```bash
helm template config-syncer \
  oci://ghcr.io/appscode-charts/config-syncer \
  --version v0.14.5 \
  --namespace kubeops \
  --create-namespace \
  --set-file license=license.txt \
  --no-hooks > deploy.yaml
```

## 三、使用

### 跨名称空间同步

创建一个普通的 configmap , 并查看全部 namespace , 可以发现并没有自动同步

```bash
kubectl create ns demo

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: omni
  namespace: demo
data:
  you: only
  leave: once
EOF

kubectl get configmaps --all-namespaces | grep omni

```

我们需要添加注解告知 kubed 我们要同步这个 ConfigMap.

`kubed.appscode.com/sync=""` 代表将这个 ConfigMap 同步到所有 Namespace 中

```bash
kubectl annotate configmap omni kubed.appscode.com/sync="" -n demo

kubectl get configmaps --all-namespaces | grep omni                                                                  
default              omni                                 2      2s
demo                 omni                                 2      2m14s
flux-system          omni                                 2      2s
kube-node-lease      omni                                 2      2s
kube-public          omni                                 2      2s
kube-system          omni                                 2      2s
local-path-storage   omni                                 2      2s
```

> 如果后续有新建的 Namespace , 也会进行自动同步

> 后续如果修改源 configmap , 也会自动同步

> 注意修改同步后的资源不会自动和源资源同步, 他这里的是利用的 informer 机制, 所以只有源资源发生变化时才会触发同步。

#### 不同注解参考

`kubed.appscode.com/sync=""` 代表将这个 ConfigMap 同步到所有 Namespace 中

`kubed.appscode.com/sync="app=kubed"` 仅同步到与标签选择器 app=kubed 匹配的名称空间。

`k annotate configmap omni kubed.appscode.com/sync- -n demo` 取消同步

### 跨集群同步

跨集群同步需要指定 kubeconfig 的内容, 以便让 kubed 可以管理多个集群。

并在源资源中添加 `kubed.appscode.com/sync-context` 注解标识要同步到哪个集群(多个集群使用逗号分隔)

默认情况下它将同步到 kubeconfig 中 context 指定的名称空间, 如果没有指定, 则同步到和源资源相同的名称空间。

在安装时可以指定 kubeconfig 的内容, 如下

```bash
helm install kubed appscode/kubed \
  --version v0.13.2 \
  --namespace kube-system \
  --set config.clusterName=kind \
  --set config.kubeconfigContent="$(cat ./docs/examples/cluster-syncer/demo-kubeconfig.yaml)"
```

> `--set config.clusterName=kind` 标识 incluster 的集群名称

> `--set config.kubeconfigContent` 指定 kubeconfig 的内容

#### 使用示例

```bash
kubectl annotate configmap omni kubed.appscode.com/sync-contexts="context-1,context-2" -n demo
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/705028170/  

