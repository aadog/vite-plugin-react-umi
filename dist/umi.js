"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const antd_1 = __importDefault(require("./antd"));
const template_1 = require("./template");
const appdata_1 = require("./appdata");
function umi(pluginOptions) {
    return {
        name: "vite-plugin-react-umi",
        enforce: "pre",
        config(config, env) {
            config = (0, vite_1.mergeConfig)(config, {
                resolve: {
                    alias: [
                        { find: "umi", replacement: ".umi" },
                    ]
                }
            });
            config = antd_1.default?.config(config, env);
            return config;
        },
        transform(code, id, options) {
            code = antd_1.default.transform(code, id, options);
            return code;
        },
        configureServer(server) {
            template_1.template.renderToProjectUmiFile("appData");
            if (appdata_1.AppData.pluginOptions.request) {
                template_1.template.renderToProjectUmiFile("request");
            }
            template_1.template.renderToProjectUmiFile("history");
            template_1.template.renderToProjectUmiFile("UmiApp", ".tsx");
            template_1.template.renderToProjectUmiFile("index");
        }
    };
}
exports.default = umi;
//# sourceMappingURL=umi.js.map