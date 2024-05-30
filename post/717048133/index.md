# Pyenv备忘


<!--more-->

### 简介

pyenv 是一个用于管理 Python 版本的工具，可以让你在同一台机器上安装和切换不同的 Python 版本。

配合 virtualenv 插件, 还可以进行 python 虚拟环境的创建和切换。可以说是 多版本 + 多虚拟环境二合一的工具。

### 安装

```bash
curl https://pyenv.run | bash
```

安装后添加环境变量配置

```bash
cat >> ~/.bashrc <<'EOF'
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
EOF
```

由于 pyenv 使用编译安装 python, 所以需要一些编译环境
```bash
# Ubuntu/Debian/Mint
sudo apt update; sudo apt install build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev curl git \
libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev

# CentOS/Fedora 21 及以下版本
yum install gcc make patch zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel tk-devel libffi-devel xz-devel
```

### 使用

#### 列出可安装的版本

```bash
pyenv install -l
```

#### 安装和卸载指定版本

```bash
# 安装
pyenv install 3.5.10

# 卸载
pyenv uninstall 3.5.10
```

#### 列出已安装的版本

```bash
pyenv versions
```

#### 设置默认 python 版本

```bash
# 设置当前 shell 会话的 python 版本
pyenv shell <version>

# 设置当前目录的 python 版本
pyenv local <version>

# 设置当前用户的默认 python 版本
pyenv global <version>
```

#### 重新哈希 pyenv shims

一般在安装可执行文件后执行, 解决找不到命令的问题

```bash
pyenv rehash
```

#### virtualenv 相关

```bash
# 查看当前所有的虚拟环境

# 创建环境 - 使用默认的 python 版本
pyenv virtualenv env1

# 创建环境 - 使用指定的 python 版本
pyenv virtualenv 3.5.10 env2

# 进入环境
pyenv activate env1

# 退出环境
pyenv deactivate

# 删除环境
pyenv virtualenv-delete env1 # -f 参数不进行提示确认删除
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/717048133/  

