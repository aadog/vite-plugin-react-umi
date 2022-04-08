import {
    mergeConfig,
    Plugin,
    UserConfig
} from "vite";
import antd from "./antd";
import {IPluginOptions} from "./types";
import {template} from "./template";
import path from "path";
import {AppData} from "./appdata";


export default function umi(pluginOptions: IPluginOptions): Plugin {
    return {
        name: "vite-plugin-react-umi",
        enforce: "pre",
        config(config, env) {
            config = mergeConfig(config, {
                resolve: {
                    alias: [
                        {find: "umi", replacement: ".umi"},
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
            template.renderToProjectUmiFile("appData")
            template.renderToProjectUmiFile("types")
            template.renderToProjectUmiFile("umiConfig", ".tsx",)
            template.renderToProjectUmiFile("request")
            template.renderToProjectUmiFile("history")
            template.renderToProjectUmiFile("UmiApp", ".tsx")
            template.renderToProjectUmiFile("index")
        },

    }
}
