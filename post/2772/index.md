# kafka操作删除消费者组

<!--more-->
列出消费者组
```bash
./kafka-consumer-groups.sh --bootstrap-server ip:9092,ip:9092,ip:9092 --list
```


消费组详细信息
```bash
./kafka-consumer-groups.sh --bootstrap-server {kafka连接地址} --describe --group {消费组}
```

删除消费者组
```bash
./kafka-consumer-groups.sh --bootstrap-server ip:9092,ip:9092,ip:9092 --delete --group bbbb
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2772/  

