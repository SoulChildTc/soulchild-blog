# maven编译设置jar包的名称

<!--more-->
和<dependencies>是同级的,这样设置的好处就是在构建容器镜像的时候，所有项目可以统一使用一样的名称。
```xml
     <build>
         <plugins>
             <plugin>
                 <groupId>org.springframework.boot</groupId>
                 <artifactId>spring-boot-maven-plugin</artifactId>
                 <configuration>
                     <fork>true</fork>
                     <!-->jar包名称<-->
                     <finalName>app</finalName>
                     <!-->启动类全路径<-->
                     <mainClass>com.xxx.xx.xx.xx.xx.xxApplication</mainClass>
                 </configuration>
                 <executions>
                     <execution>
                         <goals>
                             <goal>repackage</goal>
                         </goals>
                     </execution>
                 </executions>
             </plugin>
         </plugins>
     </build>
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2809/  

