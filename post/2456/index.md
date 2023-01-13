# kubernetes 1.20.7 二进制安装-规划(一)

<!--more-->
### 一、机器规划: 
| IP            | 主机名   | 服务                                                          |
| ------------- | -------- | ------------------------------------------------------------ |
| 172.17.20.201 | master01 | kube-apiserver、kube-controller-manager、kube-scheduler、etcd |
| 172.17.20.202 | master02 | kube-apiserver、kube-controller-manager、kube-scheduler、etcd |
| 172.17.20.203 | master03 | kube-apiserver、kube-controller-manager、kube-scheduler、etcd |
| 172.17.20.210 | node01   | kubelet、kube-proxy                                          |
| 172.17.20.211 | node02   | kubelet、kube-proxy                                          |
| 172.17.20.212 | node03   | kubelet、kube-proxy                                          |
| 172.17.20.198 | nginx01  | nginx、keepalived                                            |
| 172.17.20.199 | nginx02  | nginx、keepalived                                            |
| 172.17.20.200 | -        | 负载均衡vip                                                   |


### 二、各个组件版本
| 组件              | 版本| 高可用实现 |
| ---------|----
| kube-apiserver          | v1.20.7 | 横向扩展+nginx |
| kube-controller-manager | v1.20.7 | leader选举 |
| kube-scheduler          | v1.20.7 | leader选举 |
| kube-proxy              | v1.20.7 | 无 |
| kubelet                 | v1.20.7 | 无|
| etcd                    | v3.4.16 | leader选举 |
| docker                  | v19.03.9 | 无 |
| flannel                 | v0.14.0 | 无 |



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2456/  

