import {Plugin} from "vite";
import umi from "./umi";
import {AppData} from "./appdata";
import {IPluginOptions, IUmiConfig} from "./types";

export function defineUmi(umiConfig:IUmiConfig):IUmiConfig{
    return umiConfig
}
function setPluginOptionsDefaults(options?:IPluginOptions):IPluginOptions{
    if(!options){
        options={}
    }
    const {
        runtime='src/main.tsx',
        antd = {style:'css'},
        // request= true,
        // router = {type:'browser',basename:"/"},
        // routes = []
    }=options;
    antd.style=antd.style||'css'
    // router.basename=router.basename||'/'
    // router.type=router.type||'browser'

    const pluginOptions={
        runtime,
        antd,
        // router,
        // request,
        // routes,
    }
    return pluginOptions
}
export function createUmi(options?:IPluginOptions): Plugin[] {

    const pluginOptions = setPluginOptionsDefaults(options)
    const errInitAppData=AppData.initAppData(pluginOptions)
    if(errInitAppData){
        console.error(`createUmi失败:${errInitAppData}`)
        return []
    }



    return [umi(pluginOptions), ...usePlugins(pluginOptions)]
}
function usePlugins(options: IPluginOptions):Plugin[]{
    const plugins:Plugin[]=[]
    return plugins
}

export * from './types'

