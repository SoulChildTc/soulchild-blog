# 为什么有时候读取文件，atime不更新

<!--more-->
原文链接: https://blog.csdn.net/ayu_ag/article/details/51123198
在linux中，使用stat foo.txt 命令可以看到文件foo.txt的三个时间：

atime：access time，访问时间

mtime：modify time，修改时间，文件内容有修改

ctime：change time，create time，改变时间，文件的索引节点发生变化，具体的情况有：1、文件内容有修改；2、文件权限有修改；3、inode变了；4、重命名(重命名不会导致inode改变)

PS：

1、如果用vi去修改某个文件，可能会发现这三个时间都被更新了，因为vi使用了临时文件保存修改，在wq时替换了原来的文件，导致文件的inode被改变了，可以用ls -li验证一下

2、如果想修改mtime，可以echo "hello world" >> foo.txt，注意ctime也会跟着改变

3、如果想仅仅修改ctime，可以chmod 644 foo.txt，mtime不会改变

4、为什么没说atime呢，不是想象中的那么简单的，后面详细分析


对于一个文件foo.txt

ls -l foo.txt 显示的是mtime

ls -l -c foo.txt 显示的是ctime

ls -l -u foo.txt 显示的是atime


对于atime，当你以为cat foo.txt然后stat foo.txt能看到atime改变的话，很可能就会失望了，并不是每次atime都更新的

atime和mount的参数以及内核有关：

```
       atime  Do  not  use noatime feature, then the inode access time is controlled
              by kernel defaults. See  also  the  description  for  strictatime  and
              relatime mount options.
 
       noatime
              Do  not update inode access times on this filesystem (e.g., for faster
              access on the news spool to speed up news servers).
```

```
       relatime
              Update inode access times relative to modify or change  time.   Access
              time  is only updated if the previous access time was earlier than the
              current modify or change time. (Similar to noatime, but doesn't  break
              mutt  or  other applications that need to know if a file has been read
              since the last time it was modified.)
 
              Since Linux 2.6.30, the kernel defaults to the  behavior  provided  by
              this  option  (unless  noatime  was   specified),  and the strictatime
              option is required to obtain traditional semantics. In addition, since
              Linux  2.6.30,  the file's last access time is always  updated  if  it
              is more than 1 day old.
 
       norelatime
              Do not use relatime feature. See also the strictatime mount option.
 
       strictatime
              Allows to explicitly requesting full atime updates. This makes it pos‐
              sible  for  kernel  to defaults to relatime or noatime but still allow
              userspace to override it. <span style="color:#ff0000;">For more details about  the  default  system
              mount options see /proc/mounts</span>.
 
       nostrictatime
              Use the kernel's default behaviour for inode access time updates.
```
如果使用noatime，那么atime就不会被更新，即使修改了文件内容
如果使用atime，采用内核默认行为，kernel2.6.30后就相当于使用了relatime

如果使用relatime，表示当atime比ctime或mtime更早，然后你又去读取了文件，atime才会被更新为当前时间，kernel2.6.30后的默认行为；或者atime比现在早一天，那么atime在文件读取时会被更新

如果使用strictatime，atime在文件每次被读取时，都能够被更新

cat /proc/mounts可以看到我的服务器使用的是relatime参数：
`/dev/sdl1 /home ext4 rw,relatime,user_xattr,barrier=1,data=ordered 0 0`

实验环节：
noatime，可以看到不管是修改文件还是读取文件，atime都不会变化，性能最好
```bash
$ sudo mount -t tmpfs -o noatime tmpfs /mnt
$ cd /mnt
/mnt$ echo "hello world" >> foo.c
/mnt$ stat foo.c
  File: `foo.c'
  Size: 12              Blocks: 8          IO Block: 4096   regular file
Device: 18h/24d Inode: 60855528    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:46:19.734162324 +0800 #最初值</span>
Modify: 2016-04-11 17:46:19.734162324 +0800
Change: 2016-04-11 17:46:19.734162324 +0800
 Birth: -
/mnt$ echo "hello world" >> foo.c
/mnt$ stat foo.c
  File: `foo.c'
  Size: 24              Blocks: 8          IO Block: 4096   regular file
Device: 18h/24d Inode: 60855528    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:46:19.734162324 +0800 #写文件后，atime不变</span>
Modify: 2016-04-11 17:46:38.142096924 +0800
Change: 2016-04-11 17:46:38.142096924 +0800
 Birth: -
/mnt$ cat foo.c
hello world
hello world
/mnt$ stat foo.c
  File: `foo.c'
  Size: 24              Blocks: 8          IO Block: 4096   regular file
Device: 18h/24d Inode: 60855528    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:46:19.734162324 +0800 #读文件后，atime不变</span>
Modify: 2016-04-11 17:46:38.142096924 +0800
Change: 2016-04-11 17:46:38.142096924 +0800
 Birth: -
