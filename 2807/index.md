# k8s kubectl 自定义输出template

<!--more-->
备忘
```bash
k get deploy -o template --template='{{range .items}}{{.metadata.name}}--replicas:{{.spec.replicas}}--{{range .spec.template.spec.containers}}cpu:{{.resources.limits.cpu}},mem:{{.resources.limits.memory}}{{end}}{{printf "\n"}}{{end}}'
```

使用index处理引号问题
```bash
k get ingress -A -o template --template='{{range .items}}{{.metadata.name}}--class:{{ index .metadata.annotations "kubernetes.io/ingress.class"}}{{printf "\n"}}{{end}}'
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2807/  

