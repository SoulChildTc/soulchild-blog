# rabbitmq常用命令行(二)-rabbitmqctl

<!--more-->
官方文档：https://www.rabbitmq.com/rabbitmqctl.8.html

## 命令格式
rabbitmqctl [-q] [-s] [-l] [-n node] [-t timeout] command [command_options]

### 参数选项：
* -n：指定node节点名称
* -q：静默输出，减少信息输出
* -s: 静默输出，减少信息输出并抑制表标头。
* --no-table-headers：不输出表格数据的标题
* --dry-run：尝试运行，不会真正的运行
* -t：超时时间，默认无限

### 常用命令选项：
#### 用户管理：
1. 添加用户：`rabbitmqctl add_user <username> <password>`
2. 修改密码：`rabbitmqctl change_password <username> <newpass>`
3. 删除用户：`rabbitmqctl delete_user <username>`
4. 用户列表：`rabbitmqctl list_users`
5. 设置用户角色：`rabbitmqctl set_user_tags <username> <tag1,tag2>`
6. 删除用户所有角色：`rabbitmqctl set_user_tags <username>`

角色说明：
> management
> 用户可以访问management插件

> policymaker
> 用户可以访问management插件，并管理他们有权访问的vhost的策略和参数。

> monitoring
> 用户可以访问管理插件，查看所有连接和通道以及与节点相关的信息。

> administrator
> 所有权限

#### 访问控制
1. 删除用户访问虚拟主机权限：`rabbitmqctl clear_permissions -p <vhost> <username>`
2. 查看虚拟主机对应用户的权限：`rabbitmqctl list_permissions -p <vhost>`
3. 查看用户拥有哪些虚拟主机的权限：`rabbitmqctl list_user_permissions <username>`
4. 查看所有虚拟主机`rabbitmqctl list_vhosts name tracing`
5. 给用户设置虚拟主机的权限：`rabbitmqctl set_permissions -p <vhost> <username> ".*" ".*" ".*"`

权限类型：
> Configure：创建与销毁资源
> Write：写入资源
> Read：读取资源



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1774/  

