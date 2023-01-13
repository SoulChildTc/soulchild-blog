# js 判断是否内网IP

<!--more-->
```bash
//判断是否内网IP
function IsLAN(ip: string) {
  ip.toLowerCase();
  if(ip=='localhost') return true;
  let a_ip = 0;
  if(ip == "") return false;
  const aNum = ip.split(".");
  if(aNum.length != 4) return false;
  a_ip += parseInt(aNum[0]) << 24;
  a_ip += parseInt(aNum[1]) << 16;
  a_ip += parseInt(aNum[2]) << 8;
  a_ip += parseInt(aNum[3]) << 0;
  a_ip=a_ip>>16 & 0xFFFF;
  return( a_ip>>8 == 0x7F || a_ip>>8 == 0xA || a_ip== 0xC0A8 || (a_ip>=0xAC10 && a_ip<=0xAC1F) );
}
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2738/  

