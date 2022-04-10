import {IUmiConfig, IAppData, defineUmi, IRoute} from './types'
import umiConfig from "./umiConfig";
import {RouteObject} from "react-router-dom";
import {Result} from "antd";
import React, {ReactElement, useContext} from "react";
import {useAccess} from "./access";
import {UmiAppContext} from "./UmiAppContext";

//appdata
export function useAppData():IAppData{
    const config=setDefaultUmiConfig(umiConfig)
    return {
        pluginName:'{{@ AppData.pluginName }}',
        pluginVersion:'{{@ AppData.pluginVersion }}',
        projectName:'{{@ AppData.projectName }}',
        umiConfig:config,
    }
}


function setDefaultUmiConfig(umiConfig:IUmiConfig):IUmiConfig{
    const defaultRouter:IRoute={path:"*",element:<Result status={'success'} title={`vite-plugin-react-umi 1.0.53`} extra={"现在没有路由,在umiConfig中配置"} />}
    const {
        type = "browser",
        basename= "/",
        request={},
        routes=[{path:"*",element:<Result status={'success'} title={`<%= AppData.pluginName %> <%= AppData.pluginVersion %>`} extra={"现在没有路由,在umiConfig中配置"} />} as IRoute],
        getInitialState = ()=>{return Promise.resolve(undefined)}
    } = umiConfig
    if(routes.length==0){
        routes.push(defaultRouter)
    }

    return defineUmi({
        ...umiConfig,
        type,
        basename,
        request,
        routes,
        getInitialState,
    })
}

function WrapRoute(props:any){
    const umiAppContext = useContext(UmiAppContext);
    const access=useAccess()
    if(props.access){
        if(typeof props.access=='string'){
            if(access[props.access]!=true){
                return umiAppContext.noAccess
            }
        }else if((typeof props.access=="object")&&props.access.length>0){
            for (const acc of props.access) {
                if(access[props.access]!=true){
                    return umiAppContext.noAccess
                }
            }
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}
function transformRoute(route:IRoute){
    let element=route.element
    route.element = (
        <WrapRoute access={route.access} meta={route.meta}>
            {element}
        </WrapRoute>
    )
    if(route.children){
        for (let i = 0; i < route.children.length; i++) {
            transformRoute(route.children[i])
        }
    }
}
export function transformRoutes(umiConfig:IUmiConfig):RouteObject[]{
    const routes:RouteObject[]=[]
    umiConfig.routes?.map((item)=>{
        transformRoute(item)

        routes.push({
            path:item.path,
            element:item.element,
            caseSensitive:item.caseSensitive,
            index:item.index,
            children:item.children,
        })
    })
    return routes
}
