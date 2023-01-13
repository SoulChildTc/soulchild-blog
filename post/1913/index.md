# git clone 时使用了 --depth 后，如何再重新拉取全部的历史

<!--more-->
原文链接：https://mozillazg.com/2016/01/git-revert-depth-1.html

有时我们为了加快 clone 的速度会使用 --depth 参数，比如：

`git clone https://xxx/xxx.git --depth 1`
如果我们之后要把之前的历史重新再 pull 下来呢？ 比如要把本地的仓库 push 到一个新的空仓库（ 会出现 error: failed to push some refs 错误 ）。

可以使用 --unshallow 参数：

`git pull --unshallow`


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1913/  

