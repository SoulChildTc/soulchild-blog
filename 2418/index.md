# DOCKER基础技术：AUFS(转)

<!--more-->
# 原文地址: https://coolshell.cn/articles/17061.html

![15937-eubb2wdk1d.png](images/210893056.png)

AUFS是一种Union File System，所谓UnionFS就是把不同物理位置的目录合并mount到同一个目录中。UnionFS的一个最主要的应用是，把一张CD/DVD和一个硬盘目录给联合 mount在一起，然后，你就可以对这个只读的CD/DVD上的文件进行修改（当然，修改的文件存于硬盘上的目录里）。

AUFS又叫Another UnionFS，后来叫Alternative UnionFS，后来可能觉得不够霸气，叫成Advance UnionFS。是个叫Junjiro Okajima（岡島順治郎）在2006年开发的，AUFS完全重写了早期的UnionFS 1.x，其主要目的是为了可靠性和性能，并且引入了一些新的功能，比如可写分支的负载均衡。AUFS在使用上全兼容UnionFS，而且比之前的UnionFS在稳定性和性能上都要好很多，后来的UnionFS 2.x开始抄AUFS中的功能。但是他居然没有进到Linux主干里，就是因为Linus不让，基本上是因为代码量比较多，而且写得烂（相对于只有3000行的union mount和10000行的UnionFS，以及其它平均下来只有6000行代码左右的VFS，AUFS居然有30000行代码），所以，岡島不断地改进代码质量，不断地提交，不断地被Linus拒掉，所以，到今天AUFS都还进不了Linux主干（今天你可以看到AUFS的代码其实还好了，比起OpenSSL好N倍，要么就是Linus对代码的质量要求非常高，要么就是Linus就是不喜欢AUFS）。

不过，好在有很多发行版都用了AUFS，比如：Ubuntu 10.04，Debian6.0, Gentoo Live CD支持AUFS，所以，也OK了。

好了，扯完这些闲话，我们还是看一个示例吧（环境：Ubuntu 14.04）


首先，我们建上两个目录（水果和蔬菜），并在这两个目录中放上一些文件，水果中有苹果和蕃茄，蔬菜有胡萝卜和蕃茄。
```bash
$ tree
.
├── fruits
│   ├── apple
│   └── tomato
└── vegetables
    ├── carrots
    └── tomato
```
然后，我们输入以下命令：
```bash
# 创建一个mount目录
$ mkdir mnt

# 把水果目录和蔬菜目录union mount到 ./mnt目录中
$ sudo mount -t aufs -o dirs=./fruits:./vegetables none ./mnt

#  查看./mnt目录
$ tree ./mnt
./mnt
├── apple
├── carrots
└── tomato
```


我们可以看到在./mnt目录下有三个文件，苹果apple、胡萝卜carrots和蕃茄tomato。水果和蔬菜的目录被union到了./mnt目录下了。

我们来修改一下其中的文件内容：
```bash
$ echo mnt > ./mnt/apple
$ cat ./mnt/apple
mnt
$ cat ./fruits/apple
mnt
```
上面的示例，我们可以看到./mnt/apple的内容改了，./fruits/apple的内容也改了。
```bash
$ echo mnt_carrots > ./mnt/carrots
$ cat ./vegetables/carrots 
$ cat ./fruits/carrots
mnt_carrots
```
上面的示例，我们可以看到，我们修改了./mnt/carrots的文件内容，./vegetables/carrots并没有变化，反而是./fruits/carrots的目录中出现了carrots文件，其内容是我们在./mnt/carrots里的内容。

也就是说，我们在mount aufs命令中，我们没有指它vegetables和fruits的目录权限，默认上来说，命令行上第一个（最左边）的目录是可读可写的，后面的全都是只读的。（一般来说，最前面的目录应该是可写的，而后面的都应该是只读的）

所以，如果我们像下面这样指定权限来mount aufs，你就会发现有不一样的效果（记得先把上面./fruits/carrots的文件删除了）：
```bash
$ sudo mount -t aufs -o dirs=./fruits=rw:./vegetables=rw none ./mnt
$ echo "mnt_carrots" > ./mnt/carrots 
$ cat ./vegetables/carrots
mnt_carrots
$ cat ./fruits/carrots
cat: ./fruits/carrots: No such file or directory
```
现在，在这情况下，如果我们要修改./mnt/tomato这个文件，那么究竟是哪个文件会被改写？
```bash
$ echo "mnt_tomato" > ./mnt/tomato 
$ cat ./fruits/tomato
mnt_tomato
$ cat ./vegetables/tomato
I am a vegetable
```
可见，如果有重复的文件名，在mount命令行上，越往前的就优先级越高。

你可以用这个例子做一些各种各样的试验，我这里主要是给大家一个感性认识，就不展开试验下去了。

