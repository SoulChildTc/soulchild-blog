# Hugo报错pipe Failed


<!--more-->

在mac上启动hugo serve的时候遇到了报错
```bash
Watching for changes in /Users/SoulChild/Documents/xxx/{archetypes,assets,content,data,layouts,static,themes}
Watching for config changes in /Users/SoulChild/Documents/xxx/config.toml, /Users/SoulChild/Documents/xxx/themes/FixIt/config.toml
fatal error: pipe failed

goroutine 1 [running]:
runtime.throw({0x101d846b1?, 0xc004ef2870?})
...
```

解决方法如下
```bash
sudo launchctl limit maxfiles 65535 200000
ulimit -n 65535
sudo sysctl -w kern.maxfiles=100000
sudo sysctl -w kern.maxfilesperproc=65535
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/hugo%E6%8A%A5%E9%94%99pipe-failed/  

