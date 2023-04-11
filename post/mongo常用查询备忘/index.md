# Mongo常用查询备忘


<!--more-->

https://www.mongodb.com/docs/manual/tutorial/query-documents/

### 使用mongoexport导出数据
```bash
mongoexport --host=xx.xx.xx.xx  --port=3717 -uadmin -p123456 --authenticationDatabase=admin --db d1  --collection c1 --type csv --fields contentType,content,decision,lastOpInfo,createdTime --query '{"lastOp":"refuse", "updatedTime": { "$gt":1672502400}}' --out xxx.csv
```

### 常见查询操作符

https://www.mongodb.com/docs/manual/reference/operator/query/\

```bash
$eq：匹配字段等于指定值的文档
$ne：匹配字段不等于指定值的文档
$gt：匹配字段大于指定值的文档
$gte：匹配字段大于或等于指定值的文档
$lt：匹配字段小于指定值的文档
$lte：匹配字段小于或等于指定值的文档
$in：匹配字段值在指定数组中的文档
$nin：匹配字段值不在指定数组中的文档
$exists：匹配包含指定字段的文档
$type：匹配指定数据类型的文档
$regex：使用正则表达式匹配字段值的文档
$not：取反
$and
$or
```

### 常用query

判断日期
```json
{"lastOp":"refuse", "updatedTime": {"$gt":1672502400}}

{"updatedTime": {"$gte": 1649539200, "$lte": 1652121600}}
```

使用正则
```json
{"group": {"$regex": ".*_666_.*"}
```

查询字段存在且不为空的记录
```json
{"name": {"$exists": true, "$ne": null}}
```

in 数组
```json
// "tags"数组中包含"music"或者"art"的文档
{"tags": {"$in": ["music", "art"]}}

// 结合正则
{"tags": {"$in": ["/^be/", "/^st/"]}}
```

and
```json
{"$and": [{"age": {"$gte": 18}}, {"gender": "female"}]}
```

---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/mongo%E5%B8%B8%E7%94%A8%E6%9F%A5%E8%AF%A2%E5%A4%87%E5%BF%98/  

