# helm2安装使用

<!--more-->
## 安装
下载客户端：
```bash
wget https://get.helm.sh/helm-v2.10.0-linux-amd64.tar.gz
```

安装客户端:
```
tar xf helm-v2.10.0-linux-amd64.tar.gz
mv linux-amd64/helm  /usr/local/sbin/
```

安装tiller:
```bash
helm init --tiller-image=registry.cn-shanghai.aliyuncs.com/soulchild/tiller:v2.10.0
```

通过`helm version`查看安装结果


配置rbac：
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - name: tiller
    kind: ServiceAccount
    namespace: kube-system
```

指定pod的serviceaccount,也可以在初始化的时候加上--service-account参数
```bash
kubectl patch deployments. -n kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
```

## 常用命令：
```bash
#创建一个chart
helm create demo1
#检查chart是否正常
helm lint demo1/
#将chart打包
helm package demo1/
#安装一个chart
helm install demo1/
#查看release
helm ls
#查看历史release
helm ls -a
#删除release
helm delete dusty-condor
#删除历史release
helm delete dusty-condor --purge
#添加仓库
helm repo add aliyun https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts
#查看仓库列表
helm repo list
#更新仓库
helm repo update
#查找chart包
helm search mysql
#查看chart包详细信息
helm inspect aliyun/mariadb
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1801/  

