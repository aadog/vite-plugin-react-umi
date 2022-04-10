## *umi和vite太好用,所以,就把他干到了vite里  (官方方案是把vite干到umi里)*

使用:
1.vite.config.ts

```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createUmi } from 'vite-plugin-react-umi';

// https://vitejs.dev/config/
export default defineConfig({
    plugins:[
        react(),
        createUmi({
        }),
    ],
});
```

2.umiConfig.tsx(跟vite.config.ts同目录,新建一个)
```
import {defineUmi} from "vite-plugin-react-umi";
import {lazy} from "react";
import One from "./src/one";
import Entry from "./src/Entry";
import Two from "./src/two";

const App = lazy(() => import("./src/App"))

export default defineUmi({
    routes: [
        {path:'/',element:<Entry />}
        ,{
            path: '/user', element: <App/>,
            children: [
                {path:"/user",element:"404"},
                {path:"/user/one",element:<One />},
                {path:"/user/two",element:<Two />}
            ]
        }
    ]
})
```


3. tsconfig.json
```
{
  "compilerOptions": {
        "paths": {
        "umi": ["./src/.umi"]
    }
  }
}
```

4. src/main.tsx
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
