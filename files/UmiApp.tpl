import React from "react";
import {
    HashRouter,
    MemoryRouter,
    BrowserRouter,
    useRoutes,
} from "react-router-dom";
import {AppData, UmiConfigToRouteObject} from "./appData";
import {Result, Spin} from "antd";
import {ModelProviderWrapper} from './modelRuntime'
import {useModel} from "./model";

type RenderElementProps={
    fallback: React.ReactElement;
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
    fallback?: React.ReactElement|null;
    notfound?: React.ReactElement|null;
    initLoading?: React.ReactElement|null;
    initError?: React.ReactElement|null;
}
export const UmiApp: React.FC<UmiAppProps> = (props) => {
    const fallback=props.fallback||<Spin size={"large"} tip={<div style={ {marginTop:10} }>加载中...</div>} style={ {width:"100%",height:"100%",top:"30%",position:'absolute'} }/>
    const notfound=props.notfound||<Result status="404" extra={"找不到页面"}/>
    const initLoading=props.initLoading||<Spin size={"large"} tip={<div style={ {marginTop:10} }>系统正在初始化...</div>} style={ {width:"100%",height:"100%",top:"30%",position:'absolute'} }/>
    const initError=props.initError||<Result status={'error'} extra={"App初始化失败"}/>

    return (
        <ModelProviderWrapper>
            <UmiAppEntry fallback={fallback} notfound={notfound} initLoading={initLoading} initError={initError} />
        </ModelProviderWrapper>
    )
}

type UmiAppEntryProps = {
    fallback: React.ReactElement;
    notfound: React.ReactElement;
    initLoading: React.ReactElement;
    initError: React.ReactElement;
}
export const UmiAppEntry: React.FC<UmiAppEntryProps> = (props) => {
    const initialStateModel=useModel("@@initialState")
    if(initialStateModel.loading){
        return props.initLoading
    }
    if(initialStateModel.error){
        return props.initError
    }
    return (
        <DynamicRouter type={AppData.umiConfig.type} basename={AppData.umiConfig.basename}>
            <RenderElement fallback={props.fallback} notfound={props.notfound}/>
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


