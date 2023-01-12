# mysql基础sql语句(1)

<!--more-->
<span style="text-indent: 24px; white-space: normal; font-size: 14px; color: #e53333;"><strong>数据查询语言(DQL)</strong></span>

<span style="text-indent: 24px; white-space: normal;">select：查询</span>

<span style="text-indent: 24px; white-space: normal;">    where：条件</span>

<span style="text-indent: 24px;">    order by:排序</span>

<span style="text-indent: 24px;">        desc：倒序</span>

<span style="text-indent: 24px;">        asc：正序</span>

<span style="text-indent: 24px; white-space: normal;">    group by</span>

<span style="text-indent: 24px; white-space: normal;">    having</span>

<span style="text-indent: 24px; white-space: normal;">。。。</span>

<span style="text-indent: 24px; white-space: normal; font-size: 14px; color: #e53333;"><strong>数据操作语言(DML)</strong></span>

***<span style="color: #e53333;">一般用于处理表中的数据</span>***

<span style="text-indent: 24px; white-space: normal;">insert：插入</span>

<span style="text-indent: 24px; white-space: normal;">update：修改</span>

<span style="text-indent: 24px; white-space: normal;">delete：删除</span>

<span style="text-indent: 24px; white-space: normal;">    delete from mysql.user where user='test';(删除mysql库user表中，user字段内容为test的记录)</span>

<span style="text-indent: 24px; white-space: normal;">。。。</span>

<span style="text-indent: 24px; color: #e53333; font-size: 14px;"><strong>事务处理语言(TPL)   <strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong><strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong><strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong></strong></span>

DML语句执行完后，将影响的内容更新到数据库中

commit

rollback

。。。

<span style="text-indent: 24px; color: #e53333; font-size: 14px;"><strong>数据控制语言(DCL)   </strong><strong>※<strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong><strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong></strong></span>

<span style="text-indent: 24px;">如授权等操作</span>

<span style="text-indent: 24px;">grant：设置权限</span>

<span style="text-indent: 24px;">revoke：收回权限</span>

<span style="text-indent: 24px;">。。。</span>

<span style="text-indent: 24px; color: #e53333; font-size: 14px;"><strong>数据定义语言(DDL)   <strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong><strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong><strong style="color: #e53333; font-size: 14px; text-indent: 24px; white-space: normal;">※</strong></strong></span>

<span style="text-indent: 24px; white-space: normal;">create：创建库、表</span>

<span style="text-indent: 24px; white-space: normal;">drop：删除库、表</span>

<span style="text-indent: 24px;">alter：修改</span>

<span style="text-indent: 24px; white-space: normal;">。。。</span>

<span style="text-indent: 24px; font-size: 14px; color: #e53333;"><strong>指针控制语言(CCL)</strong></span>

<span style="text-indent: 24px; white-space: normal;">略</span>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/300/  

