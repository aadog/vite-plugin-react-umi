import {
    mergeConfig,
    Plugin,
    UserConfig
} from "vite";
import antd from "./antd";
import {PluginOptions} from "./types";
import {template} from "./template";


export default function umi(pluginOptions: PluginOptions): Plugin {


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
            config=antd?.config(config, env)



            return config
        },
        transform(code: string, id: string, options?: { ssr?: boolean }) {
            code = antd.transform(code, id, options)


            return code;
        },
        configureServer(server) {


            template.renderToProjectUmi("appData")
            template.renderToProjectUmi("request")
            template.renderToProjectUmi("index")

        }
    }
}
