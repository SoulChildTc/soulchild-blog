# Gin框架自定义验证器


<!--more-->

### 一、注册验证器
```go
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("myValidate", myValidateFun) // 指定tag名称和处理函数
	}
```
> `binding.Validator.Engine()`会`return`一个`any`类型的实例，查看源码可以知道最终`return`的是`*Validate`类型的数据，所以需要将这个`any`类型的数据断言成`*Validate`类型,这个类型在这个包下(github.com/go-playground/validator/v10)，所以我们需要写成`*validator.Validate`


### 二、处理函数
通过`fl`可以拿到当前处理的字段值，但是他的类型是`reflect.Value`, 我们需要将他转换为目标类型之前，需要先使用`Interface()`方法将他转换为`空接口`类型，然后再将他断言为目标类型, 接下来就可以自己写逻辑了，`return true`代表校验成功
```go
func myValidateFun(fl validator.FieldLevel) bool {
    // fl.Param() // 获取参数，比如binding:"myValidate=100"
	if value, ok := fl.Field().Interface().(string); ok {
		if value != "admin" {
			return true
		}
		return false
	}

	return false
}
```

### 三、使用自定义校验器
```go
	type userInfo struct {
		Name string `json:"name" binding:"required,myValidate"`
		Age  int    `json:"age"`
		Sex  string `json:"sex"`
	}
```


### 完整代码
```go
package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func myValidateFun(fl validator.FieldLevel) bool {
	//fl.Param()
	if value, ok := fl.Field().Interface().(string); ok {
		if value != "admin" {
			return true
		}
		return false
	}

	return false
}

func main() {
	type userInfo struct {
		Name string `json:"name" binding:"required,myValidate=10"`
		Age  int    `json:"age"`
		Sex  string `json:"sex"`
	}
	r := gin.Default()

	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("myValidate", myValidateFun)
	}

	r.POST("/shouldBind", func(c *gin.Context) {
		var user userInfo
		err := c.ShouldBind(&user)
		if err != nil {
			c.String(200, err.Error())
		}
		c.JSON(200, user)
	})

	err := r.Run()
	if err != nil {
		return
	}

}

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/gin%E6%A1%86%E6%9E%B6%E8%87%AA%E5%AE%9A%E4%B9%89%E9%AA%8C%E8%AF%81%E5%99%A8/  

