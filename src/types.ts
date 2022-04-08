import React from "react";
export interface IRequestOptions {

}

export interface IAntdOptions {
    //使用css还是less,会自动配置按需导入
    style?: ("css" | "less")
    //是否使用ant design pro,会自动处理别名问题
    pro?:boolean
}

export interface IRoute{
    //区分大小写
    caseSensitive?: boolean;
    children?: IRoute[];
    index?: boolean;
    path?: string;
    element?: React.ReactNode;
    [name:string]:any
}
export interface IPluginOptions {
    //默认为 /src/main.tsx
    runtime?: 'src/main.tsx'|'src/App.tsx'|string
    //默认不开启
    antd?: IAntdOptions
}

export interface IUmiConfig{
    type?: ('browser'|'hash'|'memory')
    basename?:string
    routes?:IRoute[]
    //默认{}
    request?:IRequestOptions|false
}
