# 使用prometheus监控zeus任务

<!--more-->
大致思路就是每分钟从mysql获取当天任务执行情况,成功和失败的指标都会加1(Counter类型)，使用下面的表判断如果检查过了，就不再给时间序列的样本加1，没检查过的才会加1。 所以我们通过`increase(zeus_job_failed_total{}[1h]) > 0`这个表达式就可以获取到是否有任务失败了

```bash
CREATE TABLE `zeus_exporter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `job_id` int(8) NOT NULL DEFAULT '0',
  `start_time` datetime DEFAULT NULL,
  `check` int(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8
```

vim zeus_exporter.py
```bash
import time
from datetime import date
from prometheus_client import start_http_server, Counter
import pymysql

c_success = Counter("zeus_job_success", 'zeus job success ststus', ["job_id", "job_name"])
c_failed = Counter("zeus_job_failed", 'zeus job failed ststus', ["job_id", "job_name"])
conn = pymysql.Connection(host="127.0.0.1", user="zeus", db="zeus", password="zeus")
conn.select_db("zeus")


def exec_sql(sql):
    cursor = conn.cursor()
    cursor.execute(sql)
    cursor.close()
    return cursor.fetchall()


def init_counter():
    """这里主要是防止counter重置导致告警误报，所以对计数进行了持久化"""
    sql = """select count(res.job_id),res.*, zeus_exporter.check from zeus_exporter 
    join (select zeus_job_history.job_id,zeus_job.name,zeus_job_history.status,zeus_job_history.start_time from zeus_job 
    join zeus_job_history on zeus_job.id = zeus_job_history.job_id )res on zeus_exporter.job_id = res.job_id and date(zeus_exporter.start_time)=date(res.start_time) where zeus_exporter.check=1 group by job_id,status;
    """
    for row in exec_sql(sql):
        if row[3] == "success":
            c_success.labels(row[1], row[2]).inc(row[0])
        elif row[3] == "failed":
            c_failed.labels(row[1], row[2]).inc(row[0])


def get_history_job():
    sql_history = """select res.*, zeus_exporter.check from zeus_exporter right join (
    select zeus_job_history.job_id,zeus_job.name,zeus_job_history.status,zeus_job_history.start_time from zeus_job      
    right join zeus_job_history on zeus_job.id = zeus_job_history.job_id where date(zeus_job_history.start_time)='%s')res 
    on zeus_exporter.job_id = res.job_id and date(zeus_exporter.start_time)=date(res.start_time);
    """ % date.today()
    return exec_sql(sql_history)


def set_metrics():
    for row in get_history_job():
        if row[4] is None:
            sql_i = 'insert into zeus_exporter(`job_id`,`start_time`,`check`) values(%s,"%s",%s)' % (row[0], row[3], 1)
            exec_sql(sql_i)

        if row[2] == "success" and row[4] != 1:
            c_success.labels(row[0], row[1]).inc(1)
        elif row[2] == "failed" and row[4] != 1:
            c_failed.labels(row[0], row[1]).inc(1)


if __name__ == '__main__':
    start_http_server(8000)
    init_counter()
    while True:
        set_metrics()
        time.sleep(60)

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2876/  

