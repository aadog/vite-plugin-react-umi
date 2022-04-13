#### *基于umi4的改造,以vite原生插件形式使用*

**执行原理:**
```
UmiApp->getInitialState->access->路由检查权限->执行layout getInitialProps->绘制layout->执行子页面 getInitialProps->绘制子页面
```

特点支持:  
****
1. [x] 强大的智能提示,基于umi本地生成缓存文件方案[[详情](./doc/1.MD)]
2. [x] 自动导入antd和antd pro样式(暂时不是很完善)[[详情](./doc/2.MD)]
3. [x] 配置式路由,支持lazy形式,组件形式,类型形式,组件形式使用[[详情](./doc/3.MD)]
4. [x] request
5. [x] model
6. [x] access (层级权限,layout和子页面权限有层级关系,还可以单独设置页面跳过)[[详情](./doc/6.MD)]
7. [x] appData(访问全局数据) [[详情](./doc/7.MD)]
8. [ ] history(基于react-dom-route v6,这玩意跳转有问题直接删掉了)
9. [x] getInitialProps(单页面预加载数据 sync/async)  [[详情](./doc/9.MD)]
10. [x] getInitialState(全局预加载数据 sync/async) [[详情](./doc/10.MD)]
11. [x] vite原生插件支持
12. [x] 简单实现全局对象,因为式使用组件形式集成到vite里的,原结构不需要修改 [[详情](./doc/12.MD)]
13. [ ] 约定式路由(还没想好咋玩,暂时没加它)
****



**开始使用:**  

**准备:新建一个vite react-ts工程**  

**准备:安装插件 (暂时测试了yarn,别的没测试)**

`yarn add vite-plugin-react-umi -D`

**1.修改vite.config.ts**

```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createUmi } from 'vite-plugin-react-umi';

// https://vitejs.dev/config/
export default defineConfig({
    plugins:[
        react(),
        createUmi({}),
    ],
});
```

**2.新建一个umiConfig.tsx(跟vite.config.ts同目录)**
```
import {defineUmi} from "vite-plugin-react-umi";
import {lazy} from "react";
import One from "./src/one";
import Entry from "./src/Entry";
import Two from "./src/two";

const App = lazy(() => import("./src/App"))

export default defineUmi({
    routes: [
        {
        path:'/',
        element:<Entry />,  //支持导入方式1
        }
        ,{
            path: '/user', 
            element: <App/>,   //支持导入方式3
            access:'test',   //此时所有子路由都需要test权限
            children: [
                {path:"/user",element:"404"},
                {path:"/user/one",element:One,},  //支持导入方式2
                {path:"/user/two",element:<Two />}
            ]
        }
    ]
})
```


**3. 修改tsconfig.json(添加以提供强大的智能提示)**
```
{
  "compilerOptions": {
        "paths": {
        "umi": ["./src/.umi"]
    }
  }
}
```

**4. 修改src/main.tsx(简单的把UmiApp组件放进去就行了,可以设置很多属性)**
```
import React from 'react'
import ReactDOM from 'react-dom'
import {UmiApp} from "umi";
ReactDOM.render(
    <React.StrictMode>
        <UmiApp />
    </React.StrictMode>,
    document.getElementById('root')
)

```

**5.使用vite原生指令运行:vite**
