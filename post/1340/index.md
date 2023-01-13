# git使用其他分支替换master分支

<!--more-->
-s ours
该参数将强迫冲突发生时，自动使用当前分支的版本。这种合并方式不会产生任何困扰情况，甚至git都不会去检查其他分支版本所包含的冲突内容这种方式会抛弃对方分支任何冲突内容。

# 使用dev分支替换master分支

git checkout dev

git merge -s ours master

git checkout master

git merge dev

git push origin master

&nbsp;

# 恢复上一步的过程

1.git reset --hard 73a828895ad167339752c3fbba2be3564cdbdfa7

2.关闭master分支保护

3.git push origin master --force


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1340/  

