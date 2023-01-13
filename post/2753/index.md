# java构造方法

<!--more-->
1. 方法名和类名一致
2. 只能使用权限修饰符
3. 不能指定返回类型
4. 和python中的__init__方法差不多

```java
package cn.soulchild.part1;

public class StrucTure {
    int age = 1;
    static {
        System.out.println("在类中定义称为静态构造代码块，只有在第一次new对象的时候执行，执行顺序1");
    }

    {
        System.out.println("在类中定义称为构造代码块，每次new对象的时候执行，执行顺序2");
    }

    public StrucTure(){
        System.out.println("构造方法，每次new对象的时候执行，执行顺序3");
    }

    public void print() {
        System.out.println(age);
    }
}

```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2753/  

