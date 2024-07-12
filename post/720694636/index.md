# 探索 DevBox 高效开发的创新利器


<!--more-->

## 一、DevBox 是什么

DevBox 是一个命令行工具，它允许开发者通过定义项目所需的软件包列表，轻松创建隔离且可重现的开发环境。与传统的包管理器（如 yarn）不同，DevBox 管理的是操作系统级别的软件包（通常使用 brew 或 apt-get 安装的那种）。

## 二、为什么使用 DevBox

- 为团队提供一致的开发环境：通过在 devbox.json 文件中声明项目所需的工具列表，并运行 devbox shell，团队中的每个人都能获得具有完全相同版本工具的开发环境。

- 尝试新工具而不影响本地环境：DevBox 创建的开发环境与电脑中的其他内容隔离。如果想尝试新工具，只需将其添加到 DevBox Shell中，使用完毕后可轻松删除，保持电脑的整洁。

- 不牺牲速度：DevBox 可以在本地直接创建隔离环境，无需额外的虚拟化层，不会减慢文件系统或命令的执行速度。在准备发布时，它可以将环境转换为等效的容器。

- 解决版本冲突问题：当处理多个项目且每个项目需要不同版本的相同二进制文件时，DevBox 可以为每个项目创建隔离环境，使用所需的任何版本，避免版本冲突。

- 便携的开发环境：DevBox 的开发环境是可移植的，可以通过一次定义，以多种方式使用，包括本地 shell（通过 devbox shell 创建）、与 VSCode 配合使用的 devcontainer、用于构建生产镜像的 Dockerfile 以及在云中的远程开发环境，使其与本地环境镜像。

## 三、安装和更新 DevBox

```bash
# 安装
curl -fsSL https://get.jetify.com/devbox | bash

# 更新
devbox version update

# 回滚使用指定的版本
export DEVBOX_USE_VERSION=0.8.0
```

## 四、使用 DevBox

### 1. 项目中使用

```bash
# 创建工作目录
mkdir my-project

# 这将在当前目录中创建一个 devbox.json 文件。应将其提交到源代码管理。
devbox init

# 搜索需要的包, 例如 python
devbox search python3

# 安装指定的包
devbox add python@3.12.4

# 进入开发环境, 第一次使用 DevBox 会比较慢, 后续使用会更快
devbox shell

# 进入环境后可以使用你安装的包
python --version

# 系统全局的也可以使用
go version

# 更新包到最新版本
# 如果包版本指定为python@3, 则会自动更新到3的最新版本
# 如果包版本指定为python@latest, 则会自动更新到最新版本
devbox update

# 安装 devbox.json 中的包
devbox install 

# 卸载包
devbox rm ripgrep

# 退出开发环境
exit
```

> 共享你的环境: 要共享您的 DevBox Shell，请确保将 devbox.json 和 devbox.lock 文件签入源代码管理。这些文件将确保开发人员在运行您的项目时获得相同的包和环境。

### 2. 全局使用

通过 devbox global 命令可以代替系统的 yum、brew、apt 等工具

```bash
# 在全局中安装包
devbox global add ripgrep vim git

# 查看已安装的包
devbox global list

# 安装 devbox.json 中的包
devbox global install 

# 卸载包
devbox global rm ripgrep
```

> 添加到环境变量: `echo 'eval "$(devbox global shellenv --init-hook)"' >> ~/.zshrc`

### 3. 共享全局包配置

你可以通过 git 来管理你的全局包配置, 这样就可以在多个计算机中同步你的 DevBox 全局配置

```bash
# 配置存储路径通过如下命令查看
devbox global path
```

### 4. 运行脚本

devbox.json 文件如下, 可以使用 `devbox run test` 和 `devbox run build` 运行指定的脚本

```json
{
  "$schema":  "https://raw.githubusercontent.com/jetify-com/devbox/0.12.0/.schema/devbox.schema.json",
  "packages": ["python@3.12.4"],
  "shell": {
    "init_hook": [
      "echo 'Welcome to devbox!' > /dev/null"
    ],
    "scripts": {
      "test": [
        "echo \"Error: no test specified\" && exit 1"
      ],
      "build": ["bash build.sh"]
    }
  }
}
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/720694636/  

