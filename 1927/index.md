# find根据时间属性查找文件

<!--more-->
-newerXY参数：X和Y均为变量。其中X指find的目标文件属性，Y代表参照属性。

a：访问时间
m：文件修改时间
c：inode更改时间
t：自定义时间(格式:yyyy-MM-dd hh:mm:ss)

查找到的文件中，mtime的时间大于2020-08-21的文件。
即：2020-08-21之后的文件
```bash
find ./ -type f -newermt '2020-08-21'
```

查找到的文件中，mtime的时间小于2020-08-21的文件。
即：2020-08-21之前的文件
```bash
find ./ -type f ! -newermt '2020-08-21'
```

查找到的文件中，mtime的时间大于2020-08-17的文件，小于2020-08-21的文件。
即：2020-08-17到2020-08-21之间的文件
```bash
find ./ -type f -newermt '2020-08-17' ! -newermt '2020-08-21'
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1927/  

