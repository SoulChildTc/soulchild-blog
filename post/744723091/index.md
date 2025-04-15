# Python Uv备忘


<!--more-->

# uv: Python 包管理的未来

## 一、核心功能模块

### 1. 安装与配置

#### 1.1 什么是 uv？

uv 是一个用 Rust 编写的极速 Python 包和项目管理工具，由 Ruff 的创建者 Astral 团队开发。它的设计目标是提供一个统一的工具来替代 Python 生态系统中的多个工具，包括 pip、pip-tools、pipx、poetry、pyenv、twine、virtualenv 等。

#### 1.2 为什么选择 uv？

- **性能卓越**：比传统的 pip 快 10-100 倍
- **功能全面**：单一工具覆盖项目管理、依赖管理、脚本运行、工具安装等多种功能
- **兼容性好**：提供与现有工具兼容的接口，便于迁移
- **高效资源利用**：全局缓存系统实现依赖去重，节省磁盘空间
- **多平台支持**：支持 macOS、Linux 和 Windows

#### 1.3 安装 uv

```bash
# macOS 和 Linux 安装
curl -LsSf https://astral.sh/uv/install.sh | sh
# 或使用 Homebrew 安装
brew install uv

# Windows 安装
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 使用 pip 安装
pip install uv

# 验证安装
uv --version
```

### 2. 虚拟环境管理

#### 2.1 创建与管理虚拟环境

```bash
# 创建虚拟环境（默认在当前目录的 .venv 文件夹）
uv venv

# 指定 Python 版本创建虚拟环境
uv venv --python 3.11

# 指定路径创建虚拟环境
uv venv /path/to/venv

# 激活虚拟环境
# Linux/macOS
source .venv/bin/activate
# Windows
.venv\Scripts\activate
```

### 3. 依赖管理

#### 3.1 包管理基础操作

```bash
# 安装包
uv pip install requests

# 安装特定版本
uv pip install requests==2.28.1

# 从 requirements.txt 安装
uv pip install -r requirements.txt

# 升级包
uv pip install --upgrade requests

# 卸载包
uv pip uninstall requests

# 列出已安装的包
uv pip list

# 查看包信息
uv pip show requests

# 搜索包
uv pip search requests

# 冻结当前环境
uv pip freeze > requirements.txt
```

#### 3.2 高级依赖管理

##### 3.2.1 依赖文件编译

在 Python 项目中，我们通常使用 `requirements.txt` 来管理依赖。但是直接维护这个文件可能会很困难，特别是当项目依赖很多时。uv 提供了依赖文件编译功能，可以从一个简单的 `requirements.in` 文件生成完整的 `requirements.txt`(requirements.in 通常是开发者手动维护的)。

```bash
# 从 requirements.in 编译生成 requirements.txt
uv pip compile requirements.in --output-file requirements.txt

# 示例 requirements.in 文件内容：
# requests>=2.28.0
# beautifulsoup4
# pytest>=7.0.0
```

##### 3.2.2 依赖文件的高级选项

```bash
# 生成平台无关的依赖文件（不包含特定平台的包）
uv pip compile requirements.in --universal --output-file requirements.txt

# 生成包含哈希值的依赖文件（提高安全性，防止安装被篡改的包）
uv pip compile requirements.in --generate-hashes --output-file requirements.txt
```

##### 3.2.3 自定义包源

有时候我们需要从不同的包源安装包，比如使用国内镜像源或者私有仓库。uv 提供了多种方式来配置包源：

###### 命令行临时指定

```bash
# 使用清华镜像源安装包
uv pip install --index-url https://pypi.tuna.tsinghua.edu.cn/simple requests

# 添加额外的包源（比如私有仓库）
uv pip install --extra-index-url https://my-private-index.com/simple private-package
```

###### 配置文件永久设置

uv 支持通过配置文件设置默认的包源，配置文件有多个级别：项目级、用户级和系统级。

1. **配置文件类型和位置**：

   - **项目级配置**：
     - `pyproject.toml`（在 `[tool.uv]` 表下配置）
     - `uv.toml`（优先于 `pyproject.toml`）
   
   - **用户级配置**：
     - Linux/macOS: `~/.config/uv/uv.toml` 或 `$XDG_CONFIG_HOME/uv/uv.toml`
     - Windows: `%APPDATA%\uv\uv.toml`
   
   - **系统级配置**：
     - Linux/macOS: `/etc/uv/uv.toml` 或 `$XDG_CONFIG_DIRS/uv/uv.toml`
     - Windows: `%SYSTEMDRIVE%\ProgramData\uv\uv.toml`

