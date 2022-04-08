import { createHashHistory, createMemoryHistory, createBrowserHistory, History } from 'history';
export { createSearchParams, Link, matchPath, matchRoutes, NavLink, Outlet, useLocation, useMatch, useNavigate, useOutlet, useParams, useResolvedPath, useRoutes, useSearchParams,BrowserRouter,Routes,Route} from 'react-router-dom';
import {AppData} from "./appData";

let history: History;
export function createHistory(opts: any) {
    if (opts.type === 'hash') {
        history = createHashHistory();
    } else if (opts.type === 'memory') {
        history = createMemoryHistory();
    } else {
        history = createBrowserHistory();
    }
    return history;
}
history=createHistory(AppData.umiConfig.type)
export { history };
