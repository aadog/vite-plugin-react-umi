import {IUmiConfig, IAppData, defineUmi, IRoute} from './types'
import umiConfig from "./umiConfig";
import {RouteObject,Navigate} from "react-router-dom";
import {Result} from "antd";
import React, {useContext, useEffect, useState} from "react";
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
        getInitialState = ()=>{return undefined},
        access= ()=>{return {}}
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
        access,
    })
}

type WrapRouteProps={
    //是否区分大小写
    caseSensitive?: boolean;
    index?: boolean;
    path?: string;
    element?: React.ReactElement|string;
    //同步,默认true
    getInitialPropsSync?:boolean|undefined
    //权限
    access?: string|string[]
    //元数据
    meta?:{
        //标题
        title?: string
        [name:string]:any
    }
    [name:string]:any
}
// @ts-ignore
const WrapRoute: React.FC<WrapRouteProps> = (props) => {
    const umiAppContext = useContext(UmiAppContext);
    const access = useAccess()
    if (access && props.access && !useAppData().umiConfig.skipAccess) {
        if (typeof props.access == 'string') {
            if (access[props.access as string] != true) {
                return umiAppContext.noAccess
            }
        } else if ((typeof props.access == "object") && props.access.length > 0) {
            for (const a of props.access) {
                if (access[a] != true) {
                    return umiAppContext.noAccess
                }
            }
        }
    }
    if (!React.isValidElement(props.element)) {
        return props.element||null
    }
    const [initialProps, setInitialProps] = useState<Record<string, any> | undefined>(undefined);

    // @ts-ignore
    const isLazy = props.element?.type?.$$typeof?.toString().includes("react.lazy")
    useEffect(() => {
        (async () => {
            let getinitialProps: Function | undefined
            if (isLazy) {
                // @ts-ignore
                const result=(await props.element?.type?._payload?._result)
                if(typeof result=="function"){
                    getinitialProps=(await result())?.default?.getInitialProps
                }else{
                    // @ts-ignore
                    getinitialProps = result?.default?.getInitialProps
                }
            } else {
                // @ts-ignore
                getinitialProps = props.element?.type?.getInitialProps
            }
            if (getinitialProps && typeof getinitialProps == "function") {
                const initialProps = getinitialProps()
                if (initialProps instanceof Promise) {
                    setInitialProps(await initialProps)
                } else {
                    setInitialProps(initialProps)
                }
            } else {
                setInitialProps({})
            }
        })()
    }, []);

    if(initialProps==undefined){
        let getInitialPropsSync=props.getInitialPropsSync
        if(getInitialPropsSync==undefined){
            getInitialPropsSync=umiAppContext.initialPropsSync
        }
        if(getInitialPropsSync==true){
            return umiAppContext.loading
        }
    }

    return (
        <>
            {React.createElement(props.element.type,{
                ...props,
                ...initialProps,
                initialedProps:initialProps!=undefined,
            })}
        </>
    )
}
function transformRoute(route:IRoute){
    if(route.redirect){
        route.element=<Navigate to={route.redirect}></Navigate>
    }else if(route.element){
        // @ts-ignore
        route.access=route.element.access||route.access
        // @ts-ignore
        route.meta=route.element.meta||route.meta
        route.getInitialPropsSync=route.getInitialPropsSync
        route.element = (
            <WrapRoute {...route}>
                {route.element}
            </WrapRoute>
        )
    }
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
