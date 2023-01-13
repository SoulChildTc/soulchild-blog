# nginx优化

<!--more-->
参考：https://www.cnblogs.com/cheyunhua/p/10670070.html

<span style="color: #ff0000; font-size: 14pt;"><strong>一、设置进程数量</strong></span>

worker_processes：设置nginx工作的进程数，一般来说，设置成CPU核的数量即可，这样可以充分利用CPU资源

&nbsp;

查看CPU核数：

[root@nginx ]#grep ^processor /proc/cpuinfo | wc –l

在nginx1.10版本后，worker_processes指令新增了一个配置值auto，它表示nginx会自动检测CPU核数并打开相同数量的worker进程。

&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>二、CPU亲和力（进程绑定CPU）</strong></span>

worker_cpu_affinity：此指令可将Nginx工作进程与指定CPU核绑定，降低由于多核CPU切换造成的性能损耗。

worker_cpu_affinity使用方法是通过1、0来表示的，CPU有多少个核？就有几位数，1代表内核开启，0代表内核关闭，例如：有一个4核的服务器，那么nginx配置中worker_processes、worker_cpu_affinity的写法如下：

&nbsp;

worker_processes  4;

worker_cpu_affinity 0001 0010 0100 1000;

&nbsp;

四核：worker_cpu_affinity 0001 0010 0100 1000;

进程1--&gt; 绑定第一个核心0001

进程2--&gt; 绑定第二个核心0010

进程3--&gt; 绑定第三个核心0100

进程4--&gt; 绑定第四个核心1000

&nbsp;

八核：worker_cpu_affinity 00000001 00000010 00000100 00001000 00010000 00100000 01000000 10000000;

进程1--&gt; 绑定第一个核心00000001

进程2--&gt; 绑定第二个核心00000010

进程3--&gt; 绑定第三个核心00000100

进程4--&gt; 绑定第四个核心00001000

进程5--&gt; 绑定第五个核心00010000

进程6--&gt; 绑定第六个核心00100000

进程7--&gt; 绑定第七个核心01000000

进程8--&gt; 绑定第八个核心10000000

worker_processes最多开启8个，8个以上性能提升不会再提升了，而且稳定性变得更低，所以8个进程够用了。

&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>三、Nginx最大打开文件数</strong></span>

worker_rlimit_nofile 65535;

这个指令是指当一个nginx进程打开的最多文件描述符数目，理论值应该是最多打开文件数（ulimit -n）与nginx进程数相除，但是nginx分配请求并不是那么均匀，所以最好与ulimit -n的值保持一致。

注：文件资源限制的配置可以在/etc/security/limits.conf设置，针对root/user等各个用户或者*代表所有用户来设置。

*   soft nofile   65535

*   hard nofile   65535
用户重新登录生效（ulimit -n）

&nbsp;

<span style="font-size: 14pt;"><strong><span style="color: #ff0000;">四、Nginx事件处理模型</span></strong></span>
events {
use epoll;
worker_connections 65535;
multi_accept on;
}

nginx采用epoll事件模型，处理效率高。

work_connections是<span style="color: #ff0000;">单个worker进程</span>允许客户端最大连接数，这个数值一般根据服务器性能和内存来制定。实际的值就是worker进程数乘以work_connections。

实际我们填入一个65535，足够了，这些都算并发值，一个网站的并发达到这么大的数量，也算一个大站了！

multi_accept 告诉nginx收到一个新连接通知后接受尽可能多的连接，默认是on，设置为on后，多个worker按串行方式来处理连接，也就是一个连接只有一个worker被唤醒，其他的处于休眠状态，设置为off后，多个worker按并行方式来处理连接，也就是一个连接会唤醒所有的worker，直到连接分配完毕，没有取得连接的继续休眠。当你的服务器连接数不多时，开启这个参数会让负载有一定的降低，但是当服务器的吞吐量很大时，为了效率，可以关闭这个参数。

&nbsp;

<span style="color: #ff0000; font-size: 14pt;"><strong>五、开启高效传输模式</strong></span>
http {
include mime.types;
default_type application/octet-stream;
……

sendfile on;

tcp_nopush on;
……
}
Include mime.types ： 媒体类型,include 只是一个在当前文件中包含另一个文件内容的指令。
default_type application/octet-stream ：默认媒体类型足够。
sendfile on：开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
tcp_nopush on：必须在sendfile开启模式才有效，防止网路阻塞，积极的减少网络报文段的数量（将响应头和正文的开始部分一起发送，而不一个接一个的发送。）


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/816/  