/mnt$ cd
$ sudo umount /mnt
```

relatime，当atime早于或等于mtime/ctime时，才会被更新，2.6.30后的内核的默认行为，性能和atime折中的选择
```bash
$ sudo mount -t tmpfs -o relatime tmpfs /mnt
$ cd /mnt
/mnt$ echo "hello world" >> foo.c
/mnt$ stat foo.c
  File: `foo.c'
  Size: 12              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60855680    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:51:44.772736377 +0800 #最初值</span>
Modify: 2016-04-11 17:51:44.772736377 +0800
Change: 2016-04-11 17:51:44.772736377 +0800
 Birth: -
/mnt$ cat foo.c > /dev/null
/mnt$ stat foo.c
  File: `foo.c'
  Size: 12              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60855680    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:51:56.036682655 +0800 #atime早于等于mtime/ctime，更新</span>
Modify: 2016-04-11 17:51:44.772736377 +0800
Change: 2016-04-11 17:51:44.772736377 +0800
 Birth: -
/mnt$ cat foo.c > /dev/null
/mnt$ stat foo.c
  File: `foo.c'
  Size: 12              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60855680    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:51:56.036682655 +0800 #atime更晚时，不更新</span>
Modify: 2016-04-11 17:51:44.772736377 +0800
Change: 2016-04-11 17:51:44.772736377 +0800
 Birth: -
/mnt$ echo "hello world" >> foo.c
/mnt$ stat foo.c
  File: `foo.c'
  Size: 24              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60855680    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:51:56.036682655 +0800 #改变文件后，atime不更新</span>
Modify: 2016-04-11 17:52:30.636519093 +0800
Change: 2016-04-11 17:52:30.636519093 +0800
 Birth: -
/mnt$ cat foo.c > /dev/null
/mnt$ stat foo.c
  File: `foo.c'
  Size: 24              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60855680    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 17:52:43.708457830 +0800 #读取文件后，如果atime早于等于mtime/ctime，更新</span>
Modify: 2016-04-11 17:52:30.636519093 +0800
Change: 2016-04-11 17:52:30.636519093 +0800
 Birth: -
/mnt$ cd
$ sudo umount /mnt
```

relatime，atime比现在早一天，那么atime在文件读取时会被更新，随便找个老文件看看：
```bash
$ stat elfdiff.sh
  File: `elfdiff.sh'
  Size: 2067      	Blocks: 8          IO Block: 4096   regular file
Device: 8b1h/2225d	Inode: 103158619   Links: 1
Access: (0755/-rwxr-xr-x)  Uid: (xxxxxx)   Gid: (  100/   users)
Access: 2016-04-08 17:31:36.764025160 +0800
Modify: 2016-04-08 17:31:33.536040622 +0800
Change: 2016-04-08 17:31:33.580040411 +0800
 Birth: -
$ cat elfdiff.sh >/dev/null
$ stat elfdiff.sh
  File: `elfdiff.sh'
  Size: 2067      	Blocks: 8          IO Block: 4096   regular file
Device: 8b1h/2225d	Inode: 103158619   Links: 1
Access: (0755/-rwxr-xr-x)  Uid: (xxxxxx)   Gid: (  100/   users)
Access: 2016-04-11 22:12:31.984860509 +0800
Modify: 2016-04-08 17:31:33.536040622 +0800
Change: 2016-04-08 17:31:33.580040411 +0800
 Birth: -
```

strictatime，我们以为的那种atime，每次读取都会更新，但是影响性能
```bash
$ sudo mount -t tmpfs -o strictatime tmpfs /mnt
$ cd /mnt
/mnt$ echo "hello world" >> foo.c
/mnt$ stat foo.c
  File: `foo.c'
  Size: 12              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60853117    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 18:03:28.033857401 +0800 #最初值</span>
Modify: 2016-04-11 18:03:28.033857401 +0800
Change: 2016-04-11 18:03:28.033857401 +0800
 Birth: -
/mnt$ cat foo.c >> /dev/null
/mnt$ stat foo.c
  File: `foo.c'
  Size: 12              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60853117    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 18:03:35.229824129 +0800 #只要被读取，atime就更新</span>
Modify: 2016-04-11 18:03:28.033857401 +0800
Change: 2016-04-11 18:03:28.033857401 +0800
 Birth: -
/mnt$ cat foo.c >> /dev/null
/mnt$ stat foo.c
  File: `foo.c'
  Size: 12              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60853117    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 18:03:38.925807067 +0800 #只要被读取，atime就更新</span>
Modify: 2016-04-11 18:03:28.033857401 +0800
Change: 2016-04-11 18:03:28.033857401 +0800
 Birth: -
/mnt$ echo "hello world" >> foo.c
/mnt$ stat foo.c
  File: `foo.c'
  Size: 24              Blocks: 8          IO Block: 4096   regular file
Device: 19h/25d Inode: 60853117    Links: 1
Access: (0644/-rw-r--r--)  Uid: (xxxxxx)   Gid: (  100/   users)
<span style="color:#ff0000;">Access: 2016-04-11 18:03:38.925807067 +0800 #改变文件，atime不更新</span>
Modify: 2016-04-11 18:03:44.961779241 +0800
Change: 2016-04-11 18:03:44.961779241 +0800
 Birth: -
/mnt$ cd
$ sudo umount /mnt
```


注意：当文件夹中的某个文件的时间改变时，文件夹本身的时间并不会受到影响

参考：
http://unix.stackexchange.com/questions/88840/atime-value-changing-only-once-after-file-creation





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2184/  

