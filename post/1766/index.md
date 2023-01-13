# rabbitmq3.6.5二进制安装

<!--more-->
## 安装erlang-19.3环境
[erlang和rabbitmq版本对应关系](https://www.rabbitmq.com/which-erlang.html)

```bash
# 安装依赖
yum -y install make gcc gcc-c++ kernel-devel m4 ncurses-devel openssl-devel unixODBC-devel

# 安装erlang19.3
wget http://erlang.org/download/otp_src_19.3.tar.gz
tar xf otp_src_19.3.tar.gz
cd otp_src_19.3/
./configure --prefix=/usr/local/erlang --with-ssl -enable-threads -enable-smmp-support -enable-kernel-poll --enable-hipe --without-javac
make && make install

#配置环境变量
vim /etc/profile
export ERL_HOME=/usr/local/erlang
export PATH=$PATH:$ERL_HOME/bin
```
编译后可能会出现下面的信息，缺少wxWidgets库，这个库是用于图形化界面的，所以这里就忽略了
`wx             : wxWidgets not found, wx will NOT be usable`

编译参数说明：
- --with-ssl：使用ssl
- -enable-threads：启用异步线程
- -enable-smp-support：启用对称多处理
- -enable-kernel-poll：启用kernel-poll在有很多连接时，可以极大的降低CPU的占用率
- --enable-hipe：启用hipe可以提升计算速度
- --without-javac：使用javac编译

## 安装rabbitmq-3.6.5
- 安装
```bash
wget https://www.rabbitmq.com/releases/rabbitmq-server/v3.6.5/rabbitmq-server-generic-unix-3.6.5.tar.xz
tar xf rabbitmq-server-generic-unix-3.6.5.tar.xz
mv rabbitmq_server-3.6.5 /usr/local/rabbitmq_server
```
- 创建配置文件
下面使用的是经典配置格式，3.7以上可以使用新格式k=v形式的
```erlang
vim /usr/local/rabbitmq_server/etc/rabbitmq/rabbitmq.config
[
  {rabbit, [
      {tcp_listeners, [5672]},
      %% 默认情况下guest用户只能使用本地访问，这里把本地用户列表清空
      {loopback_users,[]}
    ]
  }
].
```
- 启动rabbitmq
```bash
cd /usr/local/rabbitmq_server/sbin/
# 启动
./rabbitmq-server -detached

# 停止
./rabbitmqctl stop
```

- 启用rabbitmq_management插件
```bash
# 查看插件列表
./rabbitmq-plugins list
# 启用插件
./rabbitmq-plugins enable rabbitmq_management
```
端口说明：
rabbitmq的端口是5672
rabbitmq_management插件的端口是15672

- 打开web页面
ip:15672，默认账号密码是guest




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1766/  

