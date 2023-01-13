# k8s调度node失败

<!--more-->
<pre class="line-numbers"><code class="language-bash">journalctl -u kubelet.service -f

test-k8s-node3 kubelet[10533]: W0114 10:24:01.970016   10533 eviction_manager.go:160] Failed to admit pod kube-flannel-ds-amd64-6hwz9_kube-system(eda94251-3674-11ea-be8c-fa163e30703c) - node has conditions: [DiskPressure]
</code></pre>
由此看出应该和硬盘有关系

df -h

清理出空间后就恢复正常了

&nbsp;

https://my.oschina.net/xiaominmin/blog/1944054?spm=a2c4e.10696291.0.0.6fa919a4mLW72v


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1366/  