2. **设置 pip 接口的包源**：

   可以通过 `[tool.uv.pip]` 或 `[pip]` 部分设置仅影响 `uv pip` 命令的配置：

   ```toml
   # pyproject.toml
   [tool.uv.pip]
   index-url = "https://pypi.tuna.tsinghua.edu.cn/simple"
   ```

   或者在 `uv.toml` 中：

   ```toml
   # ~/.config/uv/uv.toml
   [pip]
   index-url = "https://pypi.tuna.tsinghua.edu.cn/simple"
   ```

   **重要说明**：`[tool.uv.pip]` 或 `[pip]` 配置**仅对 `uv pip` 子命令生效**，例如 `uv pip install`、`uv pip uninstall` 等。这些配置**不会影响** `uv sync`、`uv lock`、`uv run` 等其他命令。如果你希望这些命令也使用相同的包源，需要使用全局索引配置（见下一部分）。

3. **设置全局包源配置**：

   通过全局索引配置，可以影响所有 uv 命令：

   ```toml
   # pyproject.toml(项目级)
   [[tool.uv.index]]
   url = "https://pypi.tuna.tsinghua.edu.cn/simple"
   default = true
   ```

   或者在 `uv.toml` 中：

   ```toml
   # ~/.config/uv/uv.toml(全局)
   [[index]]
   url = "https://pypi.tuna.tsinghua.edu.cn/simple"
   default = true
   ```

4. **常用国内镜像源**：

   ```toml
   # 清华镜像源
   url = "https://pypi.tuna.tsinghua.edu.cn/simple"

   # 阿里云镜像源
   # url = "https://mirrors.aliyun.com/pypi/simple"

   # 中国科技大学镜像源
   # url = "https://pypi.mirrors.ustc.edu.cn/simple"

   # 豆瓣镜像源
   # url = "https://pypi.douban.com/simple"
   ```

5. **优先级规则**：

   - 命令行参数 > 环境变量 > 项目配置 > 用户配置 > 系统配置
   - `uv.toml` 优先于同一目录中的 `pyproject.toml`
   - 可以使用 `--no-config` 禁用所有配置文件
   - 可以使用 `--config-file <path>` 指定特定配置文件

6. **验证配置**：

   ```bash
   # 使用 --dry-run 选项查看将要执行的命令而不实际执行
   uv pip install --verbose requests --dry-run
   ```

   uv 会在安装过程中显示使用的配置信息，包括包源等。

##### 3.2.4 依赖版本控制

在大型项目中，可能会遇到依赖版本冲突的问题。uv 提供了多种方式来解决这个问题：

```bash
# 使用约束文件覆盖特定依赖的版本
uv pip install -r requirements.txt --constraint "requests==2.28.0"

# 从单独的约束文件读取版本限制
uv pip install -r requirements.txt --constraint constraints.txt

# 示例 constraints.txt 文件内容：
# requests==2.28.0
# urllib3<2.0.0
```

##### 3.2.5 依赖安装的高级选项

```bash
# 跳过依赖关系检查，只安装指定的包
uv pip install --no-deps requests

# 这个选项在以下情况很有用：
# 1. 你知道所有需要的依赖都已经安装
# 2. 你想手动控制依赖版本
# 3. 你正在调试依赖问题
```

##### 3.2.6 实际应用场景

1. **开发环境与生产环境分离**
```bash
# 开发环境依赖
uv pip compile requirements.in --output-file requirements-dev.txt

# 生产环境依赖（不包含开发工具）
uv pip compile requirements.in --output-file requirements-prod.txt --no-dev
```

2. **多环境依赖管理**
```bash
# 为不同 Python 版本生成依赖文件
uv pip compile requirements.in --python-version 3.8 --output-file requirements-3.8.txt
uv pip compile requirements.in --python-version 3.9 --output-file requirements-3.9.txt
```

3. **依赖锁定与更新**
```bash
# 锁定所有依赖到特定版本
uv pip compile requirements.in --generate-hashes --output-file requirements.lock

# 更新所有依赖到最新版本
uv pip compile requirements.in --upgrade --output-file requirements.txt
```

### 4. 项目初始化与工作流

#### 4.1 创建新项目

```bash
# 创建一个项目
uv init my-project
cd my-project

# 项目结构
# my-project/
# ├── pyproject.toml  # 项目配置文件
# ├── README.md       # 自动生成的文档
# └── src/            # 源代码目录
#     └── my_project/ # 项目代码
#         └── __init__.py
```

