# fluentd通用参数（三）

<!--more-->
一些通用参数可用于所有（或部分）Fluentd插件。

<span class="text-4505230f--HeadingH600-23f228db--textContentFamily-49a318e1"><span data-key="6848c61fbd254ae79f65f76346af14de">1.@type：指定插件类型</span></span>
<pre class="pure-highlightjs"><code class="null">&lt;source&gt;
  @type my_plugin_type
&lt;/source&gt;

&lt;filter&gt;
  @type my_filter
&lt;/filter&gt;</code></pre>
&nbsp;

2.@id：指定插件 id，在输出监控信息的时候有用。
<pre class="pure-highlightjs"><code class="null">&lt;match&gt;
  @type file
  @id   service_www_accesslog
  path  /path/to/my/access.log
  # ...
&lt;/match&gt;</code></pre>
&nbsp;

3.<span data-slate-fragment="JTdCJTIyb2JqZWN0JTIyJTNBJTIyZG9jdW1lbnQlMjIlMkMlMjJkYXRhJTIyJTNBJTdCJTdEJTJDJTIybm9kZXMlMjIlM0ElNUIlN0IlMjJvYmplY3QlMjIlM0ElMjJibG9jayUyMiUyQyUyMnR5cGUlMjIlM0ElMjJoZWFkaW5nLTIlMjIlMkMlMjJpc1ZvaWQlMjIlM0FmYWxzZSUyQyUyMmRhdGElMjIlM0ElN0IlN0QlMkMlMjJub2RlcyUyMiUzQSU1QiU3QiUyMm9iamVjdCUyMiUzQSUyMnRleHQlMjIlMkMlMjJsZWF2ZXMlMjIlM0ElNUIlN0IlMjJvYmplY3QlMjIlM0ElMjJsZWFmJTIyJTJDJTIydGV4dCUyMiUzQSUyMiU0MGxvZ19sZXZlbCUyMiUyQyUyMm1hcmtzJTIyJTNBJTVCJTVEJTdEJTVEJTdEJTVEJTdEJTVEJTdE">@log_level：此参数用于指定插件特定的日志记录级别。默认日志级别为info。全局日志级别可以由&lt;system&gt;中的日志级别或-v/-q命令行选项指定。@log_level参数只覆盖指定插件实例的日志记录级别。</span>
<pre class="pure-highlightjs"><code class="null">&lt;system&gt;
  log_level info
&lt;/system&gt;

&lt;source&gt;
  # ...
  @log_level debug  # show debug log only for this plugin
&lt;/source&gt;</code></pre>
&nbsp;

4.<span class="text-4505230f--HeadingH600-23f228db--textContentFamily-49a318e1"><span data-key="06c1ed6aa9584370a63dd4c4bfb4d833">@label：将输入事件路由到&lt;label&gt;、&lt;filter&gt;和&lt;match&gt;区块的集合。</span></span>
<pre class="pure-highlightjs"><code class="null">&lt;source&gt;
  @type  ...
  @label @access_logs
  # ...
&lt;/source&gt;

&lt;source&gt;
  @type  ...
  @label @system_metrics
  # ...
&lt;/source&gt;

&lt;label @access_log&gt;
  &lt;match **&gt;
    @type file
    path  ...
  &lt;/match&gt;
&lt;/label&gt;

&lt;label @system_metrics&gt;
  &lt;match **&gt;
    @type file
    path  ...
  &lt;/match&gt;
&lt;/label&gt;</code></pre>
@label参数的值必须以@开头。强烈建议指定@label将事件路由到任何插件。它可以使整个配置变得简单。

&nbsp;

&nbsp;

&nbsp;

&nbsp;


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1717/  

