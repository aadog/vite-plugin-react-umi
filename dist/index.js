"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUmi = exports.defineUmi = void 0;
const umi_1 = __importDefault(require("./umi"));
const appdata_1 = require("./appdata");
const vite_plugin_style_import_1 = require("vite-plugin-style-import");
function defineUmi(umiConfig) {
    return umiConfig;
}
exports.defineUmi = defineUmi;
function setPluginOptionsDefaults(options) {
    if (!options) {
        options = {};
    }
    const { antd = { style: 'css' }, tempDir = ".umi" } = options;
    antd.style = antd.style || 'css';
    const pluginOptions = {
        antd,
        tempDir: tempDir
    };
    return pluginOptions;
}
function createUmi(options) {
    const pluginOptions = setPluginOptionsDefaults(options);
    const errInitAppData = appdata_1.AppData.initAppData(pluginOptions);
    if (errInitAppData) {
        console.error(`createUmi失败:${errInitAppData}`);
        return [];
    }
    return [(0, umi_1.default)(pluginOptions), ...usePlugins(pluginOptions)];
}
exports.createUmi = createUmi;
function usePlugins(options) {
    const plugins = [];
    if (!appdata_1.AppData.pluginOptions.antd) {
        plugins.push((0, vite_plugin_style_import_1.createStyleImportPlugin)({
            resolves: [
                (0, vite_plugin_style_import_1.AntdResolve)(),
            ]
        }));
    }
    return plugins;
}
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map