# Viper配置库的使用


<!--more-->
### 一、简介
#### viper支持功能

- 设置默认值
- 从 `JSON`, `TOML`, `YAML`, `HCL`, `envfile`, `Java properties`中读取配置
- 实时监听和自动重载配置文件（可选功能）
- 从环境变量读取配置
- 从远程配置系统（etcd 或 Consul）读取，并监听和自动重载
- 从命令行flag读取
- 从缓冲区读取
- 代码中手动Set配置
- 参数别名系统
- 支持查找多个路径为配置文件目录
> 注意: viper中的配置项不区分大小写


#### 优先级
获取参数的优先级，从上到下，从高到低

- `Set()` 函数设置的参数，优先级最高
- `flag` 命令行的参数
- `env` 环境变量的参数
- `config` 配置文件的参数
- `key/value store` 远程配置
- `default` 默认值
### 二、安装
`go get github.com/spf13/viper`

### 三、常见用法
#### 1. 设置默认值
```go
viper.SetDefault("ContentDir", "content")
viper.SetDefault("LayoutDir", "layouts")
viper.SetDefault("Taxonomies", map[string]string{"tag": "tags", "category": "categories"})

```
#### 2. 从文件读取
```go
viper.SetConfigFile("app.yaml") // 配置文件路径,无扩展名的配置文件用这个读比较好
viper.SetConfigName("config") // 配置文件的名称, 不要带扩展名
viper.SetConfigType("yaml") // 如果文件名称中没有扩展名，则需要指定配置文件的格式
viper.AddConfigPath("/etc/appname/")   // 在/etc/appname/路径中查找配置文件
viper.AddConfigPath("$HOME/.appname")  // 多次调用，添加多个查找路径
viper.AddConfigPath(".")               // 多次调用，添加多个查找路径
err := viper.ReadInConfig() // 查找并读取配置文件
if err := viper.ReadInConfig(); err != nil {
	if _, ok := err.(viper.ConfigFileNotFoundError); ok {
		// 找不到配置文件
	} else {
		// 发生了其他的错误
	}
}
```
> var SupportedExts = []string{"json", "toml", "yaml", "yml", "properties", "props", "prop", "hcl", "tfvars", "dotenv", "env", "ini"}
> 
> var SupportedRemoteProviders = []string{"etcd", "etcd3", "consul", "firestore"}


#### 3. 设置和覆盖参数
```go
viper.Set("Key", "Value")
```

#### 4. 配置合并和将viper的配置持久化到本地
- `WriteConfig`将当前的 viper 配置写入到(最后一次读取到的配置文件名+ConfiogType为后缀)，覆盖写入。
- `SafeWriteConfig`将当前的 viper 配置写入到(最后一次读取到的配置文件名+ConfiogType为后缀)，如果文件存在，返回error。
- `WriteConfigAs` 将当前的 viper 配置写入指定的文件路径，覆盖写入。(只能指定支持的后缀名)
- `SafeWriteConfigAs`将当前的 viper 配置写入指定的文件路径，如果文件存在，则返回err。(只能指定支持的后缀名)
- 获取最后一次读取的配置文件`fmt.Println(viper.GetViper().ConfigFileUsed())`
```go
package main

import (
	"fmt"

	"github.com/spf13/viper"
)

func main() {

	/*
		1. 设置配置文件目录
	*/
	viper.AddConfigPath("./config")

	/*
		2. 读取第一个配置文件app.yaml
		配置内容为
		default:
		  filename: app.yaml
		  type: yaml
	*/
	viper.SetConfigName("app")
	viper.SetConfigType("yaml")

	if err := viper.ReadInConfig(); err != nil {
		fmt.Print(err.Error())
	}
	fmt.Printf("只读取app.yaml:%+v \n", viper.AllSettings())

	// /*
	// 	3. 添加一个默认配置
	// */
	viper.SetDefault("default.name", "代码设置的值")

	/*
		4. 读取第二个配置文件.env.ini
		配置内容为
		type=ini
		filename=.env.ini
	*/
	viper.SetConfigName(".env")
	viper.SetConfigType("ini")
	// !!!!!合并配置, 后读取到的参数会覆盖之前的
	// 正常是会覆盖的，但是某些特殊情况不会覆盖，比如我测试yaml内容如果为default.type: yaml, ini的内容为type=ini, 这个情况就没有覆盖为ini
	if err := viper.MergeInConfig(); err != nil {
		fmt.Println("合并配置出错", err.Error())
	}
	fmt.Printf("读取.env.ini后:%+v \n", viper.AllSettings())

	/*
		5. 持久化配置到本地
		将 name="代码设置的值" 保存到本地配置文件中
	*/
	// 获取保存到哪个文件
	fmt.Println("目标保存配置文件路径", viper.GetViper().ConfigFileUsed())

	// SafeWriteConfig
	if err := viper.SafeWriteConfig(); err != nil {
		fmt.Println("1保存配置失败", err.Error()) // 文件存在就会报错
	}

	// WriteConfigAs
	if err := viper.WriteConfigAs("./config/p.ini"); err != nil {
		fmt.Println("2保存配置失败", err.Error()) // 文件存在就会报错
	}

}

```

