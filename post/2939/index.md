# go实现切片的冒泡排序

<!--more-->
```bash
package main

import (
	"fmt"
)


func main() {


	/*
					切片：s = {30,50,20,10,60,40}
					从小到达排序
					冒泡排序: i>j，如果成立就交换,否则不变
					第一轮 {30,50,20,10,60,40}
				      第1次. 30>50, 不变 {30,50,20,10,60,40}
				      第2次. 50>20, 交换 {30,20,50,10,60,40}
			          第3次. 50>10, 交换 {30,20,10,50,60,40}
					  第4次. 50>60, 不变 {30,20,10,50,60,40}
			          第5次. 60>40, 交换 {30,20,10,50,40,60}
		 			第二轮 {30,20,10,50,40,60}
					  第1次. 30>20, 交换 {20,30,10,50,40,60}
					  第2次. 30>10, 交换 {20,10,30,50,40,60}
					  第3次. 30>50, 不变 {20,10,30,50,40,60}
					  第4次. 50>40, 交换 {20,10,30,40,50,60}
					  第5次.不比，因为第一次已经确认60最大了
		            ...进行5轮，len(s) - 1
					规律，每i轮的比较次数=len(s) - i
	*/

	s := []int{1, 30, 50, 20, 10, 60, 40}
	// 外层循环控制，需要进行几轮比较, i会经历1,2,3,4,5
	for i := 1; i < len(s); i++ {
		for j := 0; j < len(s)-i; j++ { // 内层循环控制比较几次, j会经历 第1轮 0~len(s)-1=0~5. 第2轮 0~len(s)-2=0~4. 第3轮 0~len(s)-3=0~3......
			if s[j] > s[j+1] {
				swap(s, j, j+1)
			}
		}
	}
	fmt.Println(s)

}

func swap(s []int, i, j int) {
	s[i], s[j] = s[j], s[i]
}


```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2939/  

