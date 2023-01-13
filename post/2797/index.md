# golang命名规范

<!--more-->
### 包名称
包名称和所在的目录保持一致，包名应该是小写,不使用下划线或者混合大小写
```golang
package events
```

### 文件名
小写,使用下划线分割单词
```bash
configmap_manager.go
```

### 结构体
驼峰命名，大驼峰还是小驼峰取决于访问权限
```golang
type simpleConfigMapManager struct {
	kubeClient clientset.Interface
}
```

### 接口命名
同结构体，名字一般以er结尾
```golang
type Manager interface {
	GetConfigMap(namespace, name string) (*v1.ConfigMap, error)
	RegisterPod(pod *v1.Pod)
	UnregisterPod(pod *v1.Pod)
}
```

### 变量命名
同结构体，如果变量类型为 bool 类型，则名称应以 has, is, can 或 allow 开头。
```golang
var isExist bool
var hasConflict bool
var canManage bool
var allowGitHook bool
```

### 单元测试
文件名以`_test.go`结尾，测试用例中的函数以`Test`开头
```golang
// implicit_test.go
func TestImplicit(t *testing.T)  {

}
```








---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2797/  

