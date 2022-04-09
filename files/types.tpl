import React from "react";
import {RequestConfig} from "./request";

export interface AntdOptions{
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
export interface IUmiConfig{
    //默认 'browser'
    type?: ('browser'|'hash'|'memory')
    //默认 "/"
    basename?:string
    //默认 {}
    request?:RequestConfig
    //初始化状态
    getInitialState?:()=>Promise<any>
    //默认 []
    routes?:IRoute[]

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
