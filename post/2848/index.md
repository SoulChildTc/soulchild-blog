# mysql pt-archive数据归档

<!--more-->

### 数据归档
```bash
#!/bin/bash
# 将table1表到归档库

LAST_TIME=$(date -d -365day "+%s")
echo ${LAST_TIME}

/usr/bin/pt-archiver \
--source h=1.1.1.1,u=root,p=123456,P=3306,D=db1,t=table1 \
--dest h=2.2.2.2,u=root,p=123456,P=3306,D=archive_db1,t=table1 \
--progress 5000 --where 'date < '${LAST_TIME}' ' \
--charset=UTF8 --limit=1000 --txn-size 1000 \
--replace --statistics  --bulk-delete | tee /tmp/archive.log
```


### 数据清理
```bash
#!/bin/bash
# 删除归档库里的table1数据

source /etc/profile

END_TIME=$(date -d "2018-12-31 23:59:59" +%s)

DBUSER="root"
DBPASS="123456"
DBADDR="1.1.1.1"

function purge(){
    echo "删除table1 $(date +'%Y-%m-%d %H:%M:%S' -d @$END_TIME) 之前的数据"
    /usr/bin/pt-archiver \
    --source h=${DBADDR},u=${DBUSER},p=${DBPASS},P=3306,D=archive_db1,t=table1 \
    --no-check-charset \
    --where "adlog_date <= '${END_TIME}' " \
    --limit 1000 --txn-size 1000 --statistics --skip-foreign-key-checks \
    --purge --progress 1000 --statistics | tee /tmp/delete_archive.log
}

purge
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2848/  