那么，这种UnionFS有什么用？

历史上，有一个叫Knoppix的Linux发行版，其主要用于Linux演示、光盘教学、系统急救，以及商业产品的演示，不需要硬盘安装，直接把CD/DVD上的image运行在一个可写的存储设备上（比如一个U盘上），其实，也就是把CD/DVD这个文件系统和USB这个可写的系统给联合mount起来，这样你对CD/DVD上的image做的任何改动都会在被应用在U盘上，于是乎，你可以对CD/DVD上的内容进行任意的修改，因为改动都在U盘上，所以你改不坏原来的东西。

我们可以再发挥一下想像力，你也可以把一个目录，比如你的源代码，作为一个只读的template，和另一个你的working directory给union在一起，然后你就可以做各种修改而不用害怕会把源代码改坏了。有点像一个ad hoc snapshot。

Docker把UnionFS的想像力发挥到了容器的镜像。你是否还记得我在介绍Linux Namespace上篇中用mount namespace和chroot山寨了一镜像。现在当你看过了这个UnionFS的技术后，你是不是就明白了，你完全可以用UnionFS这样的技术做出分层的镜像来。

下图来自Docker的官方文档Layer，其很好的展示了Docker用UnionFS搭建的分层镜像。

![38252-3yzl8jcxokj.png](images/210893056.png)

关于docker的分层镜像，除了aufs，docker还支持btrfs, devicemapper和vfs，你可以使用 -s 或 –storage-driver= 选项来指定相关的镜像存储。在Ubuntu 14.04下，docker默认Ubuntu的 aufs（在CentOS7下，用的是devicemapper，关于devicemapper，我会以以后的文章中讲解）你可以在下面的目录中查看相关的每个层的镜像：
`/var/lib/docker/aufs/diff/<id> `

在docker执行起来后（比如：docker run -it ubuntu /bin/bash ），你可以从/sys/fs/aufs/si_[id]目录下查看aufs的mount的情况，下面是个示例：
```bash
#ls /sys/fs/aufs/si_b71b209f85ff8e75/
br0      br2      br4      br6      brid1    brid3    brid5    xi_path
br1      br3      br5      brid0    brid2    brid4    brid6 

# cat /sys/fs/aufs/si_b71b209f85ff8e75/*
/var/lib/docker/aufs/diff/87315f1367e5703f599168d1e17528a0500bd2e2df7d2fe2aaf9595f3697dbd7=rw
/var/lib/docker/aufs/diff/87315f1367e5703f599168d1e17528a0500bd2e2df7d2fe2aaf9595f3697dbd7-init=ro+wh
/var/lib/docker/aufs/diff/d0955f21bf24f5bfffd32d2d0bb669d0564701c271bc3dfc64cfc5adfdec2d07=ro+wh
/var/lib/docker/aufs/diff/9fec74352904baf5ab5237caa39a84b0af5c593dc7cc08839e2ba65193024507=ro+wh
/var/lib/docker/aufs/diff/a1a958a248181c9aa6413848cd67646e5afb9797f1a3da5995c7a636f050f537=ro+wh
/var/lib/docker/aufs/diff/f3c84ac3a0533f691c9fea4cc2ceaaf43baec22bf8d6a479e069f6d814be9b86=ro+wh
/var/lib/docker/aufs/diff/511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158=ro+wh
64
65
66
67
68
69
70
/run/shm/aufs.xino
```
你会看到只有最顶上的层（branch）是rw权限，其它的都是ro+wh权限只读的。

关于docker的aufs的配置，你可以在/var/lib/docker/repositories-aufs这个文件中看到。

## AUFS的一些特性
AUFS有所有Union FS的特性，把多个目录，合并成同一个目录，并可以为每个需要合并的目录指定相应的权限，实时的添加、删除、修改已经被mount好的目录。而且，他还能在多个可写的branch/dir间进行负载均衡。

上面的例子，我们已经看到AUFS的mount的示例了。下面我们来看一看被union的目录（分支）的相关权限：

rw表示可写可读read-write。
ro表示read-only，如果你不指权限，那么除了第一个外ro是默认值，对于ro分支，其永远不会收到写操作，也不会收到查找whiteout的操作。
rr表示real-read-only，与read-only不同的是，rr标记的是天生就是只读的分支，这样，AUFS可以提高性能，比如不再设置inotify来检查文件变动通知。
权限中，我们看到了一个术语：whiteout，下面我来解释一下这个术语。

一般来说ro的分支都会有wh的属性，比如 “[dir]=ro+wh”。所谓whiteout的意思，如果在union中删除的某个文件，实际上是位于一个readonly的分支（目录）上，那么，在mount的union这个目录中你将看不到这个文件，但是read-only这个层上我们无法做任何的修改，所以，我们就需要对这个readonly目录里的文件作whiteout。AUFS的whiteout的实现是通过在上层的可写的目录下建立对应的whiteout隐藏文件来实现的。

