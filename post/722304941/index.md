# Rpm包制作


<!--more-->

## 参考

[OpenEuler 构建RPM包](https://docs.openeuler.org/zh/docs/22.03_LTS_SP4/docs/ApplicationDev/%E6%9E%84%E5%BB%BARPM%E5%8C%85.html)

[How to create a Linux RPM package](https://www.redhat.com/sysadmin/create-rpm-package)

[RPM Packaging Guide](https://rpm-packaging-guide.github.io)


## 一、安装 rpm 工具包

```bash
$ yum install -y rpmdevtools rpmlint
```

## 二、创建 RPM 目录结构

```bash
# 执行后会在用户家目录下生成 rpmbuild 目录
$ rpmdev-setuptree

$ tree rpmbuild/
rpmbuild/
├── BUILD
├── RPMS
├── SOURCES
├── SPECS
└── SRPMS
```

> - BUILD 目录在 RPM 包的构建过程中使用, 存放的是解压后的源码和编译过程中产生的中间文件。宏: `%_builddir`
> - RPMS  目录用于存放为不同架构构建的 RPM 包，如果在.spec 文件中指定或在构建过程中指定了 noarch 架构，也会存放在此。宏: `%_rpmdir`
> - SOURCES 目录用于存放源代码和 patch 补丁包。宏: `%_sourcedir`
> - SPECS 目录包含 `.spec` 文件。`.spec` 文件规定了如何构建 rpm 包。宏: `%_specdir`
> - SRPMS 目录存放着 `.src.rpm` 软件包。源 RPM 软件包不属于任何特定的架构或发行版。实际的 `.rpm` 软件包构建是基于 `.src.rpm` 软件包进行的。宏: `%_srcrpmdir`
> - BUILDROOT 在 `%install` 阶段安装在此处。宏: `%_buildrootdir`

## 三、打包流程

打包的过程主要分为如下步骤：

1. 把源代码放到 `%_sourcedir` 中。
2. 进行编译，编译的过程是在 `%_builddir` 中完成的，一般情况下，源代码是压缩包格式，需要先进行解压。
3. 进行 `安装`，类似于预先组装软件包，把软件包应该包含的内容（比如二进制文件、配置文件、man文档等）复制到`%_buildrootdir`中，并按照实际安装后的目录结构组装，比如二进制命令可能会放在/usr/bin下，那么就在%_buildrootdir下也按照同样的目录结构放置。
4. 做一些必要的配置，比如在实际安装前的准备，安装后的清理等等。这些都是通过配置在SPEC文件中来告诉rpmbuild命令。
5. 检查软件是否正常运行。
6. 生成的RPM包放置到`%_rpmdir`, 源码包放置到%_srcrpmdir下。

|阶段|读取的目录|写入的目录|具体动作|
|----|----------|---------|--------|
|%prep|%_sourcedir|%_builddir|读取位于 %_sourcedir 目录的源代码和 patch 之后，解压源代码至 %_builddir 的子目录并应用所有 patch。|
|%build|%_builddir|%_builddir|编译位于 %_builddir 构建目录下的文件。通过执行类似 ./configure && make 的命令实现。|
|%install|%_builddir|%_buildrootdir|读取位于 %_builddir 构建目录下的文件并将其安装至 %_buildrootdir 目录。这些文件就是用户安装 RPM 后，最终得到的文件。|
|%check|%_builddir|%_builddir|检查软件是否正常运行。通过执行类似 make test 的命令实现。|
|bin|%_buildrootdir|%_rpmdir|读取位于 %_buildrootdir 最终安装目录下的文件，以便最终在 %_rpmdir 目录下创建 RPM 包。在该目录下，不同架构的 RPM 包会分别保存至不同子目录， noarch 目录保存适用于所有架构的 RPM 包。这些 RPM 文件就是用户最终安装的 RPM 包。|
|src|%_sourcedir|%_srcrpmdir|创建源码 RPM 包（简称 SRPM，以.src.rpm 作为后缀名），并保存至 %_srcrpmdir 目录。SRPM 包通常用于审核和升级软件包。|

## 四、打包选项
通过rpmbuild命令构建软件包。rpmbuild构建软件包一般可以通过构建SPEC文件、tar文件、source文件实现。

rpmbuild命令格式为：rpmbuild [option...]

常用的rpmbuild打包选项如下所示。

| Option              | Description                                               |
|---------------------|-----------------------------------------------------------|
| `-bp specfile`      | 从`specfile`文件的`%prep`段开始构建（解开源码包并打补丁）。|
| `-bc specfile`      | 从`specfile`文件的`%build`段开始构建。                    |
| `-bi specfile`      | 从`specfile`文件的`%install`段开始构建。                  |
| `-bl specfile`      | 从`specfile`文件的`%files`段开始检查。                    |
| `-ba specfile`      | 通过`specfile`文件构建源码包和二进制包。|
| `-bb specfile`      | 通过`specfile`文件构建二进制包。|
| `-bs specfile`      | 通过`specfile`文件构建源码包。|
| `-rp sourcefile`    | 从`sourcefile`文件的`%prep`段开始构建（解开源码包并打补丁）。|
| `-rc sourcefile`    | 从`sourcefile`文件的`%build`段开始构建。|
| `-ri sourcefile`    | 从`sourcefile`文件的`%install`段开始构建。|
| `-rl sourcefile`    | 从`sourcefile`文件的`%files`段开始检查。|
| `-ra sourcefile`    | 通过`sourcefile`文件构建源码包和二进制包。|
| `-rb sourcefile`    | 通过`sourcefile`文件构建二进制包。|
| `-rs sourcefile`    | 通过`sourcefile`文件构建源码包。|
| `-tp tarfile`       | 从`tarfile`文件的`%prep`段开始构建（解开源码包并打补丁）。|
| `-tc tarfile`       | 从`tarfile`文件的`%build`段开始构建。|
| `-ti tarfile`       | 从`tarfile`文件的`%install`段开始构建。|
| `-ta tarfile`       | 通过`tarfile`文件构建源码包和二进制包。|
| `-tb tarfile`       | 通过`tarfile`文件构建二进制包。|
| `-ts tarfile`       | 通过`tarfile`文件构建源码包。|
| `--buildroot=DIRECTORY` | 在构建时，使用`DIRECTORY`目录覆盖默认的`/root`目录。|
| `--clean`           | 完成打包后清除`BUILD`目录下的文件。|
| `--nobuild`         | 不执行任何实际的构建步骤。可用于测试`spec`文件。|
| `--noclean`         | 不执行`spec`文件的`"%clean"`阶段(即使它确实存在)。|
| `--nocheck`         | 不执行`spec`文件的`"%check"`阶段(即使它确实存在)。|
| `--dbpath DIRECTORY` | 使用`DIRECTORY`中的数据库，而不是默认的 `/var/lib/rpm`。|
| `--root DIRECTORY`  | 使`DIRECTORY`为最高级别的路径，默认“/”为最高路径。|
| `--rebuild sourcefile` | 将安装指定的源代码包`sourcefile`，然后进行准备、编译、安装。|
| `--recompile sourcefile` | 在`--recompile`的基础上额外构建一个新的二进制包。在构建结束时，构建目录、源代码和 `spec` 文件都将被删除(就好像用了 `--clean`)。|
| `-?`, `--help`      | 打印详细的帮助信息。|
| `--version`         | 打印详细的版本信息。|

## 五、开始构建

### 5.1. 创建目录结构下载源码

```bash
# rpmdev-setuptree
# cd ~/rpmbuild/SOURCES
# wget http://ftp.gnu.org/gnu/hello/hello-2.10.tar.gz
```

### 5.2 编辑 spec 文件

```bash
# cd ~/rpmbuild/SPECS
# vim hello.spec 

Name:     hello # 软件名
Version:  2.10  # 版本号
Release:  1%{?dist} # 发布编号
Summary:  The "Hello World" program from GNU # 简要说明，英文的话第一个字母应大写，以避免 rpmlint 工具（打包检查工具）警告。
Summary(zh_CN):  GNU "Hello World" 程序
License:  GPLv3+ # 说明软件包的协议版本，审查软件的 License 状态是打包者的职责，这可以通过检查源码或 LICENSE 文件，或与作者沟通来完成
URL:      http://ftp.gnu.org/gnu/hello # 软件包的官网
Source0:  http://ftp.gnu.org/gnu/hello/%{name}-%{version}.tar.gz # 源码包下载地址

BuildRequires:  gettext # 编译时需要提前安装的依赖

Requires(post): info  # 在安装完成后，即%post阶段需要满足的依赖。info程序或包必须在安装后可用，可能是因为安装过程或安装后的脚本需要使用info工具来完成某些功能或提供额外的信息。

Requires(preun): info # 在卸载前，即%preun阶段需要满足的依赖。这意味着在卸载此 RPM 包之前，info程序或包应该是可用的，可能是因为卸载脚本需要使用info工具来进行一些操作，比如清理与info相关的文档或数据。

%description # 软件包的详细说明
The "Hello World" program, done with all bells and whistles of a proper FOSS
project, including configuration, build, internationalization, help files, etc.

%description -l zh_CN # 中文说明
"Hello World" 程序, 包含 FOSS 项目所需的所有部分, 包括配置, 构建, 国际化, 帮助文件等。

%prep # 构建前的准备阶段
%setup -q # setup宏可以确保我们在正确的目录中工作，清除先前构建的残留，解压源压缩包，并设置一些默认权限。-q 表示安静模式，减少输出信息 

%build # 编译阶段
%configure # 这个宏用于运行配置脚本，通常是源码包中的`./configure`脚本。这个脚本会根据系统的环境和配置选项生成Makefile，使得后续的编译和安装过程能够正确执行。`%configure`会自动处理一些常见的配置选项，比如是否启用调试符号、选择正确的编译器等，从而简化了SPEC文件的编写。

make %{?_smp_mflags} # 这条命令用于启动实际的编译过程。`make`命令基于前面`%configure`生成的Makefile来编译源码。`%{?_smp_mflags}`是一个特殊的宏，它在多处理器或多核心系统上会自动添加并行编译的标志，如`-jN`，其中`N`是系统中逻辑处理器的数量。这可以显著加快编译速度。如果没有`_smp_mflags`这个条件宏被定义，那么这部分将不会被展开，`make`命令就会默认执行串行编译。

%install # 安装阶段
make install DESTDIR=%{buildroot}
rm -f %{buildroot}/%{_infodir}/dir

%post # 安装后执行
/sbin/install-info %{_infodir}/%{name}.info %{_infodir}/dir || : 

%preun # 删除前执行
if [ $1 = 0 ] ; then
/sbin/install-info --delete %{_infodir}/%{name}.info %{_infodir}/dir || :
fi

%files -f %{name}.lang # 包含在rpm中的文件列表, 下面的内容都会安装到相应的位置
%doc AUTHORS ChangeLog NEWS README THANKS TODO # 文档文件 
%license COPYING # 将COPYING文件作为许可文件，并在安装时复制到/usr/share/doc目录下，同时设置适当的文件权限。
%{_mandir}/man1/hello.1.* # 指定man page 'hello.1'，通常提供程序的使用说明。
%{_infodir}/hello.info.*  # 指定info文档，提供详细的程序信息和帮助。
%{_bindir}/hello # 指定可执行文件'hello'的安装位置, %{_bindir}/hello => /usr/bin/hello, 通过 rpm --eval '%{_bindir}' 可以获取宏对应的值


%changelog
* Thu Dec 26 2019 Your Name <youremail@xxx.xxx> - 2.10-1
- Update to 2.10
* Sat Dec 3 2016 Your Name <youremail@xxx.xxx> - 2.9-1
- Update to 2.9
```

### 5.3 打包

```bash
rpmbuild -ba hello.spec 
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/722304941/  

