# ansible2.7.5编写简单剧本playbook

<!--more-->
## playbook配置项说明:

```
---
- hosts: webservers    # 执行任务的主机(all,组名称,ip...)
  vars:                          # 定义变量。引用方式：{{变量名}}
    http_port: 80
    max_clients: 200
    remote_user: root    # 在远程主机上执行任务的用户
  tasks:               # 要执行的任务列表
  - name: ensure apache is at the latest version    # 任务名称(注释)
    yum: pkg=httpd state=latest                     # 指定yum模块，并写入相应模块的使用语法
  - name: copy config file
    copy: src=./httpd.conf dest=/etc/httpd/conf/httpd.conf
    notify: restart apache # 触发handlers中定义的restart apache
  - name: ensure apache is running
    service: name=httpd state=started
  handlers:            # 任务，与tasks不同的是只有在接受到通知时才会被触发
  - name: restart apache
    service: name=httpd state=restarted

```

## 使用剧本：
ansible-playbook -C 02-cron.yml    # 检查剧本，剧本中存在变量时检查会报错

ansible-playbook 02-cron.yml    # 执行剧本



举例：
```
---
- hosts: web
  tasks:
  - name: show hostname
    command: hostname
---
- hosts: web
  tasks:
  - name: add cron
    cron: name="ansible test" minute=10 job="ntedate time.windows.com >/dev/null 2>&1" state=present
```

### register类型变量：
```
---
- hosts: web
  tasks:
    - name: show ip address
      shell: hostname -I | awk '{print $2}'
      register: ip
    - name: print ip var to file
      shell: echo {{ip}} &gt; /tmp/ip
```
上面的剧本首先执行查ip的命令，将执行结果通过register变量赋值给变量ip，然后在将变量ip中的内容追加到文件中。


执行结果如下：
```
{
stderr_lines: [],
uchanged: True,
uend: u2019-03-06 21:34:22.662536,
failed: False,
ustdout: u172.16.1.7,
ucmd: uhostname -I | awk '{print }',
urc: 0,
ustart: u2019-03-06 21:34:22.651661,
ustderr: u,
udelta: u0:00:00.010875,
stdout_lines: [u172.16.1.7]
}
```
我们想要的结果是ip，其他的内容不需要，所以在调用变量得时候使用ip.stdout，即：
```
---
  - hosts: web
    tasks:
      - name: show ip address
        shell: hostname -I | awk '{print $2}'
        register: ip
      - name: print ip var to file
        shell: echo {{ip.stdout}} &gt; /tmp/ip
```

在屏幕中显示剧本的执行结果：
```
---
  - hosts: web
    tasks:
      - name: show hostname
        command: hostname
        register: name
      - name: print hostname
        debug: msg={{name.stdout}}
```

这里用到debug模块,msg表示打印自定义消息，内容就是我们获取到结果的变量。



### 循环：
```
---
  - hosts: web
    tasks:
      - name: print loop debug
        debug: msg={{item}}
        with_items:
          - 1
          - 2
          - 3
```



### 判断:
```
---
  - hosts: all
    tasks:
      - name: yum install nfs-utils rpcbind
        yum: name=nfs-utils,rpcbind state=present
        when: ( ansible_hostname == "nfs01" ) or ( ansible_hostname == "backup" )
```

只有主机名是nfs01或backup时安装nfs-utils rpcbind

ansible_hostname等变量可以使用以下命令查询

ansilbe  ip -m setup




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/256/  

