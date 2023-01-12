# zsh安装配置

<!--more-->
## 安装oh-my-zsh
```bash
# 安装oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```
> 没有zsh需要先安装zsh。 yum install zsh

## 修改主题
```bash
vim ~/.zshrc

ZSH_THEME="robbyrussell"
```

## 修改命令行样式:
```bash
vim ~/.oh-my-zsh/themes/robbyrussell.zsh-theme
PROMPT="%(?:%{$fg_bold[green]%} [em..] ➜ :%{$fg_bold[red]%} [em..] ➜ )"
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2717/  

