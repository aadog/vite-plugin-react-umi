"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const antd_1 = __importDefault(require("./antd"));
const path_1 = __importDefault(require("path"));
const appdata_1 = require("./appdata");
function umi(pluginOptions) {
    return {
        name: "vite-plugin-react-umi",
        enforce: "pre",
        config(config, env) {
            config = (0, vite_1.mergeConfig)(config, {
                resolve: {
                    alias: [
                        { find: "umi", replacement: `${path_1.default.resolve(appdata_1.AppData.projectDir, `src/${appdata_1.AppData.pluginOptions.tempDir}`)}/` },
                        { find: "@/", replacement: `${path_1.default.resolve(appdata_1.AppData.projectDir, "src")}/` },
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
            appdata_1.AppData.generateFiles();
        },
        handleHotUpdate(ctx) {
            if (path_1.default.basename(ctx.file) == 'umiConfig.tsx' && path_1.default.basename(path_1.default.dirname(ctx.file)).toLowerCase() == appdata_1.AppData.projectName.toLowerCase()) {
                appdata_1.AppData.generateFiles();
            }
        }
    };
}
exports.default = umi;
//# sourceMappingURL=umi.js.map