import React from "react";
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
    runtime?: 'src/main.tsx' | 'src/App.tsx' | string;
    antd?: IAntdOptions;
}
export interface IUmiConfig {
    type?: ('browser' | 'hash' | 'memory');
    basename?: string;
    routes?: IRoute[];
    request?: IRequestOptions | false;
}
