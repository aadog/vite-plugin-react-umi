import {
    HmrContext,
    mergeConfig, ModuleNode,
    Plugin,
    UserConfig
} from "vite";
import antd from "./antd";
import {IPluginOptions} from "./types";
import path from "path";
import {AppData} from "./appdata";



export default function umi(pluginOptions: IPluginOptions): Plugin {

    return {
        name: "vite-plugin-react-umi",
        enforce: "pre",
        watchChange:()=>{
          console.log("aaa")
        },

        config(config, env) {
            config = mergeConfig(config, {
                resolve: {
                    alias: [
                        {find: "umi", replacement: `${path.resolve(AppData.projectDir, `src/${AppData.pluginOptions.tempDir}`)}/`},
                        {find: "@/", replacement: `${path.resolve(AppData.projectDir, "src")}/`},
                    ]
                }
            } as UserConfig)
            config = antd?.config(config, env)

            return config
        },
        transform(code: string, id: string, options?: { ssr?: boolean }) {
            code = antd.transform(code, id, options)


            return code;
        },
        configureServer(server) {
            AppData.generateFiles()
        },

        handleHotUpdate(ctx: HmrContext): Array<ModuleNode> | void | Promise<Array<ModuleNode> | void> {
            if(ctx.file.endsWith("umiConfig.tsx")){
                AppData.generateFiles()
            }
        }
    }
}
