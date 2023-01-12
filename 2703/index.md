# React入门学习-脚手架(二)

<!--more-->
### 安装创建脚手架的命令
```bash
cnpm install create-react-app -g
```


### 创建项目
```bash
create-react-app react-learn-1
cd react-learn-1
```

### 运行项目
```bash
cd react-learn-1
yarn start
```

### Todo-demo示例

#### 修改src/App.js
```bash
// import './App.css';

import React from "react";

class App extends React.Component{
  state = {
    val: '',
    li: []
  }

  handleChange = (event) => {
    this.setState({
      val: event.target.value
    })
  }

  handleAdd = () => {
    const { val, li } = this.state
    li.push(val)
    this.setState({
      li
    })
    console.log(this.state)
  }
  render(){
    const { val, li } = this.state

    return <div>
      <input type="text" value={val} onChange={this.handleChange} />
      <button onClick={this.handleAdd}>添加</button>
      <ul>
        {
          li.map((item, index)=>{
            return <li key={index}>{item}</li>
          })
        }
      </ul>
    </div>
  }
}

export default App;
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2703/  

