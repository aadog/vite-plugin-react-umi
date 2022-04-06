"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const appdata_1 = require("./appdata");
const ANTD_IMPORT_LINE_REG = /import {[\w,\s]+} from (\'|\")antd(\'|\");?/g;
function transformToKebabCase(name) {
    return name.replace(/([^-])([A-Z])/g, '$1-$2').toLocaleLowerCase();
}
class Antd {
    static config(config, env) {
        if (!appdata_1.AppData.pluginOptions.antd) {
            return config;
        }
        if (appdata_1.AppData.pluginOptions.antd.style == "less") {
            config = (0, vite_1.mergeConfig)(config, {
                css: {
                    preprocessorOptions: {
                        less: {
                            javascriptEnabled: true
                        }
                    }
                }
            });
        }
        if (appdata_1.AppData.pluginOptions.antd.pro == true) {
            config = (0, vite_1.mergeConfig)(config, {
                css: {
                    preprocessorOptions: {
                        less: {
                            javascriptEnabled: true,
                        }
                    }
                },
                resolve: {
                    alias: [
                        { find: /^~/, replacement: "" },
                    ]
                }
            });
        }
        return config;
    }
    static transform(code, id, options) {
        if (!appdata_1.AppData.pluginOptions.antd) {
            return code;
        }
        if (/\"antd\";/.test(code)) {
            const importLine = code.match(ANTD_IMPORT_LINE_REG)[0];
            const cssLines = importLine
                .match(/\w+/g)
                .slice(1, -2)
                .map(name => `import "antd/lib/${transformToKebabCase(name)}/style/index.${appdata_1.AppData.pluginOptions.antd.style}";`)
                .join('\n');
            return code.replace(ANTD_IMPORT_LINE_REG, `${importLine}\n${cssLines}`);
        }
    }
}
exports.default = Antd;
//# sourceMappingURL=antd.js.map