#### 4.2 管理项目依赖

```bash
# 添加依赖
uv add requests

# 添加开发依赖
uv add --dev pytest

# 指定版本约束
uv add "requests>=2.28.0,<3.0.0"

# 从 Git 仓库添加依赖
uv add git+https://github.com/user/repo.git

# 移除依赖
uv remove requests
```

#### 4.3 锁定和同步依赖

```bash
# 生成锁文件（uv.lock）
uv lock

# 同步依赖（按照锁文件安装）
uv sync

# 更新锁文件中的依赖
uv lock --update
```

### 5. Python 版本管理

#### 5.1 版本请求格式

uv 支持多种 Python 版本请求格式，可以在大多数命令中使用 `--python` 标志指定：

```bash
# 创建虚拟环境时指定 Python 版本
uv venv --python 3.11.6
```

支持的版本请求格式：

- **版本号**：`3`、`3.12`、`3.12.3`
- **版本规范**：`>=3.12,<3.13`
- **实现**：`cpython` 或 `cp`
- **实现@版本**：`cpython@3.12`
- **实现+版本**：`cpython3.12` 或 `cp312`
- **实现+版本规范**：`cpython>=3.12,<3.13`
- **完整规范**：`cpython-3.12.3-macos-aarch64-none`

此外，还可以请求特定的系统 Python 解释器：

- **可执行文件路径**：`/opt/homebrew/bin/python3`
- **可执行文件名称**：`mypython3`
- **安装目录**：`/some/environment/`

#### 5.2 Python 版本文件

`.python-version` 文件可用于创建默认的 Python 版本请求。uv 会在工作目录及其父目录中搜索 `.python-version` 文件。如果未找到，uv 将检查用户级配置目录。

```bash
# 在当前目录创建 .python-version 文件(固定 python 版本)
uv python pin 3.11

# 在用户配置目录创建全局 .python-version 文件(固定 python 版本)
uv python pin --global 3.11
```

#### 5.3 安装 Python 版本

uv 捆绑了适用于 macOS、Linux 和 Windows 的可下载 CPython 和 PyPy 发行版列表。

```bash
# 安装特定版本
uv python install 3.12.3

# 安装最新的补丁版本
uv python install 3.12

# 安装满足约束的版本
uv python install '>=3.8,<3.10'

# 安装多个版本
uv python install 3.9 3.10 3.11

# 安装特定实现
uv python install pypy
```

**重要说明**：可用的 Python 版本在每个 uv 版本中都是固定的。要安装新的 Python 版本，可能需要升级 uv。

#### 5.4 查看可用的 Python 版本

```bash
# 列出已安装和可用的 Python 版本
uv python list # 只列出 cpython 解释器
uv python list pypy  # 只列出 PyPy 解释器

# 过滤 Python 版本
uv python list 3.13  # 显示所有 Python 3.13 解释器

# 查看所有版本(包含老的补丁版本)
uv python list --all-versions

# 查看其他平台的 Python 版本
uv python list --all-platforms

# 仅显示已安装的 Python 版本
uv python list --only-installed
```

#### 5.5 查找 Python 可执行文件

```bash
# 查找 Python 可执行文件
uv python find

# 查找特定版本的 Python 可执行文件
uv python find '>=3.11'

# 忽略虚拟环境，仅使用系统 Python
uv python find --system
```

#### 5.6 Python 版本发现机制

uv 在搜索 Python 版本时，会按以下顺序检查以下位置：

1. `UV_PYTHON_INSTALL_DIR` 中的托管 Python 安装
2. `PATH` 上的 Python 解释器（在 macOS 和 Linux 上为 `python`、`python3` 或 `python3.x`，在 Windows 上为 `python.exe`）
3. 在 Windows 上，检查 Windows 注册表和 Microsoft Store Python 解释器

#### 5.7 禁用自动 Python 下载

