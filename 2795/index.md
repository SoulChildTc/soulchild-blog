# 解决docker升级后不兼容问题Error response from daemon: Unknown runtime specified docker-runc

<!--more-->
解决办法：
1、将docker-runc替换为runc
grep -rl 'docker-runc' /var/lib/docker/containers/ | xargs sed -i 's/docker-runc/runc/g' 
2、重启docker 
systemctl restart docker


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2795/  

