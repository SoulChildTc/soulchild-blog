# React入门学习-Ant Design(三)

<!--more-->
本文接着使用上一篇的项目代码

### 安装Antd
```bash
yarn add antd
```

### 使用antd组件
修改src/App.js
```bash
// 添加如下两行引入antd组件
import { Input, Button } from "antd"
import 'antd/dist/antd.css'

// 修改之前的input和button
      <Input type="text" style={{width: 200}} value={val} onChange={this.handleChange} />
      <Button type="primary" onClick={this.handleAdd}>添加</Button>
```

### 使用search组件实现添加
1.定义search组件
```bash
const Search = Input.Search
```
2.使用Search组件，最终代码如下
```bash
// import './App.css';

import React from "react";
import { Input, Button } from "antd"
import 'antd/dist/antd.css'

const Search = Input.Search

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

  handleSearch = (value) => {
    const { li } = this.state
    li.push(value)
    this.setState({
      li
    })
  }
  render(){
    const { val, li } = this.state

    return <div>
      <Input type="text" style={{width: 200}} value={val} onChange={this.handleChange} />
      <Button type="primary" onClick={this.handleAdd}>添加</Button>
      <Search
      placeholder="input search text"
      allowClear
      enterButton="添加"
      size="middle"
      style={{width: 270}}
      onSearch={this.handleSearch}
    />
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

### 使用Select组件
```bash
// import './App.css';

import React from "react";
import { Input, Button, Select } from "antd"
import 'antd/dist/antd.css'

const Search = Input.Search
const Option = Select

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

  handleSearch = (value) => {
    const { li } = this.state
    li.push(value)
    this.setState({
      li
    })
  }
  render(){
    const { val, li } = this.state

    return <div>
      <Input type="text" style={{width: 200}} value={val} onChange={this.handleChange} />
      <Button type="primary" onClick={this.handleAdd}>添加</Button>
      <Search
      placeholder="input search text"
      allowClear
      enterButton="添加"
      size="middle"
      style={{width: 270}}
      onSearch={this.handleSearch}
      />

      <Select defaultValue="" style={{ width: 120 }}>
        {li.map((item, index)=>{
          return <Option value={item} key={index}>{item}</Option>
        })}
      </Select>
      
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
> URL: https://www.soulchild.cn/post/2704/  

