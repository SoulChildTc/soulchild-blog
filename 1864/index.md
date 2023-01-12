# python虚拟环境virtualenv安装使用

<!--more-->
安装
```
pip3 install virtualenv virtualenvwrapper
```

配置
vim ~/.bashrc
```
source /usr/local/python3/bin/virtualenvwrapper.sh
VIRTUALENVWRAPPER_PYTHON=/usr/local/python3/bin/python3.6
```

使用
```
#创建环境：
mkvirtualenv <环境名>

#指定py版本
mkvirtualenv -p python2 <环境名>

#删除环境：
rmvirtualenv <环境名>

#切换环境：
workon <环境名>

#退出环境：
deactivate

列出所有环境：workon 或者 lsvirtualenv
```


默认创建的虚拟环境在`~/.virtualenvs/`可以使用`WORKON_HOME`变量修改


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1864/  

