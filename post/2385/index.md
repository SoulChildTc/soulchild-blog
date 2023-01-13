# centos7编译安装5.12.3内核

<!--more-->
### 1.下载内核
`wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.12.3.tar.xz`


### 2.安装编译环境
```bash
yum groupinstall -y "Development Tools"
yum install -y ncurses elfutils-libelf-devel openssl-devel bc
```

### 3.升级gcc
```
wget http://gcc.gnu.org/pub/gcc/releases/gcc-4.9.0/gcc-4.9.0.tar.gz
tar xf gcc-4.9.0.tar.gz
cd gcc-4.9.0
./contrib/download_prerequisites
mkdir build
cd build
../configure --enable-checking=release --enable-languages=c,c++ --disable-multilib
make -j2
make install
```

### 4.编译内核
```bash
# 解压
tar xf linux-5.12.3.tar.xz
cd linux-5.12.3

# 复制当前内核的配置选项作为当前编译的配置文件
cp /boot/config-$(uname -r) .config

# 选择自定义的配置
make menuconfig

# 编译
sed -ri "s#(CONFIG_RETPOLINE=).*#\1n#" .config
make -j2

# 安装模块
make modules_install

# 安装内核相关文件，会做如下修改
#安装bzImage为/boot/vmlinuz-VERSION-RELEASE
#生成initramfs文件
#修改grub的配置文件
make install
```

### 5. 修改默认启动内核重启
```bash
# 设置默认引导项
grub2-set-default 0

# 重启
reboot
```

### 卸载步骤
```bash
删除模块/lib/modules/5.12.3/
删除/boot/下5.12.3内核相关文件
修改grub菜单配置
设置默认启用内核
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2385/  

