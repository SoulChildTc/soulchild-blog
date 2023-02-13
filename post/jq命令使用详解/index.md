# Jq命令使用详解


<!--more-->

jq命令一般用来读取json数据,日常用法比较简单,有时候会有些特殊需求,每次都是用的时候查文档,过一段时间再用又忘了,效率太低,决定写个文章记录下来,方便以后自查。

在线测试工具: 

https://sandbox.bio/playgrounds?id=jq

https://jqkungfu.com/

https://jiehong.gitlab.io/jq_offline/

https://jqplay.org/

### 参数介绍

`--stream`: 处理大量数据的时候使用

`--slurp`/ `-s`: 当输入内容是多个json对象时，将多个json对象视为1个json数组。这样就可以用一个jq过滤器来处理所有的输入，而不是每个JSON值都要处理一次。比如
```bash
{"name": "test1"}
{"name": "test2"}
#jq -s会将上面的内容处理成下面这样###############
[
  {"name": "test1"},
  {"name": "test2"}
]
```

`--raw-input`/ `-R`: 不要将输入解析为 JSON。相反，每一行文本都作为字符串传递给过滤器。如果与 `--slurp` 结合使用，则整个输入将作为单个长字符串传递给过滤器。
例如将大写字母转换为小写字母: `echo -e "ONE\nTWO\nTHREE" | jq -R ascii_downcase`

`--null-input`/ `-n`: 不读取任何内容, 使用jq构造数据时可以使用，例如`jq -n 1+1`

`--compact-output`/ `-c`: 紧凑的打印输出内容

`--tab`: 缩进使用制表符而不是两个空格

`--indent n`: 使用指定的空格作为锁紧, 范围-1到7

`--color-output`/`-C`: 强制高亮显示,默认只在终端输出才会高亮显示,一个很好的例子: 
```bash
echo '{"name": 1}'  | jq | cat # 不会高亮显示

echo '{"name": 1}'  | jq -C | cat # 高亮显示
```

`--monochrome-output`/ `-M`: 强制不输出颜色，即使使用了-C也不会输出颜色

`--ascii-output`/ `-a`: 将ASCII码之外的Unicode符号显示为转义的形式，默认是会将Unicode符号按照UTF8输出
```bash
[root@mytest ~]# echo '{"name": "SoulChild\u968f\u7b14\u8bb0"}' | jq -a
{
  "name": "SoulChild\u968f\u7b14\u8bb0"
}
[root@mytest ~]# echo '{"name": "SoulChild\u968f\u7b14\u8bb0"}' | jq 
{
  "name": "SoulChild随笔记"
}
```

`--unbuffered`: 不使用缓冲区,实时输出处理结果, 在默认情况下，jq在处理完所有输入数据后才将其输出，以便进行必要的排序和格式化。

`--sort-keys`/ `-S`: 按照key升序输出,更高级的排序可以使用sort和sort_by,配合reverse反转
```bash
[root@mytest ~]# echo '{"name": "SoulChild", "age": "10"}' | jq 
{
  "name": "SoulChild",
  "age": "10"
}
[root@mytest ~]# echo '{"name": "SoulChild", "age": "10"}' | jq -S
{
  "age": "10",
  "name": "SoulChild"
}
```

`--raw-output`/ `-r`: 获取的结果如果是字符串,去掉字符串中的引号

`--join-output`/ `-j`: 类似于-r，但不会在最后打印换行符。

`-f filename`/ `--from-file filename`: 从文件读取过滤器，而不是从命令行读取，比如awk的-f选项。你也可以使用"#"来做注释。

`-Ldirectory`/ `-L directory`: 复杂的jq脚本可能依赖其他的jq脚本,这种情况下可以设置jq脚本文件的搜索路径

`-e`/ `--exit-status`: 根据获取到的结果决定退出码是多少
```bash
# 输出值既不是 false 也不是 null，退出状态码为 0
[root@mytest ~]# echo '{"foo": false}' | jq -e . ;echo $?
{
  "foo": false
}
0
# 输出值是 false 或 null，则设置为 1
[root@mytest ~]# echo '{"foo": false}' | jq -e .foo ;echo $?
false
1

# 出现任何使用问题或系统错误，jq 将以 2 退出
[root@mytest ~]# jq '.' aa;echo $?
jq: error: Could not open file aa: No such file or directory
2

# 如果存在 jq 程序编译错误(语法错误)，则返回 3
[root@mytest ~]# echo '{"foo": false}' | jq -e xxx ;echo $?
jq: error: xxx/0 is not defined at <top-level>, line 1:
xxx
jq: 1 compile error
3

# 非有效数据，则设置为 4。
[root@mytest ~]# echo '{"foo": false' | jq '.hello';echo $?
parse error: Unfinished JSON term at EOF at line 2, column 0
4

内置函数`halt_error`也可以修改exit code。
```

