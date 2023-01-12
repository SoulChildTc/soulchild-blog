# nfs挂载问题

<!--more-->
新分区：`/sdb1`

挂载目录：/nfsdata/aaa
`mount /dev/sdb1 /nfsdata/aaa`

创建目录和文件
```
mkdir /nfsdata/aaa/{bbb,ccc}
touch /nfsdata/aaa/{bbb,ccc}/123
```

nfs配置文件/etc/exports
`
/nfsdata      10.1.0.0/24(rw,sync,no_root_squash,no_all_squash)
/nfsdata/aaa  10.1.0.0/24(rw,sync,no_root_squash,no_all_squash)
`



通过nfs挂载
`mount -t nfs 10.1.0.10:/nfsdata/aaa  /nfstest`  # 挂载成功但是/nfstest目录没有内容(挂载到原分区了)

`mount -t nfs 10.1.0.10:/nfsdata/aaa/bbb  /nfstest`  # 挂载成功nfstest目录有内容(挂载到新分区了)

当父级目录已共享时，只有挂载共享目录的子目录的时候才能成功


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2107/  

