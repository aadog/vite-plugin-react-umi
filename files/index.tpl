export {useAppData,AppData} from "./appData"
export {history,createSearchParams, Link, matchPath, matchRoutes, NavLink, Outlet, useLocation, useMatch, useNavigate, useOutlet, useParams, useResolvedPath, useRoutes, useSearchParams,BrowserRouter,Routes,Route} from "./history"
<%if(AppData.pluginOptions.request){
print(`export { useRequest, UseRequestProvider, request } from './request'`)
}%>
export {UmiApp} from './UmiApp'
