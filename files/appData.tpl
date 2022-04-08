import {IUmiConfig,IAppData,defineUmi} from './types'
import umiConfig from "./umiConfig";
import {RouteObject} from "react-router-dom";


export const AppData:IAppData={
    pluginName:'{{@ AppData.pluginName }}',
    pluginVersion:'{{@ AppData.pluginVersion }}',
    projectName:'{{@ AppData.projectName }}',
    umiConfig:setDefaultUmiConfig(umiConfig),
}



//appdata
export function useAppData():IAppData{
    return AppData
}


function setDefaultUmiConfig(umiConfig:IUmiConfig):IUmiConfig{
    const {
        type = "browser",
        basename= "/",
        request={},
        routes=[{path:"/",element:'还没有设置任何路由'}]
    } = umiConfig

    return defineUmi({
        type,
        basename,
        request,
        routes
    })
}
export function UmiConfigToRouteObject(umiConfig:IUmiConfig):RouteObject[]{
    const routes:RouteObject[]=[]
    umiConfig.routes?.map((item)=>{

        routes.push({
            path:item.path,
            element:item.element,
            caseSensitive:item.caseSensitive,
            index:item.index,
            children:item.children,
            // @ts-ignore
            o:item
        })
    })
    return routes
}
