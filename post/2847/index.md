# mysql常用统计sql

<!--more-->
原创:我的二狗呢 
https://blog.51cto.com/lee90

### 表体积
```sql
SELECT
curdate() AS INSERT_DATE ,
CONCAT(table_schema, '.', table_name) AS TB_NAME,
table_rows AS ROWS,
ROUND(data_length /1024/1024/1024,2) AS DATA_GB,
ROUND(index_length /1024/1024/1024,2)AS idx_GB,
ROUND((data_length + index_length)/1024/1024/1024 , 2) AS total_size_GB,
index_length / data_length AS idxfrac,
ROUND((data_length+index_length)/@total_size/1024,2) as pct
FROM information_schema.TABLES where table_schema NOT IN ('mysql','test','information_schema','heartbeat','performance_schema')
ORDER BY ( data_length + index_length ) DESC LIMIT 10 ;
```

### 表自增主键使用情况
```bash
select 
curdate() AS INSERT_DATE ,
table_schema,
table_name,
column_name,
AUTO_INCREMENT,
POW(2, CASE data_type
WHEN 'tinyint' THEN 7
WHEN 'smallint' THEN 15
WHEN 'mediumint' THEN 23
WHEN 'int' THEN 31
WHEN 'bigint' THEN 63
END+(column_type LIKE '% unsigned'))-1 AS max_int
FROM information_schema.tables t
JOIN information_schema.columns c USING (table_schema,table_name)
WHERE
c.extra = 'auto_increment'
AND
t.TABLE_SCHEMA NOT IN ('information_schema','mysql', 'sys','test','performance_schema')
AND
t.auto_increment IS NOT NULL ; "
```

### 表碎片率top 10
```sql
select 
curdate() AS INSERT_DATE ,
ENGINE,
CONCAT(TABLE_SCHEMA, '.', TABLE_NAME) AS TB_NAME,
ROUND(DATA_LENGTH / 1024 / 1024) AS data_length_MB,
ROUND(INDEX_LENGTH / 1024 / 1024) AS index_length_MB,
ROUND(DATA_FREE / 1024 / 1024) AS data_free_MB,
DATA_FREE / (DATA_LENGTH + INDEX_LENGTH) AS ratio_of_fragmentation
FROM information_schema.tables
WHERE DATA_FREE > 0 AND TABLE_SCHEMA NOT IN ('mysql','test','performance_schema','information_schema','sys')
ORDER BY ratio_of_fragmentation DESC
LIMIT 10 ;
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2847/  

