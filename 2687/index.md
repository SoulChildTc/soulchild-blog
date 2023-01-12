# 解决argocd ingress资源状态一直Progressing

<!--more-->
参考: https://argoproj.github.io/argo-cd/operator-manual/health/#custom-health-checks

```bash
k edit cm -n argocd argocd-cm


data:
  resource.customizations.health.extensions_Ingress: |
    hs = {}
    hs.status = "Healthy"
    hs.message = "SoulChild"
    return hs
  resource.customizations.useOpenLibs.extensions_Ingress: "true"
```


删除pod(没试过不删行不行)，然后argocd重新sync。
`k delete pod -n argocd argocd-application-controller-0`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2687/  

