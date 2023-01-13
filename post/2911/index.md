# 使用moment将UTC时间转本地时间

<!--more-->
作者：veryCold
链接：https://juejin.cn/post/7099718143303483429
来源：稀土掘金


### 安装
```bash
npm install moment --save   // npm
yarn add moment             // Yarn
```


### 使用
- 将utc时间转为本地时间
```bash
// utils.js
import moment from 'moment'
​
// 这里date是后端返回的字符串格式，如：2022-05-13 16:31:53
export function utcToLocal(date) {
  const fmt = 'YYYY-MM-DD HH:mm:ss'
  return moment.utc(date).local().format(fmt)
}
```

- 将本地时间转为utc时间
```bash
export function localToUtc(date) {
  const fmt = 'YYYY-MM-DD HH:mm:ss'
  return moment(date, fmt).utc().format(fmt)
}
```





---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2911/  

