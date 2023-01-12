# zabbix自定义报警内容

<!--more-->
官方参考文档：<a href="https://www.zabbix.com/documentation/4.0/zh/manual/appendix/macros/supported_by_location">https://www.zabbix.com/documentation/4.0/zh/manual/appendix/macros/supported_by_location</a>
<h3><span style="color: #ff0000; font-size: 12pt;"><strong>故障：</strong></span></h3>
<span style="color: #008000;"><strong>标题：</strong></span>

{HOST.NAME},发现异常

<span style="color: #008000;"><strong>内容：</strong></span>

告警时间:

{EVENT.DATE} {EVENT.TIME}

告警设备IP:

{HOSTNAME1}

告警信息:

{TRIGGER.NAME}

当前状态:

{TRIGGER.STATUS}：{ITEM.VALUE1}

##########################################
<h3><span style="font-size: 12pt;"><strong><span style="color: #ff0000;">恢复：</span></strong></span></h3>
<span style="color: #008000;"><strong>标题：</strong></span>

{HOST.NAME},恢复

<span style="color: #008000;"><strong>报警内容：</strong></span>

告警时间:

{EVENT.DATE} {EVENT.TIME}

告警设备IP:

{HOSTNAME1}

告警信息:

{TRIGGER.NAME}

当前状态:

{TRIGGER.STATUS}:{ITEM.VALUE1}


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/437/  

