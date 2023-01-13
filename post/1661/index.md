# zookeeper中不同角色的含义

<!--more-->
Zookeeper集群主要角色有Server和client，其中，Server又分为Leader、Follower和Observer三个角色，每个角色的含义如下：
<ul>
 	<li>Leader：领导者角色，主要负责投票的发起和决议，以及更新系统状态。集群中只有一个leader。</li>
 	<li>Follower：跟随者角色，用于接收客户端的请求并返回结果给客户端，在选举过程中参与投票。</li>
 	<li>Observer：观察者角色，用户接收客户端的请求，并将写请求转发给leader，同时同步leader状态，但不参与投票。 Observer目的是扩展系统，提高伸缩性。</li>
 	<li>Client:客户端角色，用于向Zookeeper发起请求。</li>
</ul>
Zookeeper集群中每个Server在内存中存储了一份数据，在Zookeeper启动时，将从实例中选举一个Server作为leader，Leader负责处理数据更新等操作，当且仅当大多数Server在内存中成功修改数据，才认为数据修改成功。

Zookeeper写的流程为：客户端Client首先和集群任意一个节点通信，发起写请求，如果是Follower，Observer节点，则会把写请求转发给leader，Leader再将写请求转发给其它Follower，其它Follower在接收到写请求后写入数据并响应Leader，Leader在接收到半数以上写成功回应后，认为数据写成功，最后响应Client，完成一次写操作过程。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1661/  

