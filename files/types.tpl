import React from "react";
import {RequestConfig} from "./request";

export interface AntdOptions{
    //使用css还是less,会自动配置按需导入
    style?: ("css" | "less")
    //是否使用ant design pro,会自动处理别名问题
    pro?:boolean
}
export interface IRoute{
    //是否区分大小写
    caseSensitive?: boolean;
    children?: IRoute[];
    index?: boolean;
    name?: string,
    path?: string;
    element?: React.ReactElement|string|Function;
    //同步,默认true
    getInitialPropsSync?:boolean|undefined
    //要跳转的地址
    redirect?: string
    skipAccess?:boolean
    //权限
    access?: string|string[]
    //元数据
    meta?:{
        //标题
        title?: string
        [name:string]:any
    }
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
    getInitialState?:Function
    //跳过权限处理,自己手动处理权限
    skipAccess?:boolean
    //权限设置
    access?:(initialState?:Record<string, any>)=>Record<string, any>
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

export type PropsWithUmi<P> = P & {
    path?:string
    access?:string[]
    getInitialPropsSync?:boolean
    initialedProps?:boolean
    meta?:{
        title?:string
        [name:string]:any
    },
    auth?:{
        auth:boolean
        allows:string[]
        forbid?:string
    }
    [name:string]:any
};
export interface FunctionComponent<P = {}> {
    (props: PropsWithUmi<P>, context?: any): React.ReactElement<any, any> | null;
    propTypes?: React.WeakValidationMap<P> | undefined;
    contextTypes?: React.ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
    access?:string|string[]
    //元数据
    meta?:{
        //标题
        title?: string
        [name:string]:any
    }
    getInitialProps?:Function|Record<string,any>
    [name:string]:any
}

export type FC<P = {}> = FunctionComponent<P>;

