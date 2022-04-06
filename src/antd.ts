import {Alias, ConfigEnv, mergeConfig, Plugin, UserConfig} from "vite";
import {PluginOptions} from "./index";

const ANTD_IMPORT_LINE_REG = /import {[\w,\s]+} from (\'|\")antd(\'|\");?/g;

function transformToKebabCase (name: string) {
    return name.replace(/([^-])([A-Z])/g, '$1-$2').toLocaleLowerCase();
}
export interface AntdOptions{
    //使用css还是less,会自动配置按需导入
    style?: ("css" | "less")
    //是否使用ant design pro,会自动处理别名问题
    pro?:boolean
}

export class Antd {
    pluginOptions:PluginOptions
    constructor(pluginOptions:PluginOptions) {
        if(pluginOptions.antd){
            pluginOptions.antd.style=pluginOptions.antd.style || "css"
        }
        this.pluginOptions=pluginOptions
    }
    config(config: UserConfig, env: ConfigEnv): UserConfig{
        if(this.pluginOptions.antd){
            if (this.pluginOptions.antd.style == "less") {
                config=mergeConfig(config,{
                    css:{
                        preprocessorOptions:{
                            less: {
                                javascriptEnabled: true
                            }
                        }
                    }
                } as UserConfig)
            }
            if (this.pluginOptions.antd.pro == true) {
                config=mergeConfig(config,{
                    css:{
                        preprocessorOptions:{
                            less:{
                                javascriptEnabled: true,
                            }
                        }
                    },
                    resolve:{
                        alias:[
                            {find:/^~/,replacement:""},
                        ]
                    }
                } as UserConfig)
            }
        }
        return config
    }
    transform(code: string, id: string, options?: { ssr?: boolean }){
        if(this.pluginOptions.antd){
            if (/\"antd\";/.test(code)) {
                const style=this.pluginOptions.antd.style || "css"

                const importLine = code.match(ANTD_IMPORT_LINE_REG)![0];
                const cssLines = importLine
                    .match(/\w+/g)!
                    .slice(1, -2)
                    .map(name => `import "antd/lib/${transformToKebabCase(name)}/style/index.${style}";`)
                    .join('\n');
                return code.replace(ANTD_IMPORT_LINE_REG, `${importLine}\n${cssLines}`)
            }
        }
    }
}

