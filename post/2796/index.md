# redash安装升级

<!--more-->
### 安装
安装docker-compose
```bash
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
```


配置env
secret可以用`pwgen -1s 32`生成

```bash
PYTHONUNBUFFERED=0
REDASH_LOG_LEVEL=INFO
REDASH_REDIS_URL=redis://redis:6379/0
POSTGRES_PASSWORD=123
REDASH_COOKIE_SECRET=456
REDASH_SECRET_KEY=789
REDASH_DATABASE_URL=postgresql://postgres:123@postgres/postgres
REDASH_MAIL_SERVER="1.1.1.1"
REDASH_MAIL_PORT=25
REDASH_MAIL_USE_TLS="false"
REDASH_MAIL_USE_SSL="false"
REDASH_MAIL_DEFAULT_SENDER="redash@soulchild.cn"
```

准备yaml
```yaml
version: "2"
x-redash-service: &redash-service
  image: redash/redash:10.0.0.b50363
  depends_on:
    - postgres
    - redis
  env_file: /opt/redash/env
  restart: always
services:
  server:
    <<: *redash-service
    command: server
    ports:
      - "5000:5000"
    environment:
      REDASH_WEB_WORKERS: 4
  scheduler:
    <<: *redash-service
    command: scheduler
    environment:
      QUEUES: "celery"
      WORKERS_COUNT: 1
  scheduled_worker:
    <<: *redash-service
    command: worker
    environment:
      QUEUES: "scheduled_queries,schemas"
      WORKERS_COUNT: 1
  adhoc_worker:
    <<: *redash-service
    command: worker
    environment:
      QUEUES: "queries"
      WORKERS_COUNT: 2
  redis:
    image: redis:5.0-alpine
    restart: always
  postgres:
    image: postgres:9.6-alpine
    env_file: /opt/redash/env
    volumes:
      - /data/postgres-data:/var/lib/postgresql/data
    restart: always
  nginx:
    image: redash/nginx:latest
    ports:
      - "80:80"
    depends_on:
      - server
    links:
      - server:redash
    restart: always
```


启动
```bash
# 初始化数据库(只有第一次启动需要执行)
docker-compose run --rm server create_db

# 启动redash相关组件
docker-compose up -d
```


---


### 升级
升级不能垮版本升级,需要一个版本一个版本的升级.

1.首先备份pg数据库和env
```bash
docker-compose exec postgres pg_dump -Upostgres -d postgres  > /backup/redash-backup.sql
cp env /backup/env
```

2.升级镜像,修改yaml为新版本的镜像

3.升级db
```bash
docker-compose run --rm server manage db upgrade
```

4.启动服务
```bash
docker-compose up -d
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2796/  