默认情况下，uv 会在需要时自动下载 Python 版本。可以通过 [https://docs.astral.sh/uv/reference/settings/#python-downloads](python-downloads) 选项禁用此行为：

```bash
# 如果没有发现可用的 python 版本, 禁用自动下载
uv pip install --no-python-downloads requests
```

#### 5.8 Python 实现支持

uv 支持 CPython、PyPy 和 GraalPy Python 实现。可以使用长名称或短名称请求实现：

- CPython: `cpython`、`cp`
- PyPy: `pypy`、`pp`
- GraalPy: `graalpy`、`gp`

### 6. 打包与发布

#### 6.1 准备项目打包

在把你的项目发布出去之前，先确保它已经准备好了：

如果你的 `pyproject.toml` 文件里没有 `[build-system]` 这一部分，uv 默认不会帮你构建。这说明你的项目可能还没准备好发布。

**小贴士**：如果你有些包只是内部使用不想公开发布，可以这样标记它：

```toml
[project]
classifiers = ["Private :: Do Not Upload"]
```

这样设置后，PyPI 就会拒绝你上传的包。这个设置只影响 PyPI，不会影响你用其他仓库。

为安全起见，最好只为特定项目生成令牌，这样就不会意外把不该发布的包发出去了。

#### 6.2 打包你的项目

这里说的"打包"是指把 Python 项目打包成可以在 PyPI（Python包索引）上发布的包。这些包可以是：

1. **Python 依赖库**：被其他 Python 项目导入使用的库，如 requests、pandas 等
2. **命令行工具**：安装后可以直接在命令行中执行的工具，如 trzsz、uv 本身

当你用 `pip install` 或 `uv pip install` 安装这些包时：
- 如果是依赖库，你可以在 Python 代码中通过 `import` 语句使用它
- 如果是命令行工具，安装后可以直接在终端中输入命令名来执行它

**依赖库和命令行工具的打包区别**：

打包过程本身没有区别，都是用 `uv build` 命令。关键区别在于 `pyproject.toml` 的配置：

1. 要创建命令行工具，需要在 `pyproject.toml` 中添加 `[project.scripts]` 部分：

```toml
[project.scripts]
工具名称 = "包名.模块:函数"
```

例如，一个叫 "hello-tool" 的命令，执行 `mypackage.cli` 模块中的 `main` 函数：

```toml
[project.scripts]
hello-tool = "mypackage.cli:main"
```

安装后，用户可以直接在命令行中输入 `hello-tool` 来运行你的程序。

2. 对于依赖库，不需要特别配置，只需确保包含必要的 `__init__.py` 文件和代码结构。

用这个命令来打包你的项目：

```bash
# 简单打包
uv build

# 这会在当前目录构建项目，并把生成的文件放在 dist/ 文件夹里
# 生成的文件通常是 .whl (wheel) 和 .tar.gz (源码包) 格式

# 打包指定目录的项目
uv build 项目路径

# 在多项目工作区中打包特定项目
uv build --package 项目名称
```

**小贴士**：默认情况下，`uv build` 会按照你在 `tool.uv.sources` 里的设置去找构建依赖。如果你要发布包，建议用 `uv build --no-sources` 命令，这样可以确保在其他人用不同工具构建时也能成功。

#### 6.3 发布到 PyPI

用 publish 命令发布你的包：

```bash
# 发布到 PyPI
uv publish

# 可以用 --token 或环境变量 UV_PUBLISH_TOKEN 来设置你的 PyPI 令牌
# 也可以用 --username/UV_PUBLISH_USERNAME 和 --password/UV_PUBLISH_PASSWORD 设置账号密码
```

**注意**：现在 PyPI 已经不支持用户名密码方式发布了，你需要用令牌。用令牌就相当于设置用户名为 `__token__`，密码为你的令牌值。

如果你想用自定义的包仓库，可以这样配置：

```toml
[[tool.uv.index]]
name = "测试PyPI"
url = "https://test.pypi.org/simple/"
publish-url = "https://test.pypi.org/legacy/"
explicit = true
```

然后发布时指定这个仓库：

```bash
uv publish --index 测试PyPI
```

**注意**：用 `--index` 参数时，系统必须能找到 `pyproject.toml` 文件，所以在自动化发布流程中要确保先拉取了代码。

有时候发布过程可能会中断，导致部分文件上传成功，部分没有。遇到这种情况时：
- 如果是发布到 PyPI，直接重新运行相同的命令就行，已经上传的文件会被自动忽略
- 如果是其他仓库，可以用 `--check-url 你的索引网址` 参数，uv 会智能地跳过已上传的文件，避免重复上传

#### 6.4 测试你发布的包

用这个命令测试你的包是否可以正常安装和使用：

```bash
# 安装并测试导入
uv run --with 包名 --no-project -- python -c "import 包名"
```

用 `--no-project` 参数是为了确保测试的是从 PyPI 安装的包，而不是你本地的代码。

**小技巧**：如果你刚刚发布过这个包，可能需要加上 `--refresh-package 包名` 参数，这样 uv 会忽略缓存，强制下载最新版本。

#### 6.5 发布到测试平台

如果你想先在测试环境试一下，可以发布到测试 PyPI：

```bash
# 发布到测试 PyPI
uv publish --repository testpypi

# 发布到其他自定义仓库
uv publish --repository 仓库地址
```

## 二、高级功能与特性

### 1. 脚本运行与命令执行

#### 1.1 运行无依赖的脚本

如果脚本没有依赖，可以直接用 `uv run` 执行：

```bash
# 运行无依赖的脚本
uv run example.py

# 脚本可以使用标准库
# 例如：import os, sys, json 等

# 传递参数给脚本
uv run example.py arg1 arg2

# 从标准输入读取脚本
echo 'print("hello world!")' | uv run -

# 如果脚本不依赖当前项目, 想在干净的基础 Python 环境中运行，使用 --no-project 标志
uv run --no-project example.py
```

#### 1.2 运行有依赖的脚本

当脚本需要其他包时，必须将这些包安装到脚本运行的环境中。uv 倾向于按需创建这些环境，而不是使用手动管理依赖的长期虚拟环境。这需要明确声明脚本所需的依赖。

```bash
# 使用 --with 选项请求依赖
uv run --with rich example.py

# 指定依赖版本约束
uv run --with 'rich>12,<13' example.py

# 请求多个依赖
uv run --with rich --with requests example.py
```

**注意**：如果在**项目**中使用 `uv run`（即带有 `pyproject.toml` 的目录），这些依赖将**添加到**项目的依赖中。要选择退出此行为，请使用 `--no-project` 标志。

#### 1.3 创建 Python 脚本

Python 最近添加了一种标准格式用于**内联脚本元数据**。它允许选择 Python 版本和定义依赖。使用 `uv init --script` 初始化带有内联元数据的脚本：

```bash
# 创建带有内联元数据的脚本
uv init --script example.py --python 3.12
```

#### 1.4 声明脚本依赖

内联元数据格式允许在脚本本身中声明脚本的依赖。

uv 支持为你添加和更新内联脚本元数据。使用 `uv add --script` 声明脚本的依赖：

```bash
# 为脚本添加依赖
uv add --script example.py 'requests<3' 'rich'
```

这将在脚本顶部添加一个 `script` 部分，使用 TOML 声明依赖：

```python
# /// script
# dependencies = [
#   "requests<3",
#   "rich",
# ]
# ///

import requests
from rich.pretty import pprint

resp = requests.get("https://peps.python.org/api/peps.json")
data = resp.json()
pprint([(k, v["title"]) for k, v in data.items()][:10])
```

uv 将自动创建一个包含运行脚本所需依赖的环境。

**重要**：使用内联脚本元数据时，即使在**项目**中使用 `uv run`，项目的依赖也会被忽略。不需要 `--no-project` 标志。

uv 还支持 Python 版本要求：

```python
# /// script
# requires-python = ">=3.12"
# dependencies = []
# ///

# 使用 Python 3.12 中添加的语法
type Point = tuple[float, float]
print(Point)
```

**注意**：即使为空，也必须提供 `dependencies` 字段。

`uv run` 将搜索并使用所需的 Python 版本。如果未安装 Python 版本，将下载该版本。

#### 1.5 使用替代包索引

如果你想使用替代包索引来解析依赖，可以使用 `--index` 选项提供索引：

```bash
# 使用替代包索引添加依赖
uv add --index "https://example.com/simple" --script example.py 'requests<3' 'rich'
```

这将在内联元数据中包含包数据：

```python
# [[tool.uv.index]]
# url = "https://example.com/simple"
```

如果需要身份验证才能访问包索引，请参阅包索引文档。

#### 1.6 锁定依赖

uv 支持使用 `uv.lock` 文件格式锁定 PEP 723 脚本的依赖。与项目不同，脚本必须使用 `uv lock` 显式锁定：

```bash
# 锁定脚本依赖
uv lock --script example.py
```

运行 `uv lock --script` 将在脚本旁边创建一个 `.lock` 文件（例如，`example.py.lock`）。

锁定后，后续操作如 `uv run --script`、`uv add --script`、`uv export --script` 和 `uv tree --script` 将重用锁定的依赖，必要时更新锁文件。

如果不存在此类锁文件，`uv export --script` 等命令仍将按预期运行，但不会创建锁文件。

#### 1.7 提高可重现性

除了锁定依赖外，uv 还支持在内联脚本元数据的 `tool.uv` 部分中使用 `exclude-newer` 字段，限制 uv 只考虑在特定日期之前发布的分发包。这对于提高脚本在稍后时间运行时的可重现性很有用。

日期必须指定为 RFC 3339 时间戳（例如，`2006-12-02T02:07:43Z`）。

```python
# /// script
# dependencies = [
#   "requests",
# ]
# [tool.uv]
# exclude-newer = "2023-10-16T00:00:00Z"
# ///

import requests

print(requests.__version__)
```

#### 1.8 使用不同的 Python 版本

uv 允许在每个脚本调用时请求任意 Python 版本，例如：

```bash
# 使用默认 Python 版本
uv run example.py

# 使用特定 Python 版本
uv run --python 3.10 example.py
```

#### 1.9 使用 GUI 脚本

在 Windows 上，`uv` 将使用 `pythonw` 运行以 `.pyw` 扩展名结尾的脚本：

```bash
# 在 Windows 上运行 GUI 脚本
uv run example.pyw

# 带依赖的 GUI 脚本
uv run --with PyQt5 example_pyqt.pyw
```

### 2. 全局工具管理

#### 2.1 临时运行工具

```bash
# 使用 uvx 别名在临时环境中运行工具
uvx ruff check .

# 等同于
uv tool run ruff check .

# 指定工具版本
uvx ruff@0.1.0 check .
```

#### 2.2 安装全局工具

```bash
# 安装工具到全局
uv tool install ruff

# 安装特定版本
uv tool install ruff==0.1.0

# 安装多个工具
uv tool install ruff black isort
```

#### 2.3 管理已安装的工具

```bash
# 列出已安装的工具
uv tool list

# 升级工具
uv tool upgrade ruff

# 升级所有工具
uv tool upgrade --all

# 卸载工具
uv tool uninstall ruff
```

### 3. 兼容性与扩展

#### 3.1 缓存管理

```bash
# 查看缓存信息
uv cache info

# 清理缓存
uv cache clear

# 清理特定缓存
uv cache clear --wheels
```

#### 3.2 并行处理

```bash
# 设置最大并行任务数
uv pip install -r requirements.txt --jobs 8
```

#### 3.3 迁移现有项目

```bash
# 从 pip 迁移
uv pip freeze > requirements.txt
uv init --from-requirements requirements.txt my-project

# 从 poetry 迁移
# poetry 项目中已有 pyproject.toml
uv init --from-poetry .
```

## 三、对比传统工具的优势

### 1. 一体化设计

uv 作为一个全面的 Python 包管理和项目管理工具，通过其出色的性能和丰富的功能集，正在改变 Python 开发者的工作方式。从简单的包安装到复杂的项目管理，uv 都提供了优雅且高效的解决方案。

- **替代多工具组合**：uv 可以替代 `pip` + `virtualenv` + `poetry` + `pipx` 等多工具组合
- **统一命令接口**：所有功能通过一致的命令接口提供，降低学习成本
- **全局工具管理**：通过 `uvx` 和 `uv tool` 命令提供全局工具管理功能

### 2. 现代化标准

- **原生支持 pyproject.toml**：与 Rust/Node.js 生态对齐，采用现代项目配置标准
- **锁文件机制**：提供可靠的依赖锁定机制，确保环境一致性
- **工作区支持**：原生支持多包项目工作区，简化复杂项目管理

### 3. 跨平台一致性

- **命令语法统一**：在所有支持的平台上提供一致的命令语法
- **环境隔离**：提供可靠的虚拟环境隔离，确保项目依赖不冲突
- **缓存优化**：全局缓存系统实现依赖去重，节省磁盘空间

## 参考资料

- [uv 官方文档](https://docs.astral.sh/uv/)
- [GitHub 仓库](https://github.com/astral-sh/uv)
- [Astral 官网](https://astral.sh)

## 总结

uv 作为一个全面的 Python 包管理和项目管理工具，通过其出色的性能和丰富的功能集，正在改变 Python 开发者的工作方式。从简单的包安装到复杂的项目管理，uv 都提供了优雅且高效的解决方案。

无论你是 Python 初学者还是经验丰富的开发者，采用 uv 都将显著提升你的开发效率和体验。这个由 Rust 驱动的下一代 Python 工具，代表了 Python 生态系统工具链的未来。



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/744723091/  

