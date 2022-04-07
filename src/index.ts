import {Plugin} from "vite";
import umi from "./umi";
import {AppData} from "./appdata";
import {PluginOptions} from "./types";


function setPluginOptionsDefaults(options?:PluginOptions):PluginOptions{
    if(!options){
        options={}
    }
    const {
        runtime='src/main.tsx',
        antd = {style:'css'},
        request= true,
        history = {type:'browser',basename:"/"},
    }=options;
    antd.style=antd.style||'css'
    history.basename=history.basename||'/'
    history.type=history.type||'browser'
    const pluginOptions={
        runtime,
        antd,
        history,
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

