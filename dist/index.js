"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const umi_1 = __importDefault(require("./umi"));
const appdata_1 = require("./appdata");
function setPluginOptionsDefaults(options) {
    if (!options) {
        options = {};
    }
    const { runtime = '/src/main.tsx', antd = { style: 'css' }, request = true, route = { base: "/" }, } = options;
    antd.style = antd.style || 'css';
    const pluginOptions = {
        runtime,
        antd,
        route,
        request,
    };
    return pluginOptions;
}
function reactUmi(options) {
    const pluginOptions = setPluginOptionsDefaults(options);
    appdata_1.AppData.initAppData(pluginOptions);
    return [(0, umi_1.default)(pluginOptions), ...usePlugins(pluginOptions)];
}
exports.default = reactUmi;
function usePlugins(options) {
    const plugins = [];
    return plugins;
}
//# sourceMappingURL=index.js.map