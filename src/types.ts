export interface RequestOptions{

}
export interface HistoryOptions {
    type?: ('browser'|'hash'|'memory')
    basename?:string
}

export interface AntdOptions{
    //使用css还是less,会自动配置按需导入
    style?: ("css" | "less")
    //是否使用ant design pro,会自动处理别名问题
    pro?:boolean
}
export interface PluginOptions {
    //默认为 /src/main.tsx
    runtime?: 'src/main.tsx'|'src/App.tsx'|string
    //默认不开启
    antd?: AntdOptions
    //默认{}
    request?:RequestOptions|false
    //路由配置
    history?:HistoryOptions
}

