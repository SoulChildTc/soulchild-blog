# zookeeper-3.4.14集群部署配置

<!--more-->
下载地址：

https://mirror.bit.edu.cn/apache/zookeeper/zookeeper-3.4.14/zookeeper-3.4.14.tar.gz

&nbsp;

下载安装：
<pre class="pure-highlightjs"><code class="null">wget https://mirror.bit.edu.cn/apache/zookeeper/zookeeper-3.4.14/zookeeper-3.4.14.tar.gz
tar xf zookeeper-3.4.14.tar.gz -C /usr/local/
mv /usr/local/zookeeper-3.4.14 /usr/local/zookeeper</code></pre>
配置：

创建配置文件：
<pre class="pure-highlightjs"><code class="null">cp /usr/local/zookeeper/conf/zoo_sample.cfg /usr/local/zookeeper/conf/zoo.cfg</code></pre>
修改配置文件：
<pre class="pure-highlightjs"><code class="null"># 时间单位2000毫秒
tickTime=2000
#集群中的follower服务器(F)与leader服务器(L)之间 初始连接时能容忍的最多心跳数（10*tickTime）即20秒
initLimit=10
# 集群中的follower服务器(F)与leader服务器(L)之间 请求和应答之间能容忍的最多心跳数（5*tickTime）即10秒
syncLimit=5
# 数据目录,没有配置logDir的话log也在此目录
dataDir=/data/zookeeper
# 监听端口
clientPort=2181
# 集群其他节点  格式：IP:与leader节点通信的端口:选举时通信的端口
server.1=192.168.0.4:2888:3888
server.2=192.168.0.3:2888:3888
server.3=192.168.0.12:2888:3888</code></pre>
创建数据目录和myid文件：
<pre class="pure-highlightjs"><code class="null">mkdir /data/zookeeper
# 文件内容要和配置文件中server.1的1对应
echo 1 &gt; /data/zookeeper/myid</code></pre>
&nbsp;

启动服务
<pre class="pure-highlightjs"><code class="null">cd /usr/local/zookeeper/bin
./zkServer.sh start</code></pre>
启动信息可以在当前目录查看zookeeper.out文件

输入jps命令查看是否有QuorumPeerMain，有即为正常.

&nbsp;

其他两台相同配置，只需要注意myid文件的内容

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1663/  

