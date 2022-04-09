import React from "react";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
export interface IRequestOptions {
}
export interface IAntdOptions {
    style?: ("css" | "less");
    pro?: boolean;
}
export interface IRoute {
    caseSensitive?: boolean;
    children?: IRoute[];
    index?: boolean;
    path?: string;
    element?: React.ReactNode;
    [name: string]: any;
}
export interface IPluginOptions {
    antd?: IAntdOptions;
    tempDir?: '.umi' | string;
}
export declare enum ErrorShowType {
    SILENT = 0,
    WARN_MESSAGE = 1,
    ERROR_MESSAGE = 2,
    NOTIFICATION = 3,
    REDIRECT = 9
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
export interface IAdaptor {
    (resData: any, response: AxiosResponse): IErrorInfo;
}
export interface IErrorHandler {
    (error: RequestError, opts: AxiosRequestConfig & {
        skipErrorHandler?: boolean;
    }, config: RequestConfig): void;
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
        adaptor?: IAdaptor;
        errorHandler?: IErrorHandler;
        defaultCodeErrorMessage?: string;
        defaultNoneResponseErrorMessage?: string;
        defaultRequestErrorMessage?: string;
    };
    formatResultAdaptor?: IFormatResultAdaptor;
}
export interface IUmiConfig {
    type?: ('browser' | 'hash' | 'memory');
    basename?: string;
    request?: RequestConfig;
    getInitialState?: () => Promise<any>;
    routes?: IRoute[];
}
