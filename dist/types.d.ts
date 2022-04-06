export interface RequestOptions {
}
export interface RouteOptions {
    base?: string;
}
export interface AntdOptions {
    style?: ("css" | "less");
    pro?: boolean;
}
export interface PluginOptions {
    runtime?: '/src/main.tsx' | '/src/App.tsx' | string;
    antd?: AntdOptions;
    request?: RequestOptions | false;
    route?: RouteOptions;
}
