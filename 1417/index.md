# maven命令编译常用参数

<!--more-->
<span style="font-family: terminal, monaco, monospace;">参数说明：</span>

<span style="font-family: terminal, monaco, monospace;">clean：清除上一次的构建</span>

<span style="font-family: terminal, monaco, monospace;">package：仅打包、测试</span>

<span style="font-family: terminal, monaco, monospace;">install：把打好的包发布至本地仓库，以备本地的其它项目作为依赖使用</span>

<span style="font-family: terminal, monaco, monospace;">deploy：把打好的包发布至本地仓库和远程仓库</span>

<span style="font-family: terminal, monaco, monospace;">-U：强制更新snapshot类型的插件或依赖库</span>

<span style="font-family: terminal, monaco, monospace;">-pl：手动指定构建模块，模块间以逗号分隔</span>

<span style="font-family: terminal, monaco, monospace;">-am：自动构建指定模块的依赖模块</span>

<span style="font-family: terminal, monaco, monospace;">-T：线程计数，例如-T 2C，其中C是核心数，两者相乘即为总线程数</span>

<span style="font-family: terminal, monaco, monospace;">-Dmaven.compile.fork=true：使用多线程编译</span>

<span style="font-family: terminal, monaco, monospace;">-Dmaven.test.skip=true：跳过测试代码的编译</span>
<pre class="line-numbers" data-line="1" data-start="1"><code class="language-bash">指定模块编译：
mvn -U -pl blade-service/xxxx -am clean package

加速编译：
mvn clean install -T 1C -Dmaven.compile.fork=true -Dmaven.test.skip=true

完整编译参数：
mvn clean package -U -pl xxx-service/xxxx -am -T 2C -Dmaven.compile.fork=true</code></pre>


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1417/  

