# K8s configmap很乱


<!--more-->

由于配置中存在制表符和行尾有空格导致的

```bash
k get cm nginx-config -o jsonpath='{.data.nginx\.conf}' > nginx.conf

sed -i -E  -e 's/[[:space:]]+$//g' -e 's/\t/    /g' nginx.conf

k create cm nginx-config --from-file nginx.conf --dry-run=client -o yaml | kubectl replace -f -
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/699434372/  

