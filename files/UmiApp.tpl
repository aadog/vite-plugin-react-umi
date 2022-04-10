import React from "react";
import {
    HashRouter,
    MemoryRouter,
    BrowserRouter,
    useRoutes,
} from "react-router-dom";
import {useAppData, transformRoutes} from "./appData";
import {Result, Spin} from "antd";
import {ModelProviderWrapper} from './model/runtime'
import {useModel} from "./model";
import {Provider as AccessProvider} from './access/runtime'
import {UmiAppContext} from "./UmiAppContext";

type RenderElementProps={

}
const RenderElement: React.FC<RenderElementProps> = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    const routePage = useRoutes(transformRoutes(useAppData().umiConfig))
    if(!routePage){
        return umiAppContext.notfound
    }
    return (
        <>
            <React.Suspense fallback={umiAppContext.loading}>
                {routePage}
            </React.Suspense>
        </>
    )
}

export const InitialStateError:React.FC<any> = (props) => {
    const initialStateModel=useModel("@@initialState")
    return <Result status={'error'} extra={`App初始化失败:${initialStateModel.error}`}/>
}

type UmiAppProps = {
    loading?: React.ReactElement|null;
    notfound?: React.ReactElement|null;
    initialStateLoading?: React.ReactElement|null;
    initialStateError?: React.ReactElement|null;
    initialStateSync?: boolean
    noAccess?:React.ReactElement
}
export const UmiApp: React.FC<UmiAppProps> = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    umiAppContext.initialStateSync=props.initialStateSync==false||umiAppContext.initialStateSync
    umiAppContext.initialStateLoading=props.initialStateLoading||umiAppContext.initialStateLoading
    umiAppContext.initialStateError=props.initialStateError||umiAppContext.initialStateError
    umiAppContext.loading=props.loading||umiAppContext.loading
    umiAppContext.notfound=props.loading||umiAppContext.notfound
    return (
        <UmiAppContext.Provider value={umiAppContext}>
            <ModelProviderWrapper>
                <AccessProvider>
                    <UmiAppEntry />
                </AccessProvider>
            </ModelProviderWrapper>
        </UmiAppContext.Provider>
    )
}

type UmiAppEntryProps = {

}
export const UmiAppEntry: React.FC<UmiAppEntryProps> = (props) => {
    const umiAppContext = React.useContext(UmiAppContext);
    if(umiAppContext.initialStateSync){
        const initialStateModel=useModel("@@initialState")
        if(initialStateModel.loading){
            return umiAppContext.initialStateLoading
        }
        if(initialStateModel.error){
            return umiAppContext.initialStateError
        }
    }

    return (
        <DynamicRouter type={useAppData().umiConfig.type} basename={useAppData().umiConfig.basename}>
            <RenderElement />
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