看个例子：

假设我们有三个目录和文件如下所示（test是个空目录）：
```bash
# tree
.
├── fruits
│   ├── apple
│   └── tomato
├── test
└── vegetables
    ├── carrots
    └── tomato
```

我们如下mount：
```bash
# mkdir mnt

# mount -t aufs -o dirs=./test=rw:./fruits=ro:./vegetables=ro none ./mnt

# # ls ./mnt/
apple  carrots  tomato 
```
现在我们在权限为rw的test目录下建个whiteout的隐藏文件.wh.apple，你就会发现./mnt/apple这个文件就消失了:
```bash
 # touch ./test/.wh.apple

# ls ./mnt
carrots  tomato
```
上面这个操作和 rm ./mnt/apple是一样的。
## 相关术语
Branch – 就是各个要被union起来的目录（就是我在上面使用的dirs的命令行参数）

Branch根据被union的顺序形成一个stack，一般来说最上面的是可写的，下面的都是只读的。
Branch的stack可以在被mount后进行修改，比如：修改顺序，加入新的branch，或是删除其中的branch，或是直接修改branch的权限
Whiteout 和 Opaque

如果UnionFS中的某个目录被删除了，那么就应该不可见了，就算是在底层的branch中还有这个目录，那也应该不可见了。
Whiteout就是某个上层目录覆盖了下层的相同名字的目录。用于隐藏低层分支的文件，也用于阻止readdir进入低层分支。
Opaque的意思就是不允许任何下层的某个目录显示出来。
在隐藏低层档的情况下，whiteout的名字是’.wh.<filename>’。
在阻止readdir的情况下，名字是’.wh..wh..opq’或者 ’.wh.__dir_opaque’。

## 相关问题
看到上面这些，你一定会有几个问题：

### 其一、你可能会问，要有文件在原来的地方被修改了会怎么样？mount的目录会一起改变吗？答案是会的，也可以是不会的。因为你可以指定一个叫udba的参数（全称：User’s Direct Branch Access），这个参数有三个取值：

udba=none – 设置上这个参数后，AUFS会运转的更快，因为那些不在mount目录里发生的修改，aufs不会同步过来了，所以会有数据出错的问题。
udba=reval – 设置上这个参数后，AUFS会去查文件有没有被更新，如果有的话，就会把修改拉到mount目录内。
udba=notify – 这个参数会让AUFS为所有的branch注册inotify，这样可以让AUFS在更新文件修改的性能更高一些。
### 其二、如果有多个rw的branch（目录）被union起来了，那么，当我创建文件的时候，aufs会创建在哪里呢？ aufs提供了一个叫create的参数可以供你来配置相当的创建策略，下面有几个例子。

create=rr | round−robin 轮询。下面的示例可以看到，新创建的文件轮流写到三个目录中
```bash
hchen$ sudo mount -t aufs  -o dirs=./1=rw:./2=rw:./3=rw -o create=rr none ./mnt
hchen$ touch ./mnt/a ./mnt/b ./mnt/c
hchen$ tree
.
├── 1
│   └── a
├── 2
│   └── c
└── 3
    └── b
```

create=mfs[:second] | most−free−space[:second] 选一个可用空间最好的分支。可以指定一个检查可用磁盘空间的时间。

create=mfsrr:low[:second] 选一个空间大于low的branch，如果空间小于low了，那么aufs会使用 round-robin 方式。

更多的关于AUFS的细节使用参数，大家可以直接在Ubuntu 14.04下通过 man aufs 来看一下其中的各种参数和命令。

## AUFS的性能
AUFS的性能慢吗？也慢也不慢。因为AUFS会把所有的分支mount起来，所以，在查找文件上是比较慢了。因为它要遍历所有的branch。是个O(n)的算法（很明显，这个算法有很大的改进空间的）所以，branch越多，查找文件的性能也就越慢。但是，一旦AUFS找到了这个文件的inode，那后以后的读写和操作原文件基本上是一样的。

所以，如果你的程序跑在在AUFS下，open和stat操作会有明显的性能下降，branch越多，性能越差，但是在write/read操作上，性能没有什么变化。

IBM的研究中心对Docker的性能给了一份非常不错的性能报告（PDF）《An Updated Performance Comparison of Virtual Machinesand Linux Containers》

我截了两张图出来，第一张是顺序读写，第二张是随机读写。基本没有什么性能损失的问题。而KVM在随机读写的情况也就有点慢了（但是，如果硬盘是SSD的呢？）

![20660-44jefr87f1m.png](images/210893056.png)

![18324-26iv6mrrvw8.png](images/210893056.png)


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2418/  

