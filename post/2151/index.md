# cmdline-jmxclient获取jvm的Mbean线程信息

<!--more-->
工具下载：http://crawler.archive.org/cmdline-jmxclient/cmdline-jmxclient-0.10.3.jar
官方文档：http://crawler.archive.org/cmdline-jmxclient/

查看所有bean名称：
`java -jar cmdline-jmxclient-0.10.3.jar  - 127.0.0.1:12347`


获取bean属性的名称:
`java -jar cmdline-jmxclient-0.10.3.jar  - 127.0.0.1:12347  'Catalina:name="http-nio-8888",type=ThreadPool'`

最终获取bean属性的值:
`java -jar cmdline-jmxclient-0.10.3.jar  - 127.0.0.1:12347  'Catalina:name="http-nio-8888",type=ThreadPool' currentThreadsBusy`




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2151/  

