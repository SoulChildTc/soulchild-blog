# keepalived开启非抢占模式

<!--more-->
主要有两个改动：

1.将所有角色改为BACKUP

2.在优先级高的节点添加nopreempt配置

&nbsp;

MASTER配置
<pre class="line-numbers" data-start="1"><code class="language-bash">global_defs {
   notification_email {
     742899387@qq.com
   }
   notification_email_from keepalived@local.com
   smtp_server 192.168.200.1
   smtp_connect_timeout 30
   router_id keep-01
}

# 定义一个状态检查,script中也可以写一个脚本，但脚本需有返回值0或非0
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
    # 设置为BACKUP
    state <span style="color: #ff0000;">BACKUP</span>
    # 指定网卡
    interface eth0
    # vrrp标识1-255(需要和备节点一致)
    virtual_router_id 51
    # 指定优先级，值越大优先级越高
    priority 100
    # 组播包间隔时间
    advert_int 1
    # 开启非抢占模式
    <span style="color: #ff0000;">nopreempt</span>
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

BACKUP配置
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
> URL: https://www.soulchild.cn/1254/  