`--arg name value`: 变量传递,例如
```bash
# 传递两个变量name和name2
# .hello as $greeting将获取的结果赋值给$greeting变量
[root@mytest ~]# echo '{"hello": "world"}' | jq --arg name "John Doe" --arg name2 "SoulChild" '.hello as $greeting | $greeting + ", " + $name + ", " + $name2'
"world, John Doe, SoulChild"

# 修改原内容
[root@mytest ~]# echo '{"name": "xxx"}' | jq --arg newName "SoulChild" '.name = $newName'
{
  "name": "SoulChild"
}
```

`--argjson name JSON-text`: 变量传递,值是json对象
```bash
[root@mytest ~]# echo '{"name": "xxx"}' | jq --argjson data '{"book": "hello", "name": "SoulChild", "age": 10}' '.book=$data.book | .name=$data.name | .age=$data.age'
{
  "name": "SoulChild",
  "book": "hello",
  "age": 10
}
```

`--slurpfile variable-name filename`: 读取整个文件并将其内容作为一个数组存储在指定的变量中。(文件格式是json)
```bash
[root@mytest ~]# cat test.json 
[
  {"name1": "a"},
  {"name2": "b"}
]
# 查看读入后的内容
[root@mytest ~]# echo '{"age": 1}' | jq --slurpfile content test.json '$content'
[
  [
    {
      "name1": "a"
    },
    {
      "name2": "b"
    }
  ]
]
```

`--rawfile variable-name filename`: 读取整个文件并将其内容作为一个字符串存储在指定的变量中。(字符串比较复杂时可以用这个参数,把它存入文件中再读取)
```bash
[root@mytest ~]# cat test.json 
[
  {"name1": "a"},
  {"name2": "b"}
]
[root@mytest ~]# echo '{"age": 1}' | jq --rawfile content test.json '$content'
"[\n  {\"name1\": \"a\"},\n  {\"name2\": \"b\"}\n]\n"
```

`--argfile variable-name filename`: 将文件内容作为一个变量传给指定的变量。(文件格式是json)
```bash
[root@mytest ~]# cat test.json 
[
  {"name1": "a"},
  {"name2": "b"}
]
[root@mytest ~]# echo '{"age": 1}' | jq --argfile content test.json '$content'
[
  {
    "name1": "a"
  },
  {
    "name2": "b"
  }
]
```

`--args`: 将命令行的位置参数作为数组传入(传入内容被识别为字符串)
```bash
# 这里的args是"John Doe" 30，就像shell中的$1,$2
# 在jq中通过$ARGS.positional[0]获取第一个变量
[root@mytest ~]# echo '{ "name": "", "age": "" }' | jq --args '.name=$ARGS.positional[0] | .age=$ARGS.positional[1]' "John Doe" 30
{
  "name": "John Doe",
  "age": "30"
}
```

`--jsonargs`: 将命令行的位置参数作为数组传入(传入内容被识别为json对象)
```bash
# 这里的--jsonargs是'{"name": "John Doe", "age": 30}' '{"name": "SoulChild", "age": 31}'，就像shell中的$1,$2
# 在jq中通过$ARGS获取所有的变量，通过$ARGS.positional[0]可以获取第一个
[root@mytest ~]#  echo '{ "name": "", "age": "" }' | jq --jsonargs '$ARGS' '{"name": "John Doe", "age": 30}' '{"name": "SoulChild", "age": 31}'
{
  "positional": [
    {
      "name": "John Doe",
      "age": 30
    },
    {
      "name": "SoulChild",
      "age": 31
    }
  ],
  "named": {}
}
```

`--run-tests [filename]`: 执行测试用例


### 例子
未完待续。。。

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/jq%E5%91%BD%E4%BB%A4%E4%BD%BF%E7%94%A8%E8%AF%A6%E8%A7%A3/  

