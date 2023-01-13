# java Exception in thread &quot;main&quot; java.lang.AssertionError

<!--more-->
使用maven编译的时候报错`Exception in thread "main" java.lang.AssertionError`，需要添加一个编译插件显示详细的错误信息

```bash
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
          <forceJavacCompilerUse>true</forceJavacCompilerUse>
        </configuration>
      </plugin>

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2826/  

