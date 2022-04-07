export interface RequestOptions {
}
export interface HistoryOptions {
    type?: ('browser' | 'hash' | 'memory');
    basename?: string;
}
export interface AntdOptions {
    style?: ("css" | "less");
    pro?: boolean;
}
export interface PluginOptions {
    runtime?: 'src/main.tsx' | 'src/App.tsx' | string;
    antd?: AntdOptions;
    request?: RequestOptions | false;
    history?: HistoryOptions;
}
