

export interface Route{
    name?: string
    path?: string
    file?: string
    icon?: string
    access?: string
}
export class AppData {
    static version:string
    static base:string
    static clientRoutes: Route[]
}


AppData.version=`<%=AppData.pluginVersion%>`
AppData.base=`<%=AppData.pluginOptions.route.base%>`
AppData.clientRoutes=[
    {name:"首页",path:"/",file:"./index"}
]

//appdata
export function useAppData():AppData{
    return AppData
}
