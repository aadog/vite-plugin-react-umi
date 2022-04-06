

export interface Route{
    name?: string
    path?: string
    file?: string
    icon?: string
    access?: string
}
export class AppData {
    static version:string
    static basename:string
    static clientRoutes: Route[]
}


AppData.version=`{{version}}`
AppData.basename=`{{basename}}`
AppData.clientRoutes=[
    {name:"首页",path:"/",file:"./index"}
]

//appdata
export function useAppData(){
    return AppData
}
