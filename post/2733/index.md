# moment获取各种时间

<!--more-->
### 1.获取当前月份的第一天&最后一天
```bash
moment().startOf('month').format("YYYY-MM-DD")
moment().endOf('month').format("YYYY-MM-DD")
```

### 2.获取当前的日期
```bash
moment().format('YYYY-MM-DD')
```

### 3.获取今年的日期范围
```bash
moment().startOf('year').format('YYYY-MM-DD')
moment().endOf('year').format('YYYY-MM-DD')
```

### 4.时间加减
```bash
// 获取明天的日期
moment().add(1,'days').format('YYYY-MM-DD')
// 获取昨天的日期
moment().add(-1,'days').format('YYYY-MM-DD')
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2733/  

