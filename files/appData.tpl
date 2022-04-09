import {IUmiConfig, IAppData, defineUmi, IRoute} from './types'
import umiConfig from "./umiConfig";
import {RouteObject} from "react-router-dom";
import {Result} from "antd";


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
    const defaultRouter:IRoute={path:"*",element:<Result status={'success'} title={`vite-plugin-react-umi 1.0.53`} extra={"现在没有路由,在umiConfig中配置"} />}
    const {
        type = "browser",
        basename= "/",
        request={},
        routes=[{path:"*",element:<Result status={'success'} title={`<%= AppData.pluginName %> <%= AppData.pluginVersion %>`} extra={"现在没有路由,在umiConfig中配置"} />}]
    } = umiConfig
    if(routes.length==0){
        routes.push(defaultRouter)
    }

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
