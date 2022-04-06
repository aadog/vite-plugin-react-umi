import {Plugin} from "vite";
import umi from "./umi";
import {AntdOptions} from "./antd";
import {RequestOptions} from "./request";


export interface PluginOptions {
    //默认为 /src/main.tsx
    runtime?: '/src/main.tsx'|'/src/App.tsx'|string
    //默认不开启
    antd?: AntdOptions
    //默认{}
    request?:RequestOptions|false
}
export {AntdOptions}


export default function vitePluginReactUmi(options?:PluginOptions):Plugin[]{
    if(!options){
        options={

        }
    }
    if(options.request!=false&&!options.request){
        options.request={

        }
    }
    if(!options.runtime){
        options.runtime='/src/main.tsx'
    }


    return [umi(options),...usePlugins(options)]
}


function usePlugins(options: PluginOptions):Plugin[]{
    const plugins:Plugin[]=[]
    return plugins
}

