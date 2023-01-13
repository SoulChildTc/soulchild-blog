# mysql事务

<!--more-->
```sql
1. 事务的基本介绍
	1. 概念：
		*  如果一个包含多个步骤的业务操作，被事务管理，那么这些操作要么同时成功，要么同时失败。
		
	2. 操作：
		1. 开启事务： start transaction;
		2. 回滚：rollback;
		3. 提交：commit;
	3. 例子：
		CREATE TABLE account (
			id INT PRIMARY KEY AUTO_INCREMENT,
			NAME VARCHAR(10),
			balance DOUBLE
		);
		-- 添加数据
		INSERT INTO account (NAME, balance) VALUES ('zhangsan', 1000), ('lisi', 1000);
		
		
		SELECT * FROM account;
		UPDATE account SET balance = 1000;
		-- 张三给李四转账 500 元
		
		-- 0. 开启事务
		START TRANSACTION;
		-- 1. 张三账户 -500
		
		UPDATE account SET balance = balance - 500 WHERE NAME = 'zhangsan';
		-- 2. 李四账户 +500
		-- 出错了...
		UPDATE account SET balance = balance + 500 WHERE NAME = 'lisi';
		
		-- 发现执行没有问题，提交事务
		COMMIT;
		
		-- 发现出问题了，回滚事务
		ROLLBACK;
	4. MySQL数据库中事务默认自动提交
		
		* 事务提交的两种方式：
			* 自动提交：
				* mysql就是自动提交的
				* 一条DML(增删改)语句会自动提交一次事务。
			* 手动提交：
				* Oracle 数据库默认是手动提交事务
				* 需要先开启事务，再提交
		* 修改事务的默认提交方式：
			* 查看事务的默认提交方式：SELECT @@autocommit; -- 1 代表自动提交  0 代表手动提交
			* 修改默认提交方式： set @@autocommit = 0;


2. 事务的四大特征：
	1. 原子性：是不可分割的最小操作单位，要么同时成功，要么同时失败。
	2. 持久性：当事务提交或回滚后,即事务结束后,数据会持久化保存。
	3. 隔离性：多个事务之间。相互独立。
	4. 一致性：事务操作前后，数据总量不变
3. 事务的隔离级别（了解）
	* 概念：多个事务之间隔离的，相互独立的。但是如果多个事务操作同一批数据，则会引发一些问题，设置不同的隔离级别就可以解决这些问题。
	* 存在问题：
		1. 脏读：一个事务，读取到另一个事务中没有提交的数据
		2. 不可重复读：在同一个事务中，两次读取到的数据不一样。可能被另一个事务更改，提交、回滚
		3. 幻读：一个事务,操作(DML)数据表中所有记录，另一个事务添加了一条数据，则第一个事务查询不到自己的修改。
	* 隔离级别：
		1. read uncommitted：可以读取未提交的数据
			* 产生的问题：脏读、不可重复读、幻读
		2. read committed：可以读取已提交的数据（Oracle默认）
			* 产生的问题：不可重复读、幻读
		3. repeatable read：可重复读 （MySQL默认）
			* 产生的问题：幻读
		4. serializable：串行化
			* 可以解决所有的问题

		* 注意：隔离级别从小到大安全性越来越高，但是效率越来越低
		* 数据库查询隔离级别：
			* select @@tx_isolation;
		* 数据库设置隔离级别：
			* set global transaction isolation level  级别字符串;
```
### 演示不同级别产生的问题：
在设置完事务级别后,在两个窗口都需要执行`start transaction;`
read uncommitted：
```sql
set global transaction isolation level read uncommitted;
start transaction;
-- 转账操作
update account set balance = balance - 500 where id = 1;
update account set balance = balance + 500 where id = 2;

-- 此时事务并没有提交，但是打开另一个窗口查询,可以查询到未提交的修改。即脏读

-- 当这个事务执行rollback后,另一个再次窗口查询，查询的结果又变成最原始的数据。同一个事务中，两次查询结果不一样。即不可重复读
```


read committed：
```sql
set global transaction isolation level read committed;
start transaction;
-- 转账操作
update account set balance = balance - 500 where id = 1;
update account set balance = balance + 500 where id = 2;

-- 当这个事务执行commit前，另一个窗口查询,查询不到修改的数据。解决脏读

-- 执行commit后，另一个窗口再次查询，查询到修改后的结果。同一个事务中，两次查询结果不一样。即不可重复读
```

repeatable read：
```sql
set global transaction isolation level repeatable read;
start transaction;
-- 转账操作
update account set balance = balance - 500 where id = 1;
update account set balance = balance + 500 where id = 2;

-- 当这个事务执行commit前，另一个窗口查询,查询不到修改的数据。解决脏读

-- 当这个事务执行commit后，另一个窗口查询,查询不到修改的数据。解决不可重复读
```

serializable：
```sql
set global transaction isolation level serializable;
start transaction;
-- 转账操作
update account set balance = balance - 500 where id = 1;
update account set balance = balance + 500 where id = 2;

-- 当第一个事务没有结束时，另一个"事务"的操作会被阻塞，直到第一个事务结束
```

> 注意上面的测试中第二个窗口在查询之前先开启事务






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1997/  

