import {IUmiConfig, IAppData, defineUmi, IRoute} from './types'
import umiConfig from "./umiConfig";
import {RouteObject,Navigate} from "react-router-dom";
import {Result} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useAccess} from "./access";
import {IUmiAppContext, UmiAppContext} from "./UmiAppContext";
import {RouteContext} from "./RouteContext";

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
    element?: React.ReactElement|string|Function;
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

const getWrapRoutePropsElement= async (props: WrapRouteProps, umiAppContext: IUmiAppContext) => {
    let struct: {
        access?: string[]
        element: React.ReactElement | string
        isValidElement: boolean
        isElementType:boolean
        //同步,默认true
        getInitialPropsSync?: boolean | undefined
        getInitialProps?:Function|object
        meta: {
            //标题
            title?: string
            [name: string]: any
        }
    } = {
        access:[],
        isValidElement: false,
        element: "",
        meta: {},
        isElementType:false,
    }
    //如果不是组件
    if (typeof props.element == "string") {
        struct.isValidElement = false
        struct.element = props.element as string
        if (typeof props.access == "string") {
            struct.access?.push(props.access)
        } else if (typeof props.access == "object" && props.access.length > 0) {
            struct.access?.push(...props.access)
        }
        struct.getInitialPropsSync = props.getInitialPropsSync
        if (struct.getInitialPropsSync == undefined) {
            struct.getInitialPropsSync = umiAppContext.initialPropsSync
        }
        struct.meta = {
            ...props.meta
        }
        return struct
    }
    if (typeof props.element == "function") {
        //组件类型
        struct.isValidElement = true
        struct.element = React.createElement(props.element as React.FC)
        struct.isElementType=true
    }

    // @ts-ignore
    if (props.element._payload?._status) {//是lazy组件类型
        console.log("lazy异步组件类型")
        struct.isElementType=true
        const el=React.createElement(props.element as React.ElementType)
        // @ts-ignore
        if (el.type._payload?._status == -1) {
            // @ts-ignore
            const load=(await (await el.type._payload?._result)()).default
            struct.element=load
            struct.isValidElement=true
            // @ts-ignore
        }else if(el.type._payload?._status==1){
            // @ts-ignore
            const load=(await el.type._payload?._result)
            struct.element=load
            struct.isValidElement=true
        }
        // @ts-ignore
    }else if (props.element?.type?._payload?._status != undefined) {  //是lazy组件
        console.log("lazy异步组件")
        const el=props.element
        // @ts-ignore
        if (el.type._payload?._status == -1) {
            // @ts-ignore
            const load=(await (await el.type._payload?._result)()).default
            struct.element=load
            struct.isValidElement=true
            // @ts-ignore
        }else if(el.type._payload?._status==1){
            // @ts-ignore
            const load=(await el.type._payload?._result)
            struct.element=load
            struct.isValidElement=true
        }
    }else{
        struct.element=props.element as React.ReactElement
        struct.isValidElement=true
    }
    if(!struct.element){
        throw Error(`路由解析element失败,path:${props.path}`)
    }

    if (typeof props?.access == "string") {
        struct.access?.push(props.access)
    } else if (typeof props.access == "object" && props.access.length > 0) {
        struct.access?.push(...props.access)
    }

    // @ts-ignore
    struct.getInitialPropsSync = props.getInitialProps
    if (struct.getInitialPropsSync == undefined) {
        struct.getInitialPropsSync = umiAppContext.initialPropsSync
    }

    struct.meta = {
        // @ts-ignore
        ...struct.element?.meta,
        ...props.meta,

    }

    // @ts-ignore
    struct.getInitialProps=struct.element?.getInitialProps||struct.element?.type?.getInitialProps
    // @ts-ignore
    const access=struct.element?.access||struct.element?.type?.access||props?.access
    if (typeof access == "string") {
        struct.access?.push(access)
    } else if (typeof access == "object" && access.length > 0) {
        struct.access?.push(...access)
    }
    return struct
}
// @ts-ignore
const WrapRoute: React.FC<WrapRouteProps> = (props) => {
    const umiAppContext = useContext(UmiAppContext);
    const routeContext = useContext(RouteContext);
    const access = useAccess()
    const [elState, setElState] = useState<{
        access?: string[]
        element: React.ReactElement | string
        isValidElement: boolean
        isElementType:boolean
        //同步,默认true
        getInitialPropsSync?: boolean | undefined
        getInitialProps?:Function|object
        meta: {
            //标题
            title?: string
            [name: string]: any
        }
    }>();
    const [authState, setAuthState] = useState<{
        auth: boolean
        allows?: string[]
        forbid?: string
    } | undefined>(undefined);
    const [initialPropsState, setInitialPropsState] = useState<Record<string, any>|undefined>(undefined);


    useEffect(() => {
        (async () => {
            const el = await getWrapRoutePropsElement(props, umiAppContext)
            setElState(el)
            // @ts-ignore
            if (access && el.access && !useAppData().umiConfig.skipAccess&&routeContext.route?.props?.skipAccess!=true) {
                const allows:string[] = []
                let forbid = undefined
                if (typeof el.access == 'string') {
                    if (access[el.access as string] != true) {
                        forbid = el.access
                        setAuthState({auth:false,allows:allows,forbid:forbid})
                        return
                    }
                    allows.push(el.access)
                } else if ((typeof el.access == "object") && el.access.length!=undefined) {
                    for (const a of el.access) {
                        if (access[a] != true) {
                            forbid = el.access
                            forbid = a
                            setAuthState({auth:false,allows:allows,forbid:forbid})
                            return
                        }
                        allows.push(a)
                    }
                }
                setAuthState({auth: true, allows: el.access,forbid:forbid})
            } else {
                setAuthState({auth: true, allows: el.access})
            }
            if(el.getInitialProps){
                if(typeof el.getInitialProps=="function"){
                    const result=el.getInitialProps()
                    if(result instanceof Promise){
                        setInitialPropsState(await result)
                    }else{
                        setInitialPropsState(result)
                    }
                }else{
                    setInitialPropsState(el.getInitialProps)
                }
            }else{
                setInitialPropsState({})
            }
        })()
        // @ts-ignore
    }, [routeContext.route?.props?.skipAccess])



    if (authState == undefined) {
        return umiAppContext.loading
    } else if (authState.auth == false) {
        return React.cloneElement(umiAppContext.noAccess, authState)
    }else if(!elState?.isValidElement){
        return props.element
    }else if(elState.getInitialPropsSync&&initialPropsState==undefined){
        return umiAppContext.loading
    }


    const newProps={
        access:elState.access,
        ...initialPropsState,
        path:props.path,
        getInitialPropsSync:elState.getInitialPropsSync,
        meta:elState.meta,
        initialedProps:initialPropsState!=undefined,
        auth:authState,
    }
    let el:React.ReactElement
    if(elState.isElementType){
        // @ts-ignore
        el=React.createElement(props.element as React.FunctionComponent,{...newProps,})
    }else{
        el=React.cloneElement(props.element as React.ReactElement,newProps)
    }
    return el
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
            <WrapRoute {...route} key={route.path}>
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
