# keepalived+nginx高可用服务部署

<!--more-->
高可用：实现自动切换主备服务器

实现方式：

一般服务器实现方式：keepalived、heartbeat

特殊服务器实现方式：mysql（MHA  MMM）、Redis(主从、哨兵模式、集群)

部署keepalived服务:

lb01        10.0.0.5    安装keepalived

lb02        10.0.0.6    安装keepalived

web01

web02

web03

<strong><span style="color: #e53333; font-size: 14px;"># 安装</span></strong><strong><span style="color: #e53333; font-size: 14px;">keepalived</span></strong><strong><span style="color: #e53333; font-size: 14px;">(lb01，lb02)</span></strong>

yum install -y keepalived

<strong><span style="color: #e53333; font-size: 14px;"># 配置文件说明<span style="color: #000000;"><span style="font-family: Microsoft YaHei;">===</span><span style="font-family: Microsoft YaHei;">&gt;</span></span></span></strong><strong><span style="color: #333333; font-size: 14px;">/etc/keepalived/keepalived.conf</span></strong>

01. 全局配置global_defs

报警功能   --- 可使用zabbix代替

高可用节点名称(lb01)：

global_defs {

router_id <span style="color: #e53333;">lb01    <span style="color: #000000;"># 每台服务器名称不同,一般使用主机名即可</span>
</span>

}

02. VRRP配置（说明）

1、利用vrrp协议，实现多台高可用主机通讯

2、可以完成主备竞选机制，高可用集群中只有一个主服务器，可有多个备服务器

主服务器down后，恢复时会再次成为主服务器

3、选出主服务器后，由主服务器发送组播包信息

4、主服务器拥有vip地址，用户访问vip地址

###################################

&nbsp;

1.MASTER配置(lb01)
<pre class="line-numbers" data-start="1"><code class="language-bash">global_defs {
   notification_email {
     742899387@qq.com
   }
   notification_email_from keepalived@local.com
   smtp_server 192.168.200.1
   smtp_connect_timeout 30
   <span style="color: #ff0000;">router_id keep-01</span>
}

# 定义一个状态检查,script中也可以写一个脚本，但脚本需有返回值
vrrp_script check_nginx {
    # 每2秒检查一次nginx进程状态，根据命令执行的状态码去判断服务是否正常
    script "/usr/bin/killall -0 nginx"
    interval 2
    # 2次状态吗为非0才为失败状态
    fall 2
    # 2次状态码为0才为正常状态
    rise 2
}

vrrp_instance nginx {
    # 设置为master
    state MASTER
    # 指定网卡
    interface eth0
    # vrrp标识1-255(需要和备节点一致)
    virtual_router_id 51
    # 指定优先级，值越大优先级越高
    priority <span style="color: #ff0000;">100</span>
    # 组播包间隔时间
    advert_int 1
    # 认证
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    # 配置vip
    virtual_ipaddress {
        10.0.0.3
    }

    # 指定进入不同状态时要执行的脚本
    #notify_master "/server/scripts/keepalive/master.sh"
    #notify_backup "/server/scripts/keepalive/backup.sh"
    #notify_fault "/server/scripts/keepalive/fault.sh"

    # 引用上面定义的状态检查
    track_script {
        check_nginx
    }
}</code></pre>
&nbsp;

2.BACKUP配置(lb02)
<pre class="line-numbers" data-start="1"><code class="language-bash">global_defs {
   notification_email {
     742899387@qq.com
   }
   notification_email_from keepalived@local.com
   smtp_server 192.168.200.1
   smtp_connect_timeout 30
   router_id keep-02
}

vrrp_script check_nginx {
    script "/usr/bin/killall -0 nginx"
    interval 2
    fall 2
    rise 2
}

vrrp_instance nginx {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 50
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }

    #notify_master "/server/scripts/keepalive/master.sh"
    #notify_backup "/server/scripts/keepalive/backup.sh"
    #notify_fault "/server/scripts/keepalive/fault.sh"


    virtual_ipaddress {
        10.0.0.3
    }
    track_script {
        check_nginx
    }
}</code></pre>
&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/249/  

