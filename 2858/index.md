# ElasticSearch ILM索引生命周期实践 - 日志场景

<!--more-->
### 操作步骤
实战为主,没有讲相关概念
1. 创建policy，定义不同阶段对应的不同动作
2. 创建索引模板并和生命周期策略绑定
3. 创建索引
4. 测试ILM执行

### 一、创建policy
这里根据日志的场景来做配置,一般只考虑三个阶段热、暖或冷、删除，下面用了warm没有用cold

```json
PUT _ilm/policy/test-logs
{
  "policy": {
    "phases": {
      "hot": {
        "min_age" : "0m",
        "actions": {
          "set_priority": {
            "priority": 100
          }
        }
      },
      "warm": {
        "min_age": "1m",
        "actions": {
          "set_priority" : {
            "priority": 50
          },
          "allocate" : {
            "number_of_replicas": 0,
            "require" : {
              "box_type": "warm"
            }
          },
          "forcemerge" : {
            "max_num_segments": 1,
            "index_codec": "best_compression"
          }
        }
      },
      "delete": {
        "min_age": "2m",           
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```
> 对于min_age参数的理解: 设置为1m的时候代表索引被创建至少1m才会进入当前阶段执行后续动作,否则还会处于上一个阶段。
> hot: 索引被创建后立刻进入热阶段(因为min_age=0ms)，进入后执行action，设置索引优先级为100。
> warm: 进入warm阶段需要索引的min_age=1m，满足后执行动作，设置索引优先级为50，设置副本为0,索引分配给warm节点(需要自行设置node.attr.box_type),执行ForceMerge操作将segment合并为1个，并且使用best_compression压缩数据，这个比默认的LZ4压缩比更高,但搜索性能差
> delete: 等待索引创建至今满足2m(min_age=2m)后，进入delete阶段，执行删除索引操作


### 二、创建索引模板
下面仅用于测试，生产建议根据自己实际情况修改
```json
PUT _index_template/test-log
{
  "index_patterns": [
    "test-log-*"
  ],
  "template": {
    "settings": {
      "index": {
        "routing.allocation.require.box_type": "hot",
        "lifecycle": {
          "name": "test-logs"
        },
        "number_of_shards": "5",
        "number_of_replicas": "1"
      }
    }
  }
}
```

### 三、创建索引
创建前可以先准备一下测试脚本,方便查看结果
```bash
PUT %3Ctest-log-%7Bnow%2Fd%7D%3E
```


### 四、测试
官方的API
```bash
GET test-log-*/_ilm/explain
```
临时写了个脚本用来测试执行是否符合预期,要使用的话需要修改用户名密码，es地址
`grep -Ev 'es-0[1-3]'`是过滤我的hot节点，改成过滤你的hot节点即可
```bash
#!/bin/bash

index_name="${1:-default}"

index_exits(){
    code=$(curl -s -o /dev/null -w %{http_code} -u elastic:xxx 10.10.101.226:9200/$index_name)
    [[ $code == 404 ]] && return 1 || return 0
}

watch_hot(){
  create_time=$(curl -s -u elastic:xxx "10.10.101.226:9200/$index_name/_settings" | jq -r ".\"$index_name\".settings.index.creation_date" | sed 's#...$##')
  echo "$(date -d "@$create_time" '+%F %H:%M:%S') >> 索引被创建"
  
}

watch_warm(){
  while true;
  do
    curl -s -u elastic:xxx 10.10.101.226:9200/_cat/shards/$index_name | awk '$3=="p"{print $NF}' | grep -Ev 'es-0[1-3]' &> /dev/null
    if [[ $? -eq 0 ]] 
    then
      echo "$(date '+%F %H:%M:%S') >> 分片被分配到warm节点"
      break
    fi
    sleep 1
  done
}

watch_delete(){
  while true;
  do
    index_exits
    if [[ $? -eq 1 ]] 
    then
      echo "$(date '+%F %H:%M:%S') >> 索引被删除"
      break
    fi
    sleep 1
  done
}

index_exits
if [[ $? -eq 0 ]]
then
  watch_hot
  watch_warm
  watch_delete
else
  echo "索引不存在"
fi
```

执行脚本
```bash
sh es_ilm_watch.sh test-log-2022.07.07
```

最终效果
![93929-dwce4zz01ur.png](images/232585211.png)

### PS: 
可能你测试下来会发现并不符合预期,因为我也碰到了。
是什么原因导致的呢？这里需要修改一个参数`indices.lifecycle.poll_interval`，这是一个集群级别的配置，用来控制ILM多久检查一次索引是否符合ILM策略的频率，默认是10m。

一般情况不需要修改这个参数，但是我上面设置的参数远小于10m，所以要想测试成功，还需要手动将检查间隔改为1s来测试
```bash
PUT /_cluster/settings
{
  "transient" : {
    "indices.lifecycle.poll_interval" : "1s"
  }
}
```

测试没问题就可以关掉了
```bash
PUT /_cluster/settings
{
  "transient" : {
    "indices.lifecycle.poll_interval" : null
  }
}
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2858/  

