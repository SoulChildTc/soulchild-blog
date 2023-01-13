# datax抽数

<!--more-->
datax是插件机制的,一般插件支持读写，比如mysql，某些插件支持只写比如es的。

插件文档:
https://github.com/alibaba/DataX#support-data-channels


mysql -> mysql示例


```json
{
    "core": {
        "transport": {
            "channel": {
                "speed": {
                    "byte": 10485760
                }
            }
        }
    },
    "job": {
        "setting": {
            "speed": {
                "channel": 10
            }
        },
        "content": [
            {
                "reader": {
                    "name": "mysqlreader",
                    "parameter": {
                        "username": "root",
                        "password": "123456",
                        "column": ["uid"], # 要同步哪一列
                        "splitPk": "id", # 主键字段,单通道同步可以不设置
                        "connection": [ # 要同步的表和库的信息
                            {
                                "table": ["user"],
                                "jdbcUrl": ["jdbc:mysql://xxx:3306/xxx"]
                            }
                        ]
                    }
                },
                "writer": {
                    "name": "mysqlwriter",
                    "parameter": {
                        "writeMode": "insert",
                        "username": "chaoge_log",
                        "password": "SimpleLog",
                        "column": ["newuid"], # 目标表中的字段名
                        "connection": [ # 目标表和库的信息
                            {
                                "jdbcUrl": "jdbc:mysql://xxx:3306/xxx",
                                "table": ["user"]
                            }
                        ]
                    }
                }
            }
        ]
    }
}
```

开始
```bash
python ./bin/datax.py conf/xxx.json  
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2862/  

