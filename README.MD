### **umi和vite太好用,所以,就把他干到了vite里  (官方方案是把vite干到umi里)**

配置:
```
export interface PluginOptions {
    //默认为 /src/main.tsx
    runtime?: '/src/main.tsx'|'/src/App.tsx'|string
    //默认不开启
    antd?: AntdOptions
    //默认{}
    request?:RequestOptions|false
}
```



功能介绍:  


**1.runtime**  

`说明: 设置为runtime的文件会判断有没有导出函数来生成功能，比如,request`


**1.antd**  
```
export interface AntdOptions{
    //默认css
    style?: ("css" | "less")
    pro?:boolean
}
```
**一句话描述:装好后直接yarn add antd就可以直接用组件了,自动处理样式**  

`说明: 开启后直接安装antd和antd pro样式按需导入,自动处理antd pro专用别名,以及css问题(不安装不会有样式的)  `

**2.request**
```
export interface RequestOptions{

}
```

**开启后可以是用request和useRequest**  

`说明: 配置在运行时里导出函数配置,如下  `

```
export const request:RequestConfig={

};
```
