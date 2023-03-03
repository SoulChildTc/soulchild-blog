# Logrus日志库的使用


<!--more-->

#### 设置日志级别
```go
package main

import (
  "github.com/sirupsen/logrus"
)

func main() {
  logrus.SetLevel(logrus.TraceLevel)

  logrus.Trace("trace msg") // Trace级别显示所有的日志
  logrus.Debug("debug msg") // Debug显示debug、info、warn、error、fatal、panic
  logrus.Info("info msg")
  logrus.Warn("warn msg")
  logrus.Error("error msg")
  logrus.Fatal("fatal msg")
  logrus.Panic("panic msg")

  // xx、xxf、xxln的区别
  logrus.Info("hello", "world")
  logrus.Infof("hello %s", "world") // 支持格式化输出
  logrus.Infoln("hello", "world")   // 每个参数用空格分割
}
```

#### 设置显示代码行数和文件名
方便定位代码位置
```go
logrus.SetReportCaller(true)
```

#### 设置日志格式(json & text)
```go
	// 设置为json格式
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.Info("hello", "world")

	// 设置为text格式
	logrus.SetFormatter(&logrus.TextFormatter{})
	logrus.Info("hello", "world")
```
#### 第三方日志格式

- [FluentdFormatter](https://github.com/joonix/log). Formats entries that can be parsed by Kubernetes and Google Container Engine.
- [GELF](https://github.com/fabienm/go-logrus-formatters). Formats entries so they comply to Graylog's [GELF 1.1 specification](http://docs.graylog.org/en/2.4/pages/gelf.html).
- [logstash](https://github.com/bshuster-repo/logrus-logstash-hook). Logs fields as [Logstash](http://logstash.net/) Events.
- [prefixed](https://github.com/x-cray/logrus-prefixed-formatter). Displays log entry source along with alternative layout.
- [zalgo](https://github.com/aybabtme/logzalgo). Invoking the Power of Zalgo.
- [nested-logrus-formatter](https://github.com/antonfisher/nested-logrus-formatter). Converts logrus fields to a nested structure.
- [powerful-logrus-formatter](https://github.com/zput/zxcTool). get fileName, log's line number and the latest function's name when print log; Sava log to files.
- [caption-json-formatter](https://github.com/nolleh/caption_json_formatter). logrus's message json formatter with human-readable caption added.

#### 添加自定义字段
注意使用withField或者withFields后，之前设置的字段就失效了。
```go
	// 在日志中添加指定的字段
	logrus.WithField("service", "myproj").Info("指定自定义字段的日志") // 临时使用
	log := logrus.WithField("service", "myproj")             // 方便后续使用
	log.Info("指定自定义字段的日志")

	// 在日志中添加指定的多个字段
	log = logrus.WithFields(logrus.Fields{
		"key1": "v1",
		"key2": "v2",
	}) // 直接.Info("xxx")也可以直接调用
	log.Info("指定自定义字段的日志")
```

#### 将日志输出到多个地方
```go
	// 多个输出目标
	writer1 := &bytes.Buffer{}                                            // 内存
	writer2 := os.Stdout                                                  // 标准输出
	writer3, err := os.OpenFile("log.txt", os.O_WRONLY|os.O_CREATE, 0755) // 文件
	
	if err != nil {
		log.Fatalf("创建日志文件失败: %v", err)
	}

	logrus.SetOutput(io.MultiWriter(writer1, writer2, writer3)) // 设置多个输出目标

	logrus.Info("info msg")     // 写入日志
	io.Copy(os.Stdout, writer1) // 读取buffer中的日志,不过没啥必要
```
> 只要实现了Writer接口就可以作为输出目标，Writer接口定义如下
> type Writer interface {
>     Write(p []byte) (n int, err error)
> }

#### 自己创建log实例
默认exported.go中又个std对象，是logrus默认创建好的，上面的代码都是用的std实例，下面我们使用和他一样的方法创建一个log实例
```go
	log := logrus.New() // 这里拿到的log和直接使用logrus是相同的方法New出来的
	log.SetFormatter(&myLogFormatter{})
	log.SetLevel(logrus.DebugLevel)
	log.Info("test")
```
#### 自定义格式
自己实现一个`Formatter`接口，他的定义如下。
```go
/*
  Formatter接口需要实现Format方法, 他接收一个Entry类型的参数，这个参数包括日志的所有字段，比如
entry.Message、entry.Time、entry.Level，通过WithField或WithFields添加的字段包含在entry.Data中。
  Format方法的返回值是一个byte类型的切片和一个err.
*/
type Formatter interface {
	Format(*Entry) ([]byte, error)
}
```

Entry类型包含如下内容
```go
type Entry struct {
    Logger *Logger

    // Contains all the fields set by the user.
    Data Fields

    // Time at which the log entry was created
    Time time.Time

    // Level the log entry was logged at: Trace, Debug, Info, Warn, Error, Fatal or Panic
    // This field will be set on entry firing and the value will be equal to the one in Logger struct field.
    Level Level

    // Calling method, with package name
    Caller *runtime.Frame

    // Message passed to Trace, Debug, Info, Warn, Error, Fatal or Panic
    Message string

    // When formatter is called in entry.log(), a Buffer may be set to entry
    Buffer *bytes.Buffer

    // Contains the context set by the user. Useful for hook processing etc.
    Context context.Context

    // err may contain a field formatting error
    err string
}
```

Example
```go
package main

import (
	"fmt"

	"github.com/sirupsen/logrus"
)

// 声明结构体
type myLogFormatter struct {
}

// 实现Format方法
func (m *myLogFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	// fmt.Printf("%+v", entry)
	log := fmt.Sprintf("Level %s | Msg %s | Time %s \n", entry.Level, entry.Message, entry.Time)
	return []byte(log), nil
}

func main() {
	log := logrus.New()
	log.SetFormatter(&myLogFormatter{})
	log.Info("test")
}

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/logrus%E6%97%A5%E5%BF%97%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8/  

