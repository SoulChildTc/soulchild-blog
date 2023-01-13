# redis中info参数含义

<!--more-->
<span style="font-family: 'andale mono', monospace;">进入redis后输入info</span>

<span style="font-family: 'andale mono', monospace;"># Server</span>
<span style="font-family: 'andale mono', monospace;">redis_mode:standalone    <span style="color: #ff0000;"># 运行模式(单点)</span></span>
<span style="font-family: 'andale mono', monospace;">os:Linux 3.10.0-862.el7.x86_64 x86_64</span>
<span style="font-family: 'andale mono', monospace;">process_id:6054        <span style="color: #ff0000;"># 当前 Redis 服务器进程id</span></span>
<span style="font-family: 'andale mono', monospace;">run_id:4b68cdf840e00e7980e4b76ad65b5f81ac2e7af7</span>
<span style="font-family: 'andale mono', monospace;">tcp_port:6379            <span style="color: #ff0000;"># 端口号</span></span>
<span style="font-family: 'andale mono', monospace;">uptime_in_seconds:6641        <span style="color: #ff0000;"># 运行多少秒</span></span>
<span style="font-family: 'andale mono', monospace;">uptime_in_days:0        <span style="color: #ff0000;"># 运行了多少天</span></span>

<span style="font-family: 'andale mono', monospace;"># Clients</span>
<span style="font-family: 'andale mono', monospace;">connected_clients:2       <span style="color: #ff0000;"># 客户端连接数量</span></span>

<span style="font-family: 'andale mono', monospace;"># Memory</span>
<span style="font-family: 'andale mono', monospace;">used_memory:875648    <span style="color: #ff0000;"># redis分配器分配的内存总量（单位byte）</span></span>
<span style="font-family: 'andale mono', monospace;">used_memory_human:855.12K   <span style="color: #ff0000;"> # 同上，可读性高</span></span>
<span style="font-family: 'andale mono', monospace;">used_memory_rss:14446592     <span style="color: #ff0000;"># redis进程占用的内存（单位byte）</span></span>
<span style="font-family: 'andale mono', monospace;">used_memory_rss_human:13.78M <span style="color: #ff0000;"># 同上，可读性高</span></span>
<span style="font-family: 'andale mono', monospace;">used_memory_peak:875648     <span style="color: #ff0000;"> # used_memory使用的峰值</span></span>
<span style="font-family: 'andale mono', monospace;">used_memory_peak_human:855.12K    <span style="color: #ff0000;"># 同上，可读性高</span></span>

<span style="font-family: 'andale mono', monospace;"># Persistence</span>
<span style="font-family: 'andale mono', monospace;">loading:0</span>
<span style="font-family: 'andale mono', monospace;">rdb_changes_since_last_save:0   <span style="color: #ff0000;"> # 上次rdb保存后，改变key的次数（新增和修改）</span></span>
<span style="font-family: 'andale mono', monospace;">rdb_bgsave_in_progress:0         <span style="color: #ff0000;"># 当前是否在进行bgsave，是为1</span></span>
<span style="font-family: 'andale mono', monospace;">rdb_last_save_time:1583302790    <span style="color: #ff0000;"># 最后一次进行bgsave保存的时间戳</span></span>
<span style="font-family: 'andale mono', monospace;">rdb_last_bgsave_status:ok        <span style="color: #ff0000;"># 最后一次进行bgsave保存的状态</span></span>
<span style="font-family: 'andale mono', monospace;">rdb_last_bgsave_time_sec:0       <span style="color: #ff0000;"># 最后一次进行bgsave保存的花费时间</span></span>
<span style="font-family: 'andale mono', monospace;">aof_enabled:0                    <span style="color: #ff0000;"># 0代表未开启aof持久化</span></span>

<span style="font-family: 'andale mono', monospace;"># Stats</span>
<span style="font-family: 'andale mono', monospace;">total_connections_received:23    <span style="color: #ff0000;"># 运行以来连接过的客户端的总数量</span></span>
<span style="font-family: 'andale mono', monospace;">total_commands_processed:68      <span style="color: #ff0000;"># 运行以来执行过的命令的总数量</span></span>
<span style="font-family: 'andale mono', monospace;">expired_keys:0                   <span style="color: #ff0000;"># 运行以来过期的key的数量</span></span>
<span style="font-family: 'andale mono', monospace;">evicted_keys:0                   <span style="color: #ff0000;"># 由于 maxmemory 限制，而被回收内存的 key 的总数</span></span>
<span style="font-family: 'andale mono', monospace;">keyspace_hits:11                 <span style="color: #ff0000;"># 查询key的命中次数</span></span>
<span style="font-family: 'andale mono', monospace;">keyspace_misses:9                <span style="color: #ff0000;"># 没命中的次数</span></span>
<span style="font-family: 'andale mono', monospace;">pubsub_channels:0               <span style="color: #ff0000;"> # 发布/订阅频道数量</span></span>
<span style="font-family: 'andale mono', monospace;">pubsub_patterns:0                <span style="color: #ff0000;"># 发布/订阅模式数量</span></span>

<span style="font-family: 'andale mono', monospace;"># Replication</span>
<span style="font-family: 'andale mono', monospace;">role:master                   <span style="color: #ff0000;">   # 当前实例的角色</span></span>
<span style="font-family: 'andale mono', monospace;">connected_slaves:0</span>
<span style="font-family: 'andale mono', monospace;">master_replid:e9a2198fa7f05ecdf0c2bb272815867887580ba6</span>
<span style="font-family: 'andale mono', monospace;">master_replid2:0000000000000000000000000000000000000000</span>
<span style="font-family: 'andale mono', monospace;">master_repl_offset:0</span>
<span style="font-family: 'andale mono', monospace;">second_repl_offset:-1</span>
<span style="font-family: 'andale mono', monospace;">repl_backlog_active:0</span>
<span style="font-family: 'andale mono', monospace;">repl_backlog_size:1048576</span>
<span style="font-family: 'andale mono', monospace;">repl_backlog_first_byte_offset:0</span>
<span style="font-family: 'andale mono', monospace;">repl_backlog_histlen:0</span>

<span style="font-family: 'andale mono', monospace;"># CPU</span>
<span style="font-family: 'andale mono', monospace;">used_cpu_sys:5.549805            </span>
<span style="font-family: 'andale mono', monospace;">used_cpu_user:5.548372</span>
<span style="font-family: 'andale mono', monospace;">used_cpu_sys_children:0.053221</span>
<span style="font-family: 'andale mono', monospace;">used_cpu_user_children:0.001071</span>

<span style="font-family: 'andale mono', monospace;"># Cluster</span>
<span style="font-family: 'andale mono', monospace;">cluster_enabled:0</span>

<span style="font-family: 'andale mono', monospace;"># Keyspace</span>

<span style="font-family: 'andale mono', monospace; color: #ff0000;"># 统计每个库中key的存活数量,过期数量，平均生存时间(单位毫秒)</span>

<span style="font-family: 'andale mono', monospace;">db0:keys=4,expires=0,avg_ttl=0</span>
<span style="font-family: 'andale mono', monospace;">db1:keys=1,expires=1,avg_ttl=1205425200</span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1481/  

