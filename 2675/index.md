# Antd Pro速查

<!--more-->
## antd小帮手

### 查找icon
icon地址: https://ant.design/components/icon-cn/
菜单icon使用方法: 
点击图标复制组件名称, 粘贴到route.ts的icon中。尖括号需要去除,只保留名称。
https://pro.ant.design/zh-CN/docs/new-page#%E5%9C%A8%E8%8F%9C%E5%8D%95%E4%B8%AD%E4%BD%BF%E7%94%A8-iconfont


### 主配色
config/defaultSettings.ts文件的primaryColor参数
绿色: `#52c41a`，`#1DA57A`


### 快速生成代码块模板
输入rsc然后table,快速生成代码块模板


### pro布局组件(表格卡片之类的)
https://procomponents.ant.design/components



### 图表组件库(监控必备)
https://charts.ant.design/zh-CN/demos/global/


这是一个折线图取区域标记的例子(可用于当某些监控指标过高时，使用红色标记出来)
```react
    annotations: [
      {
        type: 'regionFilter',
        start: ['start', 'median'], // start指定起点坐标(前者是代表x轴，后者代表y轴)
        end: ['max', 'max'], // end指定终点坐标。最后将起点和重点之间的区域标记起来
        color: '#F4664A',
        style: { textBaseline: 'bottom'},
      },

```

### 修改底部信息
src/components/Footer/index.tsx
defaultMessage
links


### 函数写法解释
const DemoLine: React.FC = () => {}

定义一个对象为DemoLine，类型为React.FC(React.functionComponent)。类型可写可不写




---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2675/  

