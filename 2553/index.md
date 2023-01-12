# kubectl插件管理工具 krew安装

<!--more-->
bash & zsh一键安装
```bash
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/krew.tar.gz" &&
  tar zxvf krew.tar.gz &&
  KREW=./krew-"${OS}_${ARCH}" &&
  "$KREW" install krew
)

# 配置环境变量
echo 'export PATH=$PATH:$HOME/.krew/bin' >> ~/.bashrc
```


linux-x86_64 手动安装
```bash
wget https://github.com/kubernetes-sigs/krew/releases/latest/download/krew.tar.gz
tar zxvf krew.tar.gz ./krew-linux_amd64
./krew-linux_amd64 install krew

# 配置环境变量
echo 'export PATH=$PATH:$HOME/.krew/bin' >> ~/.bashrc
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2553/  

