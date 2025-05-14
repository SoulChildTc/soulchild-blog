# K8s configmap很乱


<!--more-->

## 问题描述

在K8s中，ConfigMap可能会因为配置中存在制表符和行尾有空格导致格式混乱，这会影响配置的可读性和维护性。

原来的解决方法是使用以下命令：

```bash
k get cm nginx-config -o jsonpath='{.data.nginx\.conf}' > nginx.conf

sed -i -E  -e 's/[[:space:]]+$//g' -e 's/\t/    /g' nginx.conf

k create cm nginx-config --from-file nginx.conf --dry-run=client -o yaml | kubectl replace -f -
```

## kubectl-strip-cm 插件

为了简化这个过程，我开发了一个kubectl插件`kubectl-strip-cm`，可以一键净化ConfigMap中的内容。

### 安装方法

```bash
curl -LO https://github.com/SoulChildTc/kubectl-strip-cm/raw/main/kubectl-strip_cm
chmod +x ./kubectl-strip_cm
sudo mv ./kubectl-strip_cm /usr/local/bin/kubectl-strip_cm
```

### 使用方法

净化指定的ConfigMap：
```bash
kubectl strip-cm -n kube-system filebeat-config
```

使用`-f`选项忽略提示：
```bash
kubectl strip-cm -n kube-system filebeat-config -f
```

### 项目地址

项目已开源在GitHub: [https://github.com/SoulChildTc/kubectl-strip-cm](https://github.com/SoulChildTc/kubectl-strip-cm)

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/699434372/  

