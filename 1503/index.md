# k8s增加node节点

<!--more-->
1.生成token
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">kubeadm token create --print-join-command</code></pre>
2.加入集群
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">kubeadm join 192.168.0.10:6443 --token xxxxxxx --discovery-token-ca-cert-hash sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></pre>
&nbsp;

其他命令

查看token列表
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">kubeadm token list</code></pre>
&nbsp;

获取ca证书的sha256 hash值
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2&gt;/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'</code></pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1503/  

