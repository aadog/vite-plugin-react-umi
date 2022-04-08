import React, {ReactNode} from "react";
import {
    HashRouter,
    MemoryRouter,
    BrowserRouter,
    useRoutes,
} from "react-router-dom";
import {AppData, UmiConfigToRouteObject} from "./appData";
import {Result, Spin} from "antd";

type RenderElementProps={
    fallback: NonNullable<ReactNode>|null;
}
const RenderElement: React.FC<RenderElementProps> = (props) => {
    const routePage = useRoutes(UmiConfigToRouteObject(AppData.umiConfig))
    if(!routePage){
        return <Result status="404" title={"找不到页面"}/>
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
    fallback?: NonNullable<ReactNode>|null;
}
export const UmiApp: React.FC<UmiAppProps> = (props) => {

    return (
        <DynamicRouter type={AppData.umiConfig.type} basename={AppData.umiConfig.basename}>
            <RenderElement fallback={props.fallback||<Spin/>}/>
        </DynamicRouter>
    )
}

type DynamicRouterProps = {
    type?: string
    children: ReactNode
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


