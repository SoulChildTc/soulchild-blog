# psql基本命令和常用sql

<!--more-->
1.连接数据库
`psql -Upostgres -h localhost -p 5432 -d postgres`

2.命令行执行sql
- `psql -c '\l'`
- `psql -c 'select current_time'`
- `psql -f my.sql`

3.psql命令
- `\du`：查看用户列表
- `\x`: 开启扩展显示，再次输入关闭。类似mysql\\G
- `\g`：将执行结果发送到文件或管道
  - `select current_time;\g a.txt`
- `gset`：将执行结果发送到psql变量
  - `select current_time;\gset my_time`
- `\watch`：每秒执行查询
  - `\watch select current_time;`
- `\timing`：显示sql执行时间
  -  `\timing off` or `\timing on`
- `\set`：设置变量
  - `\set AUTOCOMMIT off`： 关闭自动提交事物
  - `\set a 1`可以使用`:a`来调用
- `\dt+`：列出所有表，也可以指定规则来查询
  - `\dt+ pg_*`：列出pg_开头的表
- `\d+`：查看所有表的字段信息
  - `\d+ test`：查看test表的字段信息
- `\l`：查看所有数据库
- `\c`：切换数据库
- `\di`：查看索引
- `\ds`：查看序列
- `\dns`：查看schema
- `\copy`：将表的数据写到文件，或者从文件读取数据写到表中
  - `\copy test to ./test.txt`：将test表所有数据写到文件中
  - `\copy (select id from test)  to ./test_id.txt`：将query语句查询的内容写到文件

4.常用sql
创建数据库：
`create database test;`
创建schema：
`create schema test_schema;`
创建表：
`create table test_schema.test1(id int,name varchar(64), unique(id));`
设置默认查询路径：
`set search_path to test_schema;`
创建序列：
`create sequence test_seq;`
创建用户：
`create user <username> with <权限 CREATEDB LOGIN> password '<password>';`
修改用户密码：
`alter user <username> with password '<password>';`
删除用户：
`drop user <username>;`
查询用户：
`select * from pg_user;`
`select * from pg_authid;`
`select * from pg_roles;`












---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1853/  

