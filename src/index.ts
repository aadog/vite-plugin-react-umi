import {Plugin} from "vite";
import umi from "./umi";
import {AppData} from "./appdata";
import {PluginOptions} from "./types";


function setPluginOptionsDefaults(options?:PluginOptions):PluginOptions{
    if(!options){
        options={}
    }
    const {
        runtime='/src/main.tsx',
        antd = {style:'css'},
        request= true,
        route = {base:"/"},
    }=options;
    antd.style=antd.style||'css'
    const pluginOptions={
        runtime,
        antd,
        route,
        request,
    }
    return pluginOptions
}
export default function reactUmi(options?: PluginOptions): Plugin[] {
    const pluginOptions = setPluginOptionsDefaults(options)
    AppData.initAppData(pluginOptions)



    return [umi(pluginOptions), ...usePlugins(pluginOptions)]
}
function usePlugins(options: PluginOptions):Plugin[]{
    const plugins:Plugin[]=[]
    return plugins
}

