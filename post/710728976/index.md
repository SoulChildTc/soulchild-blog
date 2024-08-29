# Asdf常用命令备忘


<!--more-->

## 一、 插件管理

### 列出远程仓库中的插件

```bash
asdf plugin list all
```

### 列出已安装插件

```bash
asdf plugin list --urls --refs
# --urls 显示插件的git仓库地址
# --refs 显示插件的git分支和commit信息
```

### 安装插件

```bash
# 直接安装远程仓库中的插件
asdf plugin add python

# 也可以自定义安装其他仓库的插件
asdf plugin add custom custom-plugin-giturl 
```

### 删除插件

```bash
# 删除插件的同时也会删除使用这个插件安装的所有包版本
asdf plugin remove python
```

### 更新插件

```bash
# 更新插件到默认分支
asdf plugin update python

# 更新插件到指定的分支或commit
asdf plugin update python daa7d6ee570117f893b7f3a8ae034a722d641a6a

# 更新所有插件到默认分支
asdf plugin update --all
```

## 二、版本管理

### 列出可安装版本

```bash
# 列出 python 插件可安装的所有包版本
asdf list all python
asdf list all python 3.2 # 过滤出 3.2 相关的版本

# 列出 python 插件最新稳定的包版本
asdf latest python

# 列出所有插件最新稳定的包版本
asdf latest --all
```

### 安装包版本

```bash
# 安装指定的版本
# 如果出现ssl相关报错, 安装前先执行如下命令
# openssldir=$(openssl version -d |  awk -F ':' '{print $2}' | xargs dirname)
# export CPPFLAGS="-I${openssldir}/include" && explort LDFLAGS="-L${openssldir}/lib"
asdf install python 3.2.0

# 安装指定的版本中的稳定版本
asdf install python latest:3

# 安装 .tool-versions 文件中列出的所有软件包版本
asdf install

# 安装 .tool-versions 文件中所有的 python 软件包版本
asdf install python
```

### 列出已安装包版本

```bash
# 列出所有已安装的包版本
asdf list

# 只列出 python 插件安装的包版本
asdf list python
asdf list python 3.2 # 过滤出 3.2 相关的版本
```

### 使用指定的包版本

```bash
# 仅当前shell生效, 会增加环境变量 ASDF_${PLUGIN}_VERSION , 取消设置可以 unset ASDF_${PLUGIN}_VERSION
asdf shell python 3.12.0

# 仅当前目录生效, 会在当前目录创建 .tool-versions 文件 , 取消设置可以删除或更新 .tool-versions 文件
asdf local python 3.12.0

# 当前用户生效, 会创建 $HOME/.tool-versions 文件 , 取消设置可以删除或更新 $HOME/.tool-versions 文件
asdf global python 3.12.0
```

### 查看当前使用的包版本

```bash
# 查看所有插件当前使用的包版本
asdf current

# 查看python插件当前使用的包版本
asdf current python

```

### 删除包版本

```bash
# 删除 python 3.12.0
asdf uninstall python 3.12.0
```

### 查看包版本安装路径

```bash
# 查看当前 go 版本的安装路径
asdf where golang

# 查看指定 go 版本的安装路径
asdf where golang 1.21.0
```

### 查看可执行文件的真实路径

由于 asdf 使用了 shims 机制, 通过系统 which 命令看到的是一个 shims 脚本, 无法看到真实命令的路径

```bash
# 查看 go 命令的真实路径
asdf which go
```

## 三、其他

```bash
# 更新 asdf 到最新稳定版本
asdf update
# 更新 asdf 到最新版
asdf update --head

# 如果出现找不到命令的情况, 可以尝试执行如下命令
asdf reshim nodejs 18.17.1

# 和指定的命令在同一个环境下执行另一个命令, 默认执行 env 命令
asdf env npm pwd

# 查看当前命令是哪个插件的包版本提供的
asdf shim-versions npm
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/710728976/  

