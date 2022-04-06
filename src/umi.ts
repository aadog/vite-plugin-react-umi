import {
    mergeConfig,
    Plugin,
    UserConfig
} from "vite";
import {PluginOptions} from "./index";
import {Antd} from "./antd";
import {
    generateFile,
    getAppRuntimeExports,
    getPackageData,
    getPluginPackageId, rmGenerateFile,
} from "./util";
import {rmdirSync} from "fs";



export default function (pluginOptions: PluginOptions): Plugin {



    const antd = new Antd(pluginOptions)
    return {
        name: "vite-plugin-react-umi",
        enforce: "pre",
        config(config, env) {
            config = mergeConfig(config, {
                resolve: {
                    alias: [
                        {find: "umi", replacement: ".umi"},
                    ]
                }
            } as UserConfig)
            if (pluginOptions.antd) {
                config = antd?.config(config, env)
            }


            return config
        },
        transform(code: string, id: string, options?: { ssr?: boolean }) {
            if (pluginOptions.antd) {
                code = antd.transform(code, id, options)
            }


            return code;
        },
        configureServer(server) {

            const runtimeExports=getAppRuntimeExports(pluginOptions.runtime)
            generateFile("appData.ts",{
                version:getPackageData(getPluginPackageId()).data.version,
                basename:"/",
            })
            if (pluginOptions.request){
                console.log(pluginOptions.request)
                generateFile("request.ts",{
                    runtimeRequestConfig:runtimeExports.includes('request')?`import {request as runtimeRequestConfig} from '${pluginOptions.runtime}'`:"",
                    insertRuntimeReuqestConfig:runtimeExports.includes('request')?`
    if(runtimeRequestConfig){
        config = {
            ...config,
            ...runtimeRequestConfig
        }
    }
                `:""
                })
            }else{
                rmGenerateFile("request.ts")
            }
            generateFile("index.ts",{
                importRequest: pluginOptions.request?`export * from './request'`:""
            })

        }
    }
}
