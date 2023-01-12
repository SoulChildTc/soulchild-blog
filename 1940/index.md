# postgres_exporter部署

<!--more-->
####  1.下载安装：
```bash
wget https://github.91chifun.workers.dev//https://github.com/wrouesnel/postgres_exporter/blob/v0.8.0/queries.yaml
wget https://github.91chifun.workers.dev//https://github.com/wrouesnel/postgres_exporter/releases/download/v0.8.0/postgres_exporter_v0.8.0_linux-amd64.tar.gz
tar xf postgres_exporter_v0.8.0_linux-amd64.tar.gz
mv postgres_exporter_v0.8.0_linux-amd64/postgres_exporter /usr/local/bin/
mkdir /etc/postgres_exporter/
mv queries.yaml /etc/postgres_exporter/
chown -R postgres.postgres /etc/postgres_exporter/
```
> queries.yaml文件为自定义指标文件，有需要的话可以自定义。


#### 2.创建数据库监控用户、函数、视图：
```sql
-- To use IF statements, hence to be able to check if the user exists before
-- attempting creation, we need to switch to procedural SQL (PL/pgSQL)
-- instead of standard SQL.
-- More: https://www.postgresql.org/docs/9.3/plpgsql-overview.html
-- To preserve compatibility with <9.0, DO blocks are not used; instead,
-- a function is created and dropped.
CREATE OR REPLACE FUNCTION __tmp_create_user() returns void as $$
BEGIN
  IF NOT EXISTS (
          SELECT                       -- SELECT list can stay empty for this
          FROM   pg_catalog.pg_user
          WHERE  usename = 'postgres_exporter') THEN
    CREATE USER postgres_exporter;
  END IF;
END;
$$ language plpgsql;

SELECT __tmp_create_user();
DROP FUNCTION __tmp_create_user();

ALTER USER postgres_exporter WITH PASSWORD '123456';
ALTER USER postgres_exporter SET SEARCH_PATH TO postgres_exporter,pg_catalog;

-- If deploying as non-superuser (for example in AWS RDS), uncomment the GRANT
-- line below and replace <MASTER_USER> with your root user.
-- GRANT postgres_exporter TO <MASTER_USER>;
CREATE SCHEMA IF NOT EXISTS postgres_exporter;
GRANT USAGE ON SCHEMA postgres_exporter TO postgres_exporter;
GRANT CONNECT ON DATABASE postgres TO postgres_exporter;

CREATE OR REPLACE FUNCTION get_pg_stat_activity() RETURNS SETOF pg_stat_activity AS
$$ SELECT * FROM pg_catalog.pg_stat_activity; $$
LANGUAGE sql
VOLATILE
SECURITY DEFINER;

CREATE OR REPLACE VIEW postgres_exporter.pg_stat_activity
AS
  SELECT * from get_pg_stat_activity();

GRANT SELECT ON postgres_exporter.pg_stat_activity TO postgres_exporter;

CREATE OR REPLACE FUNCTION get_pg_stat_replication() RETURNS SETOF pg_stat_replication AS
$$ SELECT * FROM pg_catalog.pg_stat_replication; $$
LANGUAGE sql
VOLATILE
SECURITY DEFINER;

CREATE OR REPLACE VIEW postgres_exporter.pg_stat_replication
AS
  SELECT * FROM get_pg_stat_replication();

GRANT SELECT ON postgres_exporter.pg_stat_replication TO postgres_exporter;

```


####  3.创建启动服务
vim /usr/lib/systemd/system/postgres_exporter.service
```bash
[Unit]
Description=postgres_exporter
Documentation=https://github.com/wrouesnel/postgres_exporter
After=network.target

[Service]
Type=simple
User=postgres
Environment="DATA_SOURCE_NAME=postgresql://postgres_exporter:123456@localhost:5432/postgres?sslmode=disable"
ExecStart=/usr/local/bin/postgres_exporter --log.level=error
#  --extend.query-path=quires.yaml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

#### 4.启动服务
```bash
systemctl start mysqld_exporter
systemctl enable mysqld_exporter
```

#### 5.配置prometheus
```bash
    scrape_configs:
      - job_name: postgres_exporter
        static_configs:
        - targets: ['10.0.0.72:9187']
          labels:
            instance: 'test-db'
```






---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1940/  

