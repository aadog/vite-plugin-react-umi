import React from "react";
import {
    HashRouter,
    MemoryRouter,
    BrowserRouter,
    useRoutes,
} from "react-router-dom";
import {AppData, UmiConfigToRouteObject} from "./appData";
import {Result, Spin} from "antd";

type RenderElementProps={
    fallback: NonNullable<React.ReactNode>|null;
    notfound: React.ReactElement|null;
}
const RenderElement: React.FC<RenderElementProps> = (props) => {
    const routePage = useRoutes(UmiConfigToRouteObject(AppData.umiConfig))
    if(!routePage){
        return props.notfound
    }
    const element=React.createElement(routePage.type,{
        ...routePage.props,
    })
    return (
        <React.Suspense fallback={props.fallback}>
            {element}
        </React.Suspense>
    )
}

type UmiAppProps = {
    fallback?: NonNullable<React.ReactNode>|null;
    notfound?: React.ReactElement|null;
}
export const UmiApp: React.FC<UmiAppProps> = (props) => {
    const fallback=props.fallback||<Spin size={"large"} tip={<div style={ {marginTop:10} }>加载中...</div>} style={ {width:"100%",height:"100%",top:"30%",position:'absolute'} }/>
    const notfound=props.notfound||<Result status="404" title={"找不到页面"}/>
    return (
        <DynamicRouter type={AppData.umiConfig.type} basename={AppData.umiConfig.basename}>
            <RenderElement fallback={fallback} notfound={notfound} />
        </DynamicRouter>
    )
}

type DynamicRouterProps = {
    type?: string
    children: React.ReactNode
    basename?: string
}
const DynamicRouter: React.FC<DynamicRouterProps> = (props) => {
    if (props.type == "memory") {
        return <MemoryRouter basename={props.basename} children={props.children}/>
    }
    if (props.type == "hash") {
        return <HashRouter basename={props.basename} children={props.children}/>
    }
    return <BrowserRouter basename={props.basename} children={props.children}/>
}


