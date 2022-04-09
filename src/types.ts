import React from "react";
import type {AxiosRequestConfig, AxiosResponse} from "axios";
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
    //默认不开启
    antd?: IAntdOptions
    tempDir?: '.umi'|string
}

export enum ErrorShowType {
    SILENT = 0,
    WARN_MESSAGE = 1,
    ERROR_MESSAGE = 2,
    NOTIFICATION = 3,
    REDIRECT = 9,
}
export interface IErrorInfo {
    success: boolean;
    data?: any;
    errorCode?: string;
    errorMessage?: string;
    showType?: ErrorShowType;
    traceId?: string;
    host?: string;
    [key: string]: any;
}
// resData 其实就是 response.data, response 则是 axios 的响应对象
export interface IAdaptor {
    (resData: any, response: AxiosResponse): IErrorInfo;
}
export interface IErrorHandler {
    (error: RequestError, opts: AxiosRequestConfig & { skipErrorHandler?: boolean }, config: RequestConfig): void;
}
export interface RequestError extends Error {
    data?: any;
    info?: IErrorInfo;
}
export interface IFormatResultAdaptor {
    (res: AxiosResponse): any;
}
export interface RequestConfig extends AxiosRequestConfig {
    errorConfig?: {
        errorPage?: string;
        adaptor?: IAdaptor; // adaptor 用以用户将不满足接口的后端数据修改成 errorInfo
        errorHandler?: IErrorHandler;
        defaultCodeErrorMessage?: string;
        defaultNoneResponseErrorMessage?: string;
        defaultRequestErrorMessage?: string;
    };
    formatResultAdaptor?: IFormatResultAdaptor;
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
