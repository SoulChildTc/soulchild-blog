# gitlab查找忘记的公钥

<!--more-->
某定时任务提示gitlab账号被锁定,导致无法正常执行,猜测可能是由于人员离职,gitlab账号被禁用导致。私钥可以查看到,但是由于不知道公钥配置到哪个人的账户下了，所以需要查一下公钥配置在哪个用户上,但是gitlab上没有相关的功能，所以准备去数据库里查询一下

### 1.根据私钥推导出公钥
```bash
ssh-keygen -y -e -f /root/.ssh/id_rsa
```

### 2.连接gitlab数据库
```bash
sudo -u gitlab-psql /opt/gitlab/embedded/bin/psql -h /var/opt/gitlab/postgresql -d gitlabhq_production
```

### 3.查看这个公钥是哪个用户创建的
```sql
# 取公钥的一段内容,模糊查询即可
\x
select user_id,key,type from keys where key like '%xxxxxxxxx%';
```

### 4.根据用户id查看用户邮箱
```bash
select email from users where id = '210';
```
> 至此,本以为可以去那个人的账户删除公钥,使用公共账户重新添加,但是这世间往往总是事与愿违，在这个人的ssh keys里并没发现这个公钥,后面发现这个公钥的类型是DeployKey,所以准备去查看全局DeployKeys(设置[Admin Area]-DeployKeys)。
> 但是并没有在DeployKeys中找到相关公钥,想了想可能是在gitlab仓库中添加的,于是去定时任务使用的gitlab仓库中查看(仓库-Settings-Repository-Deploy Keys),发现了一个比较像的,由于不能看到公钥信息,只能查看指纹信息,所以需要计算一下公钥的指纹,做一下对比.


### 5.计算公钥指纹
```bash
md5:
echo 'ssh-rsa AAAAxxx6xxxxxxxxx' | ssh-keygen -E md5 -lf -

sha256:
echo 'ssh-rsa AAAAxxx6xxxxxxxxx' | ssh-keygen -lf -
```
> 发现是一致的,这种只针对某个仓库建的deploykey,是可以删除的

### 6.删除使用重建一个全局的deploykey


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2783/  

