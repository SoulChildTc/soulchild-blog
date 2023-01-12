# xargs命令使用

<!--more-->
参考链接：http://www.ruanyifeng.com/blog/2019/08/xargs-tutorial.html
## xargs 命令的作用
** 管道的作用是将标准输出转换成标准输入 **
** xargs可以将标准输入转为命令行参数 **


`echo "hello world" | echo`        没有输出。因为管道右侧的echo不接受标准输入
`echo "hello world" | xargs echo`  输出hello world


### 1. -d参数-分隔符
默认情况下，xargs将换行符和空格作为分隔符，把标准输入分解成一个个命令行参数。

`echo "one two three" | xargs mkdir`
上面命令中，mkdir会新建三个子目录，因为xargs将one two three分解成三个命令行参数，执行mkdir one two three。


`echo -e "a\tb\tc" | xargs -d "\t" echo`  -d参数可以更改分隔符

### 2. -p，-t 参数-提示和询问
-p是打印最终执行的命令,并且询问是否执行
```bash
echo 'one two three' | xargs -p touch
touch one two three ?...
```

-t是打印出最终执行的命令,直接执行
```bash
echo 'one two three' | xargs -t rm
rm one two three
```

### 3. -0 参数与find命令-null作为分隔符
由于xargs默认将空格作为分隔符，所以不太适合处理文件名，因为文件名可能包含空格。

find命令有一个特别的参数-print0，指定输出的文件列表以null分隔。然后，xargs命令的-0参数表示用null当作分隔符。

```bash
find /tmp -type f -mtime 0 -print0 | xargs -p0 rm
rm /tmp/one /tmp/two /tmp/three ?...
```
上面命令删除/tmp路径下当天修改的文件。由于分隔符是null，所以处理包含空格的文件名，也不会报错。

还有一个原因，使得xargs特别适合find命令。有些命令（比如rm）一旦参数过多会报错"参数列表过长"，而无法执行，改用xargs就没有这个问题，因为它对每个参数执行一次命令。

```bash
find . -name "*.txt" | xargs grep "abc"
```
上面命令找出所有 TXT 文件以后，对每个文件搜索一次是否包含字符串abc。


### 4. -L参数-按行作为参数

标准输入包含多行,但是find不能接收这样的参数。会报错
```bash
echo -en 'a\nb\nc' | xargs -p find ./ -name
find ./ -name a b c ?...
```

可以使用-L参数指定多少行作为一个命令行参数。(分别运行了1次find命令)
```bash
echo -en 'a\nb\nc' | xargs -pL 1 find ./ -name
find ./ -name a ?...
find ./ -name b ?...
find ./ -name c ?...
```

### 5. -n参数-分割n个参数作为一个参数
```bash
echo -en 'hello world b c' | xargs -p find ./ -name

```

### 6. -i/I参数-将标准输入存入变量
`-i`将标准输入赋值给`{}`, `-I` xxx可以自定义赋值给谁
```bash
echo -e '1,2,3\n4\n5\n6' | xargs -I txt ls txt
ls: cannot access '1,2,3': No such file or directory
ls: cannot access '4': No such file or directory
ls: cannot access '5': No such file or directory
ls: cannot access '6': No such file or directory
```
或者
```echo -e '1,2,3\n4\n5\n6' | xargs -i ls {}```

利用-I执行多条命令
```
$ cat foo.txt
one
two
three

$ cat foo.txt | xargs -I file sh -c 'echo file; mkdir file'
one 
two
three

$ ls 
one two three
```
上面代码中，foo.txt是一个三行的文本文件。我们希望对每一项命令行参数，执行两个命令`（echo和mkdir）`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2110/  

