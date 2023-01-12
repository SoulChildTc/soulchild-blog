# rabbitmq常用命令行(一)-plugins

<!--more-->
## 服务启用管理
```bash
# 启动
rabbitmq-server -detached
# 关闭
rabbitmqctl stop
```

## 插件相关
###1. list
- -v 显示所有插件的详情（详细）
- -m 仅仅只显示插件的名称 (简约)
- -E 仅仅只显示显式启用的插件
- -e 仅仅只显示显式、隐式启用的插件
- <pattern> 表示用于过滤插件名称表达式
```bash
# 显示所有的插件，每一行一个
rabbitmq-plugins list

# 显示所有的插件，并且显示插件的版本号和描述信息
rabbitmq-plugins list -v

# 显示所有名称含有 "management" 的插件
rabbitmq-plugins list -v management

# 显示所有显示或者隐式启动的插件
rabbitmq-plugins list -e rabbit
```

###2. enable & disable & set
- --offline 仅仅修改启动的插件文件
- --online 将与正在运行的代理连接失败视为致命错误
- <plugin> 一个或多个插件名称
```bash
# 启用指定插件
rabbitmq-plugins enable

# 禁用指定插件
rabbitmq-plugins disable

# 禁用所有插件
rabbitmq-plugins set

# 启用management插件和它所依赖的插件，禁用其他所有插件
rabbitmq-plugins set rabbitmq_management
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1772/  

