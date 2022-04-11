import {ConfigEnv, mergeConfig, UserConfig} from "vite";
import {AppData} from "./appdata";

const ANTD_IMPORT_LINE_REG = /import {[\w,\s]+} from (\'|\")antd(\'|\");?/g;

function transformToKebabCase (name: string) {
    return name.replace(/([^-])([A-Z])/g, '$1-$2').toLocaleLowerCase();
}


export default class Antd {

    static config(config: UserConfig, env: ConfigEnv): UserConfig{
        if(!AppData.pluginOptions.antd){
            return config
        }
        if (AppData.pluginOptions.antd.style == "less") {
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
        if (AppData.pluginOptions.antd.pro == true) {
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
        return config
    }
    static transform(code: string, id: string, options?: { ssr?: boolean }){
        if(!AppData.pluginOptions.antd){
            return code
        }
        if (!/(node_modules)/.test(id)&& /(\"antd\")|(\'antd\')/.test(code)) {
            const importLine = code.match(ANTD_IMPORT_LINE_REG)![0];
            const cssLines = importLine
                .match(/\w+/g)!
                .slice(1, -2)
                .map(name => {
                    if(name=="Row" || name=="Col"){
                        return ``
                    }
                    return `import "antd/es/${transformToKebabCase(name)}/style/index.${AppData.pluginOptions.antd.style}";`
                })
                .join('\n');
            return code.replace(ANTD_IMPORT_LINE_REG, `${importLine}\n${cssLines}`)
        }
    }
}

