import React from "react";
import {Result, Spin} from "antd";
import {useModel} from "./model";
import {RouteObject} from "react-router-dom";

export const InitialStateError:React.FC<any> = (props) => {
    const initialStateModel=useModel("@@initialState")
    return <Result status={'error'} extra={`App初始化失败:${initialStateModel.error}`}/>
}

export interface IUmiAppContext{
    loading: React.ReactElement|null;
    notfound: React.ReactElement|null;
    initialStateLoading: React.ReactElement|null;
    initialStateError: React.ReactElement|null;
    initialStateSync: boolean
    initialPropsSync: boolean
    noAccess:React.ReactElement
    routes?:RouteObject[]
    [name:string]:any
}
export const UmiAppContext =React.createContext<IUmiAppContext>({
    initialStateLoading:<Spin size={"large"} tip={<div style={ {marginTop:10} }>系统正在初始化...</div>} style={ {width:"100%",height:"100%",top:"30%",position:'absolute'} }/>,
    initialStateError:<InitialStateError />,
    initialStateSync:true,
    initialPropsSync:true,
    loading:<Spin size={"large"} tip={<div style={ {marginTop:10} }>加载中...</div>} style={ {width:"100%",height:"100%",top:"30%",position:'absolute'} }/>,
    notfound:<Result status="404" extra={"找不到页面"} />,
    noAccess: <Result status="403" extra={"没有权限访问"} />,
})

