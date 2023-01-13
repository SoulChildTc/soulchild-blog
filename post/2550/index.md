# k8s 配置kubecolor高亮显示

<!--more-->
### bash配置
1.下载安装
```bash
wget https://github.com//dty1er/kubecolor/releases/download/v0.0.20/kubecolor_0.0.20_Linux_x86_64.tar.gz
tar xf kubecolor_0.0.20_Linux_x86_64.tar.gz -C /usr/local/bin/ kubecolor
```

2.修改kubecolor别名为k
```bash
echo 'source<(kubectl completion bash)' >> ~/.bashrc
echo 'command -v kubecolor >/dev/null 2>&1 && alias k="kubecolor"' >> ~/.bashrc
echo 'complete -o default -F __start_kubectl k' >> ~/.bashrc
```

4.使配置生效
```bash
source ~/.bashrc
```


### zsh配置
```bash
wget https://github.com//dty1er/kubecolor/releases/download/v0.0.20/kubecolor_0.0.20_Linux_x86_64.tar.gz
tar xf kubecolor_0.0.20_Linux_x86_64.tar.gz -C /usr/local/bin/ kubecolor

cat >> ~/.zshrc <<EOF 
source <(kubectl completion zsh)
complete -o default -F __start_kubectl kubecolor
command -v kubecolor >/dev/null 2>&1 && alias k="kubecolor"
EOF
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2550/  

