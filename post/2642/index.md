# tekton-报错Taskrun more than one PersistentVolumeClaim is bound

<!--more-->
在使用多个workspace并且使用不同的pvc时会出现这个报错。
`taskrun more than one PersistentVolumeClaim is bound`

解决方法:
```bash
k edit -n tekton-pipelines cm feature-flags
```
将disable-affinity-assistant参数改为"true"


github issues:
https://github.com/tektoncd/pipeline/issues/3480


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2642/  

