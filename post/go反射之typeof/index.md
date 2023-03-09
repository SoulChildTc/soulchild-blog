# Go反射之TypeOf


<!--more-->

```go
package main

import (
	"fmt"
	"reflect"
)

type User struct {
	Name    string
	Age     int `json:"age"`
	mark    string
	Address struct {
		City string
	}
}

func (u *User) SayHello() {
	fmt.Printf("你好%s", u.Name)
}

// 未导出的方法
func (u *User) godBye() {
	fmt.Printf("再见%s", u.Name)
}

func main() {
	zs := User{Name: "张三", Age: 11, mark: "测试私有属性", Address: struct{ City string }{City: "Beijing"}}

	// 通过zs实体，返回一个Type类型, 拿到的是zs实体的类型信息,通过类型信息可以拿到属性,但是拿不到值
	// 也就是说可以知道zs实体的类型，他是结构体，就可以获取结构体有哪些属性方法，如果是函数就可以知道函数的名字入参出参个数等信息。
	t := reflect.TypeOf(&zs)

	// Kind 返回该实体的数据类型,比如ptr、int32、int64、string、array、map、slice...
	fmt.Println("t.Kind:\t", t.Kind()) // ptr

	// Elem 返回一个复合类型的元素类型,比如 map[string]int 的元素类型是 int, 切片 []string{} 的元素类型是string。注意返回的元素类型是Type,他可以继续调用Type的方法
	// 如果不是 Ptr、Array、Chan、Map、或 Slice, 就会panic
	fmt.Println("t.Elem:\t", t.Elem()) // 因为是指针类型, 所以可以用Elem(), 返回main.User
	// fmt.Println(reflect.TypeOf(User{}).Elem()) // 不支持结构体类型, 所以直接panic

	// Name 返回该实体的类型名 字符串。只有结构体、数组、切片、map等复合类型才具有名称，基本类型和指针类型等简单类型没有名称。
	fmt.Println("t.Name:\t", t.Name())                      // ""
	fmt.Println("t.Elem.Name:\t", t.Elem().Name())          // "User"
	fmt.Println("t.Name:\t", reflect.TypeOf(User{}).Name()) // "User"

	// String 返回类型的字符串表示形式。
	fmt.Println("t.String:\t", t.String()) // *main.User

	// NumMethod 如果是interface类型会返回导出+未导出的方法数量, 非interface类型只会返回导出方法的数量。(方法名大写开头是导出, 小写是未导出.)
	fmt.Println("t.NumMethod:\t", t.NumMethod()) // 1

	// MethodByName 根据方法名查找方法, 返回两个值
	// 1.找到的方法是Method类型
	// 		Method类型包含了方法的类型和函数信息。注意,如果你的实体是接口类型，那么Method.Fun是nil
	// 2.无法找到未导出的方法, 没有找到第二个返回值为false
	m, exist := t.MethodByName("SayHello")
	if exist {
		fmt.Println("t.MethodByName:\t", m) // {SayHello  func(*main.User) <func(*main.User) Value> 0}

	} else {
		fmt.Println("t.MethodByName:\t", "未找到")
	}

	// Method 返回所有方法中第i个方法(Method类型), 不要超出方法总数,否则panic
	fmt.Println("t.Method:\t", t.Method(0)) // {SayHello  func(*main.User) <func(*main.User) Value> 0}

	// Size 返回存储给定类型的值所需的字节数 它类似于 unsafe.Sizeof。
	fmt.Println("t.Size:\t", t.Size()) // 8
	// int8 1字节 int32 4字节, ptr 8字节
	type Example struct {
		a [1000]int32 // 1000*4字节=4000
		b int32       // 4字节
		c string      // 16字节, string存了两个指针,一个指向内存地址,另一个指向string的长度
	}
	fmt.Println("t.Size:\t", reflect.TypeOf(Example{}).Size()) // 4024, 多出来的4字节是内存对齐和填充导致的

	// Implements 该类型是否实现接口类型 u, 这里的u是Type类型
	type Person interface {
		SayHello()
	}
	pv := reflect.TypeOf((*Person)(nil)).Elem() // 使用(*Person)(nil)来获取接口的类型
	// User struct是否实现了Person接口, 注意如果User中的方法是带了指针接收器的, v必须是指针类型的User, 也就是说使用t.Elem().Implements会得到false
	fmt.Println("t.Implements:\t", t.Implements(pv)) // true

	// 下面这两个使用方法类似Implements
	// AssignableTo 该类型的值是否可分配给类型 u
	// ConvertibleTo 该类型的值是否可转换为类型 u。即使 ConvertibleTo 返回 true，转换仍然可能会 panic。例如，切片 []int{} 可转换为 *[3]int，前提是切片的长度大于等于数组的长度(多出的部分丢弃)，否则转换将会 panic。

	// Comparable 没有参数, 用于查看当前类型是否可以用于比较操作

	// 返回通道的方向
	var c <-chan int
	fmt.Println("ChanDir:\t", reflect.TypeOf(c).ChanDir()) // <-chan

	// IsVariadic 函数类型的最后的入参数是否为"..."参数。如果是 t.In(t.NumIn() - 1) 返回参数实际类型是切片。类型不是fun会panic

	// 返回结构体类型的字段数量。如果t.Kind不是Struct, 就会panic。
	fmt.Println("t.NumField:\t", t.Elem().NumField()) // 3

	// Field 返回结构类型的第 i 个字段。如果t.Kind不是Struct, 就会panic。返回的数据类型是StructField,他包括字段的类型、Tag、偏移量、是否为嵌套字段等信息
	fmt.Println("t.Field.IsExported:\t", t.Elem().Field(2).IsExported()) // 判断索引为2的字段是否为导出字段
	fmt.Println("t.Field.PkgPath:\t", t.Elem().Field(2).PkgPath)         // f.PkgPath 为空代表是导出的字段，非空代表是未导出的字段
	fmt.Println("t.Field:\t", t.Elem().Field(3).Type.Field(0).Name)      // City  获取嵌套字段的属性名

	// FieldByIndex 返回索引对应的嵌套字段。相当于对每个索引i依次调用Field。如果t.Kind不是Struct, 就会panic。
	fmt.Println("t.FieldByIndex:\t", t.Elem().FieldByIndex([]int{3, 0})) // City  获取嵌套字段的属性, 切片的第一个值是第一层属性的索引, 第二个值是嵌套字段的索引, 第三个...

	// FieldByName 根据属性名查找属性, 返回两个值
	// 1.找到的属性是StructField类型, 上面获取Field的方法也都是获得的这个类型
	// 		StructField类型包括字段的类型、Tag、偏移量、等属性, PkgPath、等等, 还提供了判断是否为导出字段的方法
	// 2.无法找到未导出的字段, 没有找到第二个返回值为false
	f, exist := t.Elem().FieldByName("Name")
	if exist {
		fmt.Println("t.Elem().FieldByName:\t", f)
	} else {
		fmt.Println("t.Elem().FieldByName:\t", "未找到")
	}

	// Key 返回map类型的key是什么类型, 如果t.Kind不是map, 就会panic。
	// Key() Type

	// Len 返回数组类型的大小(长度), 如果t.Kind不是array, 就会panic。
	// Len() int

	// FieldByNameFunc 同FieldByName，只不过这里接受的参数是一个函数，FieldByNameFunc会向这个函数遍历传递属性名, 如果函数return true代表找到
	// 查找顺序是广度优先查找
	// 注意不能return多次true, 否则最终结果是未找到。例如不能return s == "Name" || s == "Age"
	matchName := func(s string) bool {
		return s == "Name"
	}
	s, exist := t.Elem().FieldByNameFunc(matchName)
	if exist {
		fmt.Println("t.Elem().FieldByNameFunc:\t ", "找到了", s)
	} else {
		fmt.Println("t.Elem().FieldByNameFunc:\t 没找到")
	}

	// NumIn 返回函数类型的入参数量, 如果t.Kind不是Func, 就会panic
	// NumIn() int

	// In 返回函数类型的第i个入参的数据类型, 如果i超过了入参数量会panic
	// In(i int) Type

	// NumOut 返回函数类型的出参数量, 如果t.Kind不是Func, 就会panic
	// NumOut() int

	// Out 返回函数类型的第i个出参的数据类型, 如果i超过了出参数量会panic
	// Out(i int) Type

}

```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/go%E5%8F%8D%E5%B0%84%E4%B9%8Btypeof/  

