# java获取系统当前时间

<!--more-->
代码：
```java
cat > NowString.java <<EOF
import java.util.Date;                                                 
import java.text.SimpleDateFormat;                                     
                                                                         
public class NowString {                                               
  public static void main(String[] args) {
    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    System.out.println(df.format(new Date()));
  }
}
EOF
```

编译：
javac NowString.java

运行:
java NowString


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2087/  

