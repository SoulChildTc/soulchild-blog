# zabbix监控HP DL360 Gen10服务器,告警System status is in critical state

<!--more-->
zabbix状态：
![99010-pukpeuwghok.png](images/2793765967.png "2793765967")

手动通过snmpwalk获取：
![02202-v851ipc0ux.png](images/3728620162.png "3728620162")

服务器状态是没问题的，不知道是什么原因导致的。最后去ilo控制台看日志(Integrated Management Log)，把日志清掉就没问题了。





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2233/  

