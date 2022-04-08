import React from "react";

export interface AntdOptions{
    //使用css还是less,会自动配置按需导入
    style?: ("css" | "less")
    //是否使用ant design pro,会自动处理别名问题
    pro?:boolean
}
export interface IRequestOptions {

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
export interface IUmiConfig{
    type?: ('browser'|'hash'|'memory')
    basename?:string
    routes?:IRoute[]
    //默认{}
    request?:IRequestOptions|false
}

export interface IAppData{
    pluginName:string
    pluginVersion:string
    projectName:string
    umiConfig:IUmiConfig
}

export function defineUmi(config:IUmiConfig):IUmiConfig{
    return config
}
