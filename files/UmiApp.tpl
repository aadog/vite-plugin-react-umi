import React, {ReactNode} from "react";
import {
    Router,
    useRoutes,
} from "react-router-dom";
import {history} from "./history";
import {AppData, UmiConfigToRouteObject} from "./appData";

type RenderElementProps={
    fallback: NonNullable<ReactNode>|null;
}
const RenderElement: React.FC<RenderElementProps> = (props) => {
    const routePage = useRoutes(UmiConfigToRouteObject(AppData.umiConfig))
    if(!routePage){
        return <>"404 notfound"</>
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
        <Router location={history.location} navigator={history}>
            <RenderElement fallback={props.fallback||null}/>
        </Router>
    )
}

