# mysql查询语句

<!--more-->
```sql
-- 学生表
create table `student` (
`id` int unsigned PRIMARY KEY auto_increment,
`name` char(32) not null unique,
`sex`  enum('男','女') not null,
`city` char(32) not null,
`description` text,
`birthday` date not null default '1995-1-1',
`money` float(7,2) default 0,
`only_child` boolean
)charset=utf8mb4;

-- 学生数据
insert into `student` 
(`name`,`sex`,`city`,`description`,`birthday`,`money`,`only_child`)
VALUES 
('郭德纲', '男','北京','班长','1997/10/1',rand()*100,True),
('陈乔恩', '女', '上海', NULL, '1995/3/2', rand() * 100,True),
('赵丽颖', '女', '北京', '班花, 不骄傲', '1995/4/4', rand()* 100, False),
('王宝强', '男', '重庆', '超爱吃火锅', '1998/10/5', rand() *100, False),
('赵雅芝', '女', '重庆', '全宇宙三好学生', '1996/7/9',rand() * 100, True),
('张学友', '男', '上海', '奥林匹克总冠军！', '1993/5/2',rand() * 100, False),
('陈意涵', '女', '上海', NULL, '1994/8/30', rand() * 100,True),
('赵本山', '男', '南京', '副班长', '1995/6/1', rand() *100, True),
('张柏芝', '女', '上海', NULL, '1997/2/28', rand() * 100,False),
('吴亦凡', '男', '南京', '大碗宽面要不要？', '1995/6/1', rand() * 100, True),
('鹿晗', '男', '北京', NULL, '1993/5/28', rand() * 100,True),
('关晓彤', '女', '北京', NULL, '1995/7/12', rand() * 100,True),
('周杰伦', '男', '台北', '小伙人才啊', '1998/3/28', rand() *100, False),
('马云', '男', '南京', '一个字：贼有钱', '1990/4/1', rand()* 100, False),
('马化腾', '男', '上海', '马云死对头', '1990/11/28', rand()* 100, False);


成绩表
create table score (
   `id` int unsigned primary key auto_increment,
   `math` float not null default 0,
   `english` float not null default 0
)charset=utf8mb4;

insert into score (`math`, `english`)
values
(49, 71), (62, 66.7), (44, 86), (77.5, 74), (41, 75),
(82, 59.5), (64.5, 85), (62, 98), (44, 36), (67, 56),
(81, 90), (78, 70), (83, 66), (40, 90), (90, 90);

```
## 一、基本查询
### 聚合函数：将一列数据做为一个整体,进行纵向计算
1. count: 计算个数，一般选择非空字段,主键
2. max: 最大追
3. min: 最小值
4. sum: 求和
5. avg: 平均值
6. group_concat: 把字段的所有值连接成一个字符串,可以指定分割符。默认逗号
> 聚合函数不会计算null
> 比如select count(description) from student;的结果是不包含null的
> 解决方法: select count(ifnull(description,'0')) from student; 如果是null则设置一个值

### group by: 分组查询
```sql
-- 查询每个城市的所有人员姓名,人数,总金额,平均金额
-- 按照城市分组
select city as '城市',group_concat(money) as '金额',group_concat(name) as '姓名', count(name) as '人数',sum(money) as '总金额',avg(money) as '平均金额' from student group by city;
```

### order by: 排序
```sql
-- 升序
select * from student order by money;

-- 降序
select * from student order by money desc;
```

### limit: 查看前几个，offset: 偏移量
```sql
-- 查找最有钱的5个人
select * from student order by money desc limit 5 ;

-- 可用于分页查询
-- 第3行开始，往后查7行，不包括第3行
select * from student limit 3,7;

-- 可用于分页查询
-- offset=3,就是从第3个开始查，查找5行。不包括第3行
select * from student limit 5 offset 3;
```

### distinct: 去重
```sql
-- 根据city字段去重
select distinct city from student;
```

## 二、多表查询
图解: https://www.cnblogs.com/logon/p/3748020.html
https://blog.51cto.com/u_13002900/5278688
```sql
-- 添加测试数据
insert into student values(18,"小红","女","北京","小学生","1998-05-02",88,0);
insert into student values(19,"小蓝","男","河北","小学学渣","1998-02-07",86,0);
insert into student values(22,"小贼","男","东土","hys","1996-03-02",11,0);
insert into score values(17,82,42);
insert into score values(26,45,34);
```

### 1. union: 联合查询
```sql
-- 两张表字段数量要一样。两张表上下拼接
select student.id,student.name from student union select score.id,score.math from score;
```

### 2. inner join: 内连接(交集-两张表都有的内容)也可简写join

```sql
-- 将student.id、score.id相等的记录左右合并为一条
select student.*,score.* from student inner join score on student.id=score.id ;
```

### 3. left join: 左连接
```sql
-- 将student.id、score.id相等的记录左右合并为一条，不相等的记录以左表为准显示,右边字段为null
select student.*,score.* from student left join score on student.id=score.id;
```

### 3. right join: 左连接
```sql
-- 将student.id、score.id相等的记录左右合并为一条，不相等的记录以右表为准显示,左边字段为null
select student.*,score.* from student left join score on student.id=score.id;
```

小练习
```sql
-- 查出男生女生的数学英语平均分
select student.sex,round(avg(score.math),1),round(avg(score.english),1) from student inner join score on student.id=score.id group by sex;
```


## 子查询










---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1996/  