#### 5. 开启自动重新加载配置文件
在读取完所有配置文件之后使用`viper.WatchConfig()`即可
```go
package main

import (
	"fmt"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
)

func main() {
	/*
		1. 设置配置文件目录
	*/
	viper.AddConfigPath("./config")

	/*
		2. 读取第一个配置文件app.yaml
		配置内容为
		default:
		  filename: app.yaml
		  type: yaml
	*/
	viper.SetConfigName("app")
	viper.SetConfigType("yaml")
	if err := viper.ReadInConfig(); err != nil {
		fmt.Print(err.Error())
	}

    /*
        3. 文件监听的回调
	*/
	viper.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("配置文件发生变化:", e.Name)
		fmt.Println("操作类型:", e.Op.String())
	})

    // 启用文件监听
	viper.WatchConfig()

	for {
		fmt.Printf("当前所有配置:%+v \n", viper.AllSettings())
		time.Sleep(1 * time.Second)
	}

}
```

#### 6.  参数别名
```go
package main

import (
	"fmt"

	"github.com/spf13/viper"
)

func main() {
	/*
		1. 设置配置文件目录
	*/
	viper.AddConfigPath("./config")

	/*
		2. 读取第一个配置文件app.yaml
		配置内容为
		default:
		  filename: app.yaml
		  type: yaml
	*/
	viper.SetConfigName("app")
	viper.SetConfigType("yaml")
	if err := viper.ReadInConfig(); err != nil {
		fmt.Print(err.Error())
	}
	fmt.Printf("读取app.yaml: %+v \n", viper.AllSettings())
	
	// 设置别名filename == default.filename
	viper.RegisterAlias("filename", "default.filename")
    
	fmt.Println("default.filename: ", viper.GetString("default.filename"))
	fmt.Println("filename: ", viper.GetString("filename"))
	fmt.Printf("读取app.yaml: %+v \n", viper.AllSettings()) // 添加别名后会多出别名的配置
}
```

#### 7. 使用环境变量
使用环境变量有如下方式，如果多个地方设置了相同的参数，需要注意优先级(请看第一部分的简介)
- `SetEnvPrefix` 设置环境变量前缀, `XXX`，viper会自动添加`_`
- `BindEnv` 手动绑定一些环境变量作为参数
- `AutomaticEnv`自动查找模式，在Get()时viper会根据查找的参数，去环境变量里找对应的值。比如`Get("name")`，就找`NAME`,有设置前缀的话就自动加前缀
- `SetEnvKeyReplacer`如果使用`Get("aa-bb")`获取参数时，viper会从环境变量中查找`AA-BB`，但是变量名不能有`-`, 肯定会找不到，所以需要替换`AA-BB`为`AA_BB`，使用方法请查看下面的示例
- `viper.AllowEmptyEnv(true)`默认情况下，空环境变量被认为是未设置的，并根据优先级顺序查找config中的内容。使用`AllowEmptyEnv`方法将空的环境变量视为set。

