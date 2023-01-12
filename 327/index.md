# mysql-explain查看sql执行过程

<!--more-->
<strong><span style="color: #ff0000;">在查询语句前加explain</span></strong>

例:

mysql&gt; explain select * from test where name='soulchild'\G;
*************************** 1. row ***************************
id: 1
select_type: SIMPLE
table: test
type: ALL
possible_keys: NULL
key: NULL
key_len: NULL
ref: NULL
<span style="background-color: #e53333; color: #000000;">rows: 5</span>
Extra: Using where
1 row in set (0.00 sec)

<strong><span style="font-size: 16px; color: #e53333;">说明：</span></strong>

<span style="font-family: &quot;white-space:normal; background-color: #ffffff;"><strong><span style="font-size: 14px;">id</span></strong><strong><span style="font-size: 14px;">：</span></strong>SELECT识别符。这是SELECT的查询序列号</span>

<span style="font-size: 14px;"><strong>select_type:<span style="font-family: &quot;white-space:normal;">可以为以下任何一种</span></strong></span>
<ul style="margin: 0px 0px 0px 30px; padding: 0px; word-break: break-all; font-family: verdana, &quot;white-space:normal; background-color: #ffffff;">
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">SIMPLE</strong>:简单SELECT(不使用UNION或子查询)</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">PRIMARY</strong>:最外面的SELECT</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">UNION</strong>:UNION中的第二个或后面的SELECT语句</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">DEPENDENT UNION</strong>:UNION中的第二个或后面的SELECT语句,取决于外面的查询</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">UNION RESULT</strong>:UNION 的结果</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">SUBQUERY</strong>:子查询中的第一个SELECT</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">DEPENDENT SUBQUERY</strong>:子查询中的第一个SELECT,取决于外面的查询</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">DERIVED</strong>:导出表的SELECT(FROM子句的子查询)</span></li>
</ul>
<span style="white-space: normal;"><span style="font-size: 14px;"><strong>       table: </strong></span><span style="font-family: &quot;white-space:normal; background-color: #ffffff;">输出的行所引用的表</span></span><br style="white-space: normal;" /><span style="white-space: normal;"><span style="font-size: 14px;"><strong>       type: </strong></span><span style="font-family: &quot;white-space:normal; background-color: #ffffff;">联接类型，下面给出各种联接类型,按照从最佳类型到最坏类型进行排序:</span></span>
<ul style="margin: 0px 0px 0px 30px; padding: 0px; word-break: break-all; font-family: verdana, &quot;white-space:normal; background-color: #ffffff;">
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">system</strong>:表仅有一行(=系统表)。这是const联接类型的一个特例。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">const</strong>:表最多有一个匹配行,它将在查询开始时被读取。因为仅有一行,在这行的列值可被优化器剩余部分认为是常数。const表很快,因为它们只读取一次!</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">eq_ref</strong>:对于每个来自于前面的表的行组合,从该表中读取一行。这可能是最好的联接类型,除了const类型。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">ref</strong>:对于每个来自于前面的表的行组合,所有有匹配索引值的行将从这张表中读取。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">ref_or_null</strong>:该联接类型如同ref,但是添加了MySQL可以专门搜索包含NULL值的行。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">index_merge</strong>:该联接类型表示使用了索引合并优化方法。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">unique_subquery</strong>:该类型替换了下面形式的IN子查询的ref: value IN (SELECT primary_key FROM single_table WHERE some_expr) unique_subquery是一个索引查找函数,可以完全替换子查询,效率更高。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">index_subquery</strong>:该联接类型类似于unique_subquery。可以替换IN子查询,但只适合下列形式的子查询中的非唯一索引: value IN (SELECT key_column FROM single_table WHERE some_expr)</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">range</strong>:只检索给定范围的行,使用一个索引来选择行。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">index</strong>:该联接类型与ALL相同,除了只有索引树被扫描。这通常比ALL快,因为索引文件通常比数据文件小。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">ALL</strong>:对于每个来自于先前的表的行组合,进行完整的表扫描。</span></li>
</ul>
<span style="white-space: normal;"><span style="font-size: 14px;"><strong>              possible_keys: </strong></span><span style="font-family: &quot;white-space:normal; background-color: #ffffff;">指出MySQL能使用哪个索引在该表中找到行</span></span><br style="white-space: normal;" /><span style="white-space: normal;"><span style="font-size: 14px;"><strong>              key:</strong></span> <span style="font-family: &quot;white-space:normal; background-color: #ffffff;">显示MySQL实际决定使用的键(索引)。如果没有选择索引,键是NULL。</span></span><br style="white-space: normal;" /><span style="white-space: normal;"><span style="font-size: 14px;"><strong>              key_len: </strong></span><span style="font-family: &quot;white-space:normal; background-color: #ffffff;">显示MySQL决定使用的键长度。如果键是NULL,则长度为NULL。</span></span><br style="white-space: normal;" /><span style="white-space: normal;"><span style="font-size: 14px;"><strong>              ref: </strong></span><span style="font-family: &quot;white-space:normal; background-color: #ffffff;">显示使用哪个列或常数与key一起从表中选择行。</span></span><br style="white-space: normal;" /><span style="white-space: normal;"><span style="font-size: 14px;"><strong>              rows: </strong></span><span style="font-family: &quot;white-space:normal; background-color: #ffffff;">显示MySQL执行查询时扫描的行数</span></span><br style="white-space: normal;" /><span style="white-space: normal;"><strong><span style="font-size: 14px;">              Extra: </span></strong><span style="font-family: &quot;white-space:normal; background-color: #ffffff;">MySQL解决查询的详细信息</span></span>
<ul style="margin: 0px 0px 0px 30px; padding: 0px; word-break: break-all; font-family: verdana, &quot;white-space:normal; background-color: #ffffff;">
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Distinct</strong>:MySQL发现第1个匹配行后,停止为当前的行组合搜索更多的行。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Not exists</strong>:MySQL能够对查询进行LEFT JOIN优化,发现1个匹配LEFT JOIN标准的行后,不再为前面的的行组合在该表内检查更多的行。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">range checked for each record (index map: #)</strong>:MySQL没有发现好的可以使用的索引,但发现如果来自前面的表的列值已知,可能部分索引可以使用。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Using filesort</strong>:MySQL需要额外的一次传递,以找出如何按排序顺序检索行。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Using index</strong>:从只使用索引树中的信息而不需要进一步搜索读取实际的行来检索表中的列信息。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Using temporary</strong>:为了解决查询,MySQL需要创建一个临时表来容纳结果。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Using where</strong>:WHERE 子句用于限制哪一个行匹配下一个表或发送到客户。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Using sort_union(...), Using union(...), Using intersect(...)</strong>:这些函数说明如何为index_merge联接类型合并索引扫描。</span></li>
 	<li style="margin: 0px; padding: 0px; list-style: disc;"><span style="margin: 0px; padding: 0px; line-height: 18px; font-family: &quot;;"><strong style="margin: 0px; padding: 0px;">Using index for group-by</strong>:类似于访问表的Using index方式,Using index for group-by表示MySQL发现了一个索引,可以用来查 询GROUP BY或DISTINCT查询的所有列,而不要额外搜索硬盘访问实际的表。</span></li>
</ul>
&nbsp;

<strong><span style="color: #ff0000;">在name列创建普通索引,在查询</span></strong>

mysql&gt; create index index_name on test(name);

mysql&gt; explain select * from test where name='soulchild'\G;

*************************** 1. row ***************************
id: 1
select_type: SIMPLE
table: test
type: ref
possible_keys: index_name
key: index_name
key_len: 20
ref: const
<span style="background-color: #e53333; color: #000000;">rows: 1</span>
Extra: Using where; Using index

可以对比出有索引时，只扫描一行就查询到结果了。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/327/  

