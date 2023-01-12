# ansible之setup模块常用的信息

<!--more-->
文章转自：https://blog.51cto.com/liuzhengwei521/1962350

&nbsp;

过滤出指定的信息：

ansible all -m setup -a "filter=ansible_os_family"

&nbsp;

信息说明：

ansible_all_ipv4_addresses：仅显示ipv4的信息

ansible_devices：仅显示磁盘设备信息

ansible_distribution：显示是什么系统，例：centos,suse等

ansible_distribution_major_version：显示是系统主版本

ansible_distribution_version：仅显示系统版本

ansible_machine：显示系统类型，例：32位，还是64位

ansible_eth0：仅显示eth0的信息

ansible_hostname：仅显示主机名

ansible_kernel：仅显示内核版本

ansible_lvm：显示lvm相关信息

ansible_memtotal_mb：显示系统总内存

ansible_memfree_mb：显示可用系统内存

ansible_memory_mb：详细显示内存情况

ansible_swaptotal_mb：显示总的swap内存

ansible_swapfree_mb：显示swap内存的可用内存

ansible_mounts：显示系统磁盘挂载情况

ansible_processor：显示cpu个数(具体显示每个cpu的型号)

ansible_processor_vcpus：显示cpu个数(只显示总的个数)

ansible_python_version：显示python版本


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/788/  

