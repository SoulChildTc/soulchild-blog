# Elasticsearch快照到阿里云OSS

<!--more-->
## 安装插件
[插件官方文档](https://help.aliyun.com/document_detail/65675.htm)

### 一、准备工作
 - 一个oss bucket
 - 阿里云的`access_key_id`,`secret_access_key`
 - 一个es5.x的集群

### 二、安装elasticsearch-repository-oss插件
下载插件
```bash
wget https://github.91chi.fun/https://github.com/aliyun/elasticsearch-repository-oss/releases/download/v5.5.3/elasticsearch-repository-oss-5.5.3.zip
```

ansible-playbook批量安装插件
```yaml
- hosts: es
  vars:
    plugin_dir: /usr/share/elasticsearch/plugins
    plugin_file: ./elasticsearch-repository-oss-5.5.3.zip
  tasks:
  - name: install aliyun-oss-plugin
    unarchive: 
      src: "{{ plugin_file }}"
      dest: "{{ plugin_dir }}"
      mode: 0755
  - name: alter directory name
    shell: "mv {{plugin_dir}}/elasticsearch {{plugin_dir}}/elasticsearch-repository-oss"
  # 重启请谨慎
  #- name: restart elasticsearch
  #  service: name=elasticsearch state=restarted
```

### 三、创建repositories
`repoName`: 仓库名称
`yourAccesskeyId`: 阿里ak
`yourAccesskeySecret`: 阿里sk
`yourBucketName`: bucket名称
`endpoint`: 根据自己bucket的情况修改
`base_path`: 对应oss中的子路径
```bash
curl -H "Content-Type: application/json" -XPUT localhost:9200/_snapshot/<repoName> -d \
'{
    "type": "oss",
    "settings": {
        "endpoint": "http://oss-cn-hangzhou-internal.aliyuncs.com",
        "access_key_id": "<yourAccesskeyId>",
        "secret_access_key": "<yourAccesskeySecret>",
        "bucket": "<yourBucketName>",
        "compress": true,
        "base_path": "snapshot/"
    }
}'
```
> 查看仓库 `curl http://localhost:9200/_cat/repositories`

### 四、创建snapshot
`snapshotName`: 快照名
```bash
curl -H "Content-Type: application/json" -XPUT localhost:9200/_snapshot/<repoName>/<snapshotName>?pretty -d'
{
"indices": "index1,index2"
}'
```
> 如果要备份所有索引执行: `curl -XPUT localhost:9200/_snapshot/<repoName>/<snapshotName>`

> 查看快照进度: `curl -s http://localhost:9200/_snapshot/<repoName>/_all`


## 恢复快照

### 一、三种恢复索引的方式
#### 1.恢复所有索引
```bash
curl -XPOST localhost:9200/_snapshot/<repoName>/<snapshotName>/_restore

# 默认后台执行恢复,阻塞执行恢复可以使用
curl -XPOST localhost:9200/_snapshot/<repoName>/<snapshotName>/_restore?wait_for_completion=true
```

#### 2.选择性索引恢复
`*`代表恢复所有索引
`-xxx*`代表不恢复哪些索引
```bash
curl -XPOST localhost:9200/_snapshot/<repoName>/<snapshotName>/_restore
{"indices":"*,-.monitoring*,-.security_audit*","ignore_unavailable":"true"}
```

#### 3.修改索引名恢复
如果集群中已经存在相同索引名的索引,为了不影响现有数据,可以通过如下方式重命名索引。
这里应该也可以在索引恢复过程中,修改索引名称,
```bash
curl -XPOST localhost:9200/_snapshot/<repoName>/<snapshotName>/_restore
{
  "indices":"index1",
  "rename_pattern": "index(.+)",
  "rename_replacement": "restored_index_$1"
}
```
> indices: 要恢复的索引名称
> rename_pattern: 通过正则查找正在恢复的索引
> rename_replacement: 重命名查找到的索引

### 二、查看恢复进度
```bash
# 查看指定索引的恢复状态
curl -XGET localhost:9200/<indexName>/_recovery

# 查看所有索引的恢复状态
curl -XGET localhost:9200/_recovery/
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2813/  

