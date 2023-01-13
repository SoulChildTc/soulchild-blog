# KVM安装，并创建一台linux虚拟机

<!--more-->
1.查看CPU是否支持虚拟化
<pre>egrep '(vmx|svm)' /proc/cpuinfo</pre>
vmx(intel)

svm(AMD)

在Linux 2.6.20内核之后的版本默认是集成KVM的，如果是以下的版本需要升级以下内核。（可以用uname -r查看）

&nbsp;

2.安装KVM和libvirt(KVM管理工具)
<pre>yum install libvirt virt-install qemu-kvm -y</pre>
&nbsp;

3.开启libvirt服务
<pre>systemctl enable libvirtd
systemctl start libvirtd</pre>
&nbsp;

4.上传系统镜像，安装系统使用

通过xftp上传或者使用光盘生成

将光盘插入光驱然后执行，名字需要自己定义：
<pre>dd if=/dev/cdrom of=/opt/CentOS-7-x86_64-DVD-1804.iso</pre>
&nbsp;

5.添加一台虚拟机
<pre class="pure-highlightjs"><code class="bash">virt-install \
--virt-type kvm \
--os-type=linux \
--os-variant rhel7 \
--name centos7 \
--memory 1024 \
--vcpus 1 \
--disk /opt/centos2.raw,format=raw,size=10 \
--cdrom /opt/CentOS-7-x86_64-DVD-1804.iso \
--network network=default \
--graphics vnc,listen=0.0.0.0 \
--noautoconsole </code></pre>
&nbsp;
<pre>参数说明：
--virt-type kvm #虚拟机类型kvm 
--os-type=linux #系统类型 
--os-variant rhel7 #系统版本
--name centos7 #虚拟机名称
--memory 1024 #内存
--vcpus 1 #cpu数量
--disk /opt/centos2.raw,format=raw,size=10 #磁盘文件路径（硬盘)
--cdrom /opt/CentOS-7-x86_64-DVD-1804.iso #光盘镜像
--network network=default #网络默认为nat
--graphics vnc,listen=0.0.0.0 #vnc监听地址
--noautoconsole #不自动连接控制台</pre>
&nbsp;

添加完成后，可以通过以下命令查看设备状态和vnc端口号
<pre class="line-numbers" data-start="1"><code class="language-bash">#查看主机列表
virsh list --all
#查看vnc端口号
virsh vncdisplay centos7</code></pre>
&nbsp;

6.使用vnc安装系统

这里我关闭了KDUMP，分区没有分swap分区

&nbsp;

配置文件路径：

/etc/libvirt/qemu/xxxxx.xml


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/521/  

