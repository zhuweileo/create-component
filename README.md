# Create Component
### [github](https://github.com/zhuweileo/create-component)  
在开发中，我们经常需要初始化一个组件，组件的初始化，有时候会包含多个文件，例如：一个react组件会包含一个`jsx`文件和一个`css`样式文件。

### 以往，我们初始化该组件就需要执行如下操作：
1. 新建一个文件夹；
2. 创建jsx文件，复制一坨代码（或者用snippets生成）；
3. 创建css文件。

### 该插件将以上步骤简化为：
1. 创建文件夹；
2. 选择预定义的组件模板。

或者：
1. 创建文件夹，并直接生成用户定义的默认组件模板。


# 配置

```json
    "createComponent.userTpl": [
        {
            "name": "React模板",
            "default": true,
            "paths": [
                "F:\\文件夹名称",
                "F:\\文件夹名称\\index.tsx",
                "F:\\文件夹名称\\index.scss"
            ]
        },
        {
            "name": "Vue模板",
            "paths": [
                "F:\\文件夹名称\\index.ts",
                "F:\\文件夹名称\\index.scss",
                "F:\\文件夹名称\\index.vue"
            ]
        }
    ]
```
每个用户自定义模板配置包含以下属性：
```ts
interface tplItem {
	name: string; // 模板名称，模板的唯一标识
	default?: boolean; // 是否设置为默认模板，如果为true，执行New Default Component命令时会直接使用该模板
	paths: string[]; // 组件包含的所有文件的绝对路径, 可以是文件/文件夹路径; 文件夹时，直接拷贝，没有使用ejs编译
}
```

# 使用方法
1. 使用前，请先配置好自己的模板文件的存放位置。

2. 在文件夹内点击鼠标右键时，菜单内会包含 `New Component` 和 `New Default Component` 项，这两个选项类似于新建文件夹命令，不同之处在于，会在文件夹内生成用户选择的模板文件。

3. 模板文件支持 ejs 模板语法
ejs 文档参考 https://ejs.bootcss.com/
目前支持2个预定义变量
name: 用户新建文件夹的名字
date: 当前时间对象

```js
/**
 * 创建日期 <%= date %>
 */

import React, { useEffect, useState } from 'react';
import classNamesBind from 'classnames/bind';
import style from './index.scss';

const cx = classNamesBind.bind(style);

export default function <%= name %>() {
    return (
      <div></div>
    )
}
```


