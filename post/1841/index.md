# 文件系统损坏导致docker启动失败

<!--more-->
原文链接：http://zhangguanzhang.github.io/2020/01/08/docker-panic-invalid-page-type/


报错信息大致如下：
```
panic: pgid (68719476737) above high water mark (183)

goroutine 1 [running]:
github.com/containerd/containerd/vendor/github.com/boltdb/bolt.(*node).spill(0xc4203fb420, 0xc4202b1198, 0x2)
	/go/src/github.com/containerd/containerd/vendor/github.com/boltdb/bolt/node.go:375 +0x679
github.com/containerd/containerd/vendor/github.com/boltdb/bolt.(*Bucket).spill(0xc4200bc398, 0xb1378c, 0x5597f073a780)
	/go/src/github.com/containerd/containerd/vendor/github.com/boltdb/bolt/bucket.go:570 +0x4ba
github.com/containerd/containerd/vendor/github.com/boltdb/bolt.(*Tx).Commit(0xc4200bc380, 0x0, 0x0)
	/go/src/github.com/containerd/containerd/vendor/github.com/boltdb/bolt/tx.go:163 +0x121
github.com/containerd/containerd/vendor/github.com/boltdb/bolt.(*DB).Update(0xc4201c70e0, 0xc4202b1540, 0x0, 0x0)
	/go/src/github.com/containerd/containerd/vendor/github.com/boltdb/bolt/db.go:605 +0xea
github.com/containerd/containerd/metadata.(*DB).Init(0xc4203fe840, 0x5597f0044b40, 0xc42003e0a0, 0xc4202b1660, 0xc4203fe840)
	/go/src/github.com/containerd/containerd/metadata/db.go:103 +0xb1
github.com/containerd/containerd/server.LoadPlugins.func2(0xc4203fb340, 0xc420221bc0, 0x21, 0xc4204114e0, 0x1e)
	/go/src/github.com/containerd/containerd/server/server.go:255 +0x53f
github.com/containerd/containerd/plugin.(*Registration).Init(0xc420404a50, 0xc4203fb340, 0xc420404a50)
	/go/src/github.com/containerd/containerd/plugin/plugin.go:98 +0x3a
github.com/containerd/containerd/server.New(0x7fd80d330158, 0xc42003e0a0, 0xc4203d8b40, 0x1, 0xc4202b1c80, 0x5597eed907cd)
	/go/src/github.com/containerd/containerd/server/server.go:106 +0x600
github.com/containerd/containerd/cmd/containerd/command.App.func1(0xc4203de2c0, 0xc4203de2c0, 0xc4202b1d07)
	/go/src/github.com/containerd/containerd/cmd/containerd/command/main.go:132 +0x5fb
github.com/containerd/containerd/vendor/github.com/urfave/cli.HandleAction(0x5597efe31760, 0x5597f0021718, 0xc4203de2c0, 0xc4203fe3c0, 0x0)
	/go/src/github.com/containerd/containerd/vendor/github.com/urfave/cli/app.go:502 +0xca
github.com/containerd/containerd/vendor/github.com/urfave/cli.(*App).Run(0xc4201a7180, 0xc42003a090, 0x3, 0x3, 0x0, 0x0)
	/go/src/github.com/containerd/containerd/vendor/github.com/urfave/cli/app.go:268 +0x60e
main.main()
	github.com/containerd/containerd/cmd/containerd/main.go:28 +0x51
ERRO[2020-06-24T13:49:28.209961851+08:00] containerd did not exit successfully          error="exit status 2" module=libcontainerd
```

删除此文件
/data/docker/containerd/daemon/io.containerd.metadata.v1.bolt


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1841/  

