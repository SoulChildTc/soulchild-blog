# pgsql备份恢复

<!--more-->
## 备份

### pg_dump：
- 通用选项：
```
  -f, --file=FILENAME          输出的文件路径
  -F, --format=c|d|t|p         输出的格式(custom, directory, tar,
                               plain text(默认))
  -j, --jobs=NUM               使用指定任务数量来并行备份
  -v, --verbose                显示备份详细信息
  -V, --version                查看版本信息
  -Z, --compress=0-9           压缩级别
  --lock-wait-timeout=TIMEOUT  等待表级锁超时时间
```

- 连接选项：
```
  -d, --dbname=DBNAME          备份的数据库名称
  -h, --host=HOSTNAME          数据库地址或socket路径
  -p, --port=PORT              数据库端口
  -U, --username=NAME          连接数据库的用户名
  -w, --no-password            禁止提示输入密码
  -W, --password               强制提示密码输入
  --role=ROLENAME              备份前设置角色
```

- 备份参数：
```
  -a, --data-only              只备份数据，不备份schema
  -C, --create                 备份中包含创建数据库的命令
  -E, --encoding=ENCODING      以指定的编码方式备份数据
  -n, --schema=SCHEMA          只备份指定的schema(s)
  -N, --exclude-schema=SCHEMA  不备份指定schema(s)
  -O, --no-owner               当格式为plain时，忽略恢复对象所有者
  -s, --schema-only            只备份schema，不备份数据
  -t, --table=TABLE            只备份指定的表
  -T, --exclude-table=TABLE    不备份指定的表
  -x, --no-privileges          不备份权限(grant/revoke)
  --column-inserts             使用insert的方式备份，insert语句中包含字段名称
  --disable-triggers           在仅还原数据时禁用触发器
  --exclude-table-data=TABLE   不备份指定表的数据
  --if-exists                  use IF EXISTS when dropping objects
  --inserts                    使用insert的方式备份，insert语句中不包含字段名称
  --no-tablespaces             不备份表空间分配信息
```

- 简单备份
```
pg_dump -Upostgres -h 10.0.0.2 -d test -f test.sql
```

## psql普通文本格式恢复
- 通用参数：
```
  -d, --dbname=DBNAME      指定数据库
  -f, --file=FILENAME      指定要执行的sql文件
  -X, --no-psqlrc          不读取启动文件(~/.psqlrc)
```

- 恢复
```
psql -Upostgres -h 10.0.0.2 -d test -f test.sql
```

## pg_restore恢复
- 通用参数：
```
  -d, --dbname=NAME        数据库
  -F, --format=c|d|t       备份文件的格式(custom, directory, tar)，可以自动识别
  -v, --verbose            显示详细信息
```

- 恢复参数：
```
  -a, --data-only              只还原数据, 不还原schema
  -c, --clean                  在重新创建之前删除数据库对象
  -C, --create                 创建目标数据库
  -e, --exit-on-error          出错时退出, 默认继续
  -I, --index=NAME             还原索引名
  -j, --jobs=NUM               使用指定任务数量来并行恢复
  -n, --schema=NAME            只恢复指定的schema
  -O, --no-owner               跳过对象所有权的恢复
  -P, --function=NAME(args)    恢复指定名字的函数
  -s, --schema-only            只恢复schema，不恢复数据
  -S, --superuser=NAME         用于禁用触发器的超级用户用户名
  -t, --table=NAME             恢复指定表名
  -T, --trigger=NAME           恢复指定触发器
  -x, --no-privileges          跳过访问权限的恢复(grant/revoke)
  -1, --single-transaction     作为1个事务恢复
  --disable-triggers           在只恢复数据期间禁用触发器
  --if-exists                  删除对象时使用IF EXISTS
  --no-tablespaces             不恢复表空间分配信息
```

- 连接参数，同pg_dump

>注意:pg_restore xxx.tar代表读取压缩备份的内容

备份恢复例子：
```
#备份test库
pg_dump -d test -F t -f test.tar

#恢复test库
pg_restore -d test test.tar
```

恢复指定表：
```
# 造数据
create database test;
\c test
create table t1(id int, context varchar(32));
insert into t1(id,context) values(1,'你好');
insert into t1 values(2,'soulchild');
create table t2(id int, comment varchar(128));
insert into t2 values(1,'test1')
insert into t2 values(2,'test2')

#备份
pg_dump -F t -d test -f test.tar

#删除表
drop table t1;

#恢复t1表
pg_restore -d test -t t1 ./test.tar
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1151/  

