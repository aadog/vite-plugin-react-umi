import React from "react";
import {AppData} from "./appData";
import {BrowserRouter, BrowserRouterProps, HashRouter, MemoryRouter, Route, Routes} from "react-router-dom";
type Props={

}
export const UmiApp: React.FC<Props> = (props) => {

    return (
        <DynamicRouter basename={AppData.history.basename}>
            <Routes>
                <Route path={"/aa"} element={"bbxx"}>
                    <Routes>
                        <Route path={"/bb"} element={"xx"}></Route>
                    </Routes>
                </Route>
            </Routes>
        </DynamicRouter>
    );
}

function DynamicRouter({ basename, children, window, }: BrowserRouterProps):JSX.Element{
    const type=AppData.history.type
    if(type=="hash"){
        return <HashRouter basename={basename} children={children} window={window} />
    }else if(type=="memory"){
        return <MemoryRouter basename={basename} children={children} />
    }else{
        return <BrowserRouter basename={basename} children={children} window={window} />
    }
}