示例
```go
package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/spf13/viper"
)

func main() {
	/*
		使用BindEnv获取环境变量的值
	*/
	fmt.Println("使用BindEnv获取环境变量的值=========================================================")
	// 添加环境变量
	os.Setenv("MYAPP_NAME", "SoulChild")
	os.Setenv("NAME2", "随笔记")

	// 设置环境变量的前缀为 MYAPP_
	viper.SetEnvPrefix("MYAPP")

	// 将name和MYAPP_NAME绑定, 自动识别的环境变量名, 会带上前缀
	viper.BindEnv("name")
	// 将name2和NAME2绑定, 绑定指定的环境变量名, 不会带前缀
	viper.BindEnv("name2", "NAME2")

	// 通过name和name2获取参数值
	fmt.Println(viper.Get("name"))
	fmt.Println(viper.Get("name2"))

	os.Setenv("MYAPP_NAME", "newname") // 如果修改了环境变量, 获取到的值也会发生变化
	fmt.Println(viper.Get("name"))
	fmt.Println(viper.Get("name2"))

	/*
		使用AutomaticEnv自动绑定变量
	*/
	fmt.Println("使用AutomaticEnv=========================================================")
	// 添加环境变量
	os.Setenv("MYAPP_NAME2", "随笔记")

	// 设置环境变量的前缀为 MYAPP_
	viper.SetEnvPrefix("MYAPP")

	// 开启自动获取, 也就是Get("xx")的时候，自己去找对应的环境变量
	viper.AutomaticEnv()

	fmt.Println(viper.Get("name2")) // 从环境变量查找MYAPP_NAME2, 如果没有设置前缀就找NAME2

	/*
		SetEnvKeyReplacer 替换参数中的字符
	*/
	fmt.Println("SetEnvKeyReplacer=========================================================")
	// 设置环境变量
	os.Setenv("MYAPP_REFRESH_INTERVAL", "30s")

	// 创建替换器，将 `-` 替换为 `_`
	replacer := strings.NewReplacer("-", "_")
	// 设置替换器到viper实例中, viper内部会调用替换器的Replace()函数实现替换
	viper.SetEnvKeyReplacer(replacer)

	// 后续get带`-`的参数，都会替换为`_`
	fmt.Println(viper.Get("refresh-interval"))
    
    // 也可以自己实现viper.StringReplacer接口实现自定义替换。这个一般应该用不到,上面的方式足够用了
	// viper.NewWithOptions(viper.EnvKeyReplacer(strings.NewReplacer("-", "_"))) // 在实例化的时候操作

}
```

#### 8. 使用命令行选项
```go
package main

import (
	"fmt"

	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

func main() {
	pflag.IntP("port", "p", 80, `服务端口号`)
	pflag.StringP("LogLevel", "l", "INFO", `日志级别`)

	pflag.Parse()
	// 绑定命令行选项
	viper.BindPFlags(pflag.CommandLine)

	fmt.Println(viper.GetInt("port"))
	fmt.Println(viper.GetString("LogLevel"))
}

```

#### 9. 远程配置中心
[https://pkg.go.dev/github.com/spf13/viper#readme-remote-key-value-store-support](https://pkg.go.dev/github.com/spf13/viper#readme-remote-key-value-store-support)

viper支持"etcd", "etcd3", "consul", "firestore"作为远程配置中心, 

#### 10. 将配置反序列化到结构体

```go
package main

import (
	"fmt"

	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

type Config struct {
	Port     int
	LogLevel string
}

func main() {
	pflag.IntP("port", "p", 80, `服务端口号`)
	pflag.StringP("LogLevel", "l", "INFO", `日志级别`)

	pflag.Parse()
	// 绑定命令行选项
	viper.BindPFlags(pflag.CommandLine)

	var c Config
	// 将viper读取到的配置都存入 c 中
	if err := viper.Unmarshal(&c); err != nil {
		fmt.Print(err.Error())
	}

	fmt.Println(c.Port, c.LogLevel)
}
```
> viper.Unmarshal 如果viper中的配置在结构体中没有, 不会影响反序列化
> 
> viper.UnmarshalExact 如果viper中的配置在结构体中没有, 会panic
> 
> viper.UnmarshalKey 将某个配置，反序列化到结构体或者变量中. eg: `viper.UnmarshalKey("port", &c.port)`
> 


#### 11. 读取相关
通过`GetType`可以获取不同类型的参数，比如`GetInt`、`GetString`、`GetIntSlice`. 

具体文档在[https://pkg.go.dev/github.com/spf13/viper#readme-getting-values-from-viper](https://pkg.go.dev/github.com/spf13/viper#readme-getting-values-from-viper)

通过`IsSet`判断参数是否存在，不要使用是否为空来判断


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/viper%E9%85%8D%E7%BD%AE%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8/  